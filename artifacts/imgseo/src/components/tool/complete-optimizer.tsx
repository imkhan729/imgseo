import { lazy, Suspense, useRef, useState, useEffect } from "react";
import { Upload, Image as ImageIcon, MapPin, Loader2, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import piexif from "piexifjs";
import JSZip from "jszip";
import { cn } from "@/lib/utils";

const GeoMap = lazy(() => import("./geo-map").then((module) => ({ default: module.GeoMap })));

type OutputFormat = "image/jpeg" | "image/webp" | "image/png" | "image/avif";

// --- EXIF/Binary Helpers (same as geotagger) ---
function stringToBytes(value: string): Uint8Array {
  const bytes = new Uint8Array(value.length);
  for (let index = 0; index < value.length; index++) bytes[index] = value.charCodeAt(index) & 0xff;
  return bytes;
}

function degToDms(value: number): [[number, number], [number, number], [number, number]] {
  const deg = Math.floor(value);
  const min = Math.floor((value - deg) * 60);
  const sec = Math.round((((value - deg) * 60) - min) * 60 * 1000);
  return [[deg, 1], [min, 1], [sec, 1000]];
}

function createExifBytes(lat: number, lng: number, title?: string, description?: string): Uint8Array {
  const exifObj: Record<string, Record<number, unknown>> = {
    GPS: {
      [piexif.GPSIFD.GPSLatitudeRef]: lat >= 0 ? "N" : "S",
      [piexif.GPSIFD.GPSLatitude]: degToDms(Math.abs(lat)),
      [piexif.GPSIFD.GPSLongitudeRef]: lng >= 0 ? "E" : "W",
      [piexif.GPSIFD.GPSLongitude]: degToDms(Math.abs(lng)),
    },
  };

  if (title || description) {
    exifObj["0th"] = {};
    exifObj["0th"][piexif.ImageIFD.ImageDescription] = description ? `${title ?? ""} - ${description}`.trim() : title!;
  }

  return stringToBytes(piexif.dump(exifObj));
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function blobToJpeg(blob: Blob, quality = 0.92): Promise<Blob> {
  if (blob.type === "image/jpeg") return blob;

  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(blob);
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Canvas is not available."));
        return;
      }
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(objectUrl);
      canvas.toBlob((nextBlob) => nextBlob ? resolve(nextBlob) : reject(new Error("Conversion failed.")), "image/jpeg", quality);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image could not be loaded."));
    };
    image.src = objectUrl;
  });
}

function readUint32LE(bytes: Uint8Array, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24);
}

function writeUint32LE(value: number): Uint8Array {
  return new Uint8Array([value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff]);
}

function writeUint32BE(value: number): Uint8Array {
  return new Uint8Array([(value >> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff]);
}

function writeUint24LE(value: number): Uint8Array {
  return new Uint8Array([value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff]);
}

function concatBytes(...arrays: Uint8Array[]) {
  const total = arrays.reduce((sum, array) => sum + array.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  arrays.forEach((array) => {
    output.set(array, offset);
    offset += array.length;
  });
  return output;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function makeChunk(fourCC: string, payload: Uint8Array) {
  const header = new Uint8Array(8);
  header.set(stringToBytes(fourCC), 0);
  header.set(writeUint32LE(payload.length), 4);
  const padding = payload.length % 2 === 1 ? 1 : 0;
  const chunk = new Uint8Array(header.length + payload.length + padding);
  chunk.set(header, 0);
  chunk.set(payload, 8);
  return chunk;
}

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index++) {
    crc ^= bytes[index];
    for (let bit = 0; bit < 8; bit++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makePngChunk(type: string, payload: Uint8Array) {
  const typeBytes = stringToBytes(type);
  const crcBytes = writeUint32BE(crc32(concatBytes(typeBytes, payload)));
  return concatBytes(writeUint32BE(payload.length), typeBytes, payload, crcBytes);
}

async function getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(blob);
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image could not be loaded."));
    };
    image.src = objectUrl;
  });
}

async function injectExifIntoWebP(blob: Blob, exifBytes: Uint8Array): Promise<Blob> {
  const source = new Uint8Array(await blob.arrayBuffer());
  if (String.fromCharCode(...source.slice(0, 4)) !== "RIFF" || String.fromCharCode(...source.slice(8, 12)) !== "WEBP") return blob;

  const chunks: Uint8Array[] = [];
  let offset = 12;
  let hasVP8X = false;
  let alphaFlag = false;

  while (offset + 8 <= source.length) {
    const fourCC = String.fromCharCode(...source.slice(offset, offset + 4));
    const size = readUint32LE(source, offset + 4);
    const paddedSize = size + (size % 2);
    if (offset + 8 + paddedSize > source.length) break;
    const chunkBytes = source.slice(offset, offset + 8 + paddedSize);

    if (fourCC === "VP8X") {
      hasVP8X = true;
      const updated = chunkBytes.slice();
      updated[8] |= 0x08;
      chunks.push(updated);
    } else if (fourCC !== "EXIF") {
      if (fourCC === "ALPH") alphaFlag = true;
      chunks.push(chunkBytes);
    }

    offset += 8 + paddedSize;
  }

  if (!hasVP8X) {
    const { width, height } = await getImageDimensions(blob);
    const payload = new Uint8Array(10);
    if (alphaFlag) payload[0] |= 0x10;
    payload[0] |= 0x08;
    payload.set(writeUint24LE(Math.max(0, width - 1)), 4);
    payload.set(writeUint24LE(Math.max(0, height - 1)), 7);
    chunks.unshift(makeChunk("VP8X", payload));
  }

  chunks.push(makeChunk("EXIF", exifBytes));
  const riffPayloadLength = 4 + chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(8 + riffPayloadLength);
  output.set(stringToBytes("RIFF"), 0);
  output.set(writeUint32LE(riffPayloadLength), 4);
  output.set(stringToBytes("WEBP"), 8);
  let outOffset = 12;
  chunks.forEach((chunk) => {
    output.set(chunk, outOffset);
    outOffset += chunk.length;
  });

  return new Blob([toArrayBuffer(output)], { type: "image/webp" });
}

async function injectExifIntoPng(blob: Blob, exifBytes: Uint8Array): Promise<Blob> {
  const source = new Uint8Array(await blob.arrayBuffer());
  const pngSignature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!pngSignature.every((value, index) => source[index] === value)) return blob;

  const chunks: Uint8Array[] = [];
  let offset = 8;
  let inserted = false;

  while (offset + 8 <= source.length) {
    const length = (source[offset] << 24) | (source[offset + 1] << 16) | (source[offset + 2] << 8) | source[offset + 3];
    const end = offset + 12 + length;
    if (end > source.length) break;
    const type = String.fromCharCode(...source.slice(offset + 4, offset + 8));
    if (type !== "eXIf") chunks.push(source.slice(offset, end));
    if (type === "IHDR" && !inserted) {
      chunks.push(makePngChunk("eXIf", exifBytes));
      inserted = true;
    }
    offset = end;
  }

  if (!inserted) chunks.push(makePngChunk("eXIf", exifBytes));
  return new Blob([toArrayBuffer(concatBytes(pngSignature, ...chunks))], { type: "image/png" });
}

async function injectMetadata(blob: Blob, format: OutputFormat, exifBytes: Uint8Array): Promise<Blob> {
  if (format === "image/webp") return injectExifIntoWebP(blob, exifBytes);
  if (format === "image/png") return injectExifIntoPng(blob, exifBytes);

  const jpegBlob = format === "image/jpeg" ? blob : await blobToJpeg(blob);
  const dataUrl = await blobToDataUrl(jpegBlob);
  const exifStr = Array.from(exifBytes, (byte) => String.fromCharCode(byte)).join("");
  const newUrl = piexif.insert(exifStr, dataUrl);
  const binary = atob(newUrl.split(",")[1]);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
  return new Blob([toArrayBuffer(bytes)], { type: "image/jpeg" });
}

async function convertToFormat(file: File, format: OutputFormat, qualityValue: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      let width = image.naturalWidth;
      let height = image.naturalHeight;

      // Browsers export PNGs as uncompressed 32-bit RGBA, causing massive file sizes.
      // To compress a PNG natively, we must scale down its dimensions proportionally to the quality level.
      if (format === "image/png" && qualityValue < 100) {
        const scale = Math.sqrt(qualityValue / 100);
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Canvas is not available."));
        return;
      }
      
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      context.drawImage(image, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      
      const q = format === "image/png" ? undefined : qualityValue / 100;
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Conversion failed.")), format === "image/avif" ? "image/webp" : format, q);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not read ${file.name}.`));
    };
    image.src = objectUrl;
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// --- Component ---
export function CompleteOptimizer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState<{w: number, h: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Step 2 state
  const [compressionMode, setCompressionMode] = useState<"smart" | "manual">("smart");
  const [compressionLevel, setCompressionLevel] = useState(70);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/webp");

  // Step 3 state
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locationName, setLocationName] = useState<string>("");
  const [showGeoMap, setShowGeoMap] = useState(false);

  // Step 4 state
  const [imageTitle, setImageTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Results
  const [optimizedBlob, setOptimizedBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (lat !== null && lng !== null) {
      setShowGeoMap(true);
    }
  }, [lat, lng]);

  const handleFiles = async (selectedFiles: FileList | File[]) => {
    const validFiles = Array.from(selectedFiles).filter(f => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      toast({ title: "Invalid file", description: "Please upload image files." });
      return;
    }
    
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    
    setFiles(validFiles);
    const urls = validFiles.map(f => URL.createObjectURL(f));
    setPreviewUrls(urls);
    
    const img = new Image();
    img.onload = () => {
      setDimensions({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = urls[0];

    setOptimizedBlob(null);
  };

  const totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);

  // PNGs are uncompressed and huge. We use multipliers to show realistic estimates.
  const sizeMultiplier = outputFormat === "image/png" ? 1.5 : 0.35;
  const manualMultiplier = outputFormat === "image/png" ? (compressionLevel / 50) : (compressionLevel / 100);
  const estimatedSize = files.length > 0 ? Math.max(1024, Math.floor(totalOriginalSize * (compressionMode === "smart" ? sizeMultiplier : manualMultiplier))) : 0;
  const savingsPct = files.length > 0 && estimatedSize < totalOriginalSize ? Math.round((1 - (estimatedSize / totalOriginalSize)) * 100) : 0;

  const processAndDownload = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    try {
      // For PNG, browser output is massive (32-bit uncompressed RGBA).
      // If using smart compression, drop quality heavily to compensate via downscaling.
      const quality = compressionMode === "smart" ? (outputFormat === "image/png" ? 40 : 75) : compressionLevel;
      let exifBytes: Uint8Array | undefined;
      
      if (lat !== null && lng !== null) {
        exifBytes = createExifBytes(lat, lng, imageTitle, altText);
      }

      if (files.length === 1) {
        const file = files[0];
        const convertedBlob = await convertToFormat(file, outputFormat, quality);
        let finalBlob = convertedBlob;
        if (exifBytes) {
          finalBlob = await injectMetadata(convertedBlob, outputFormat, exifBytes);
        }
        setOptimizedBlob(finalBlob);

        const link = document.createElement("a");
        link.href = URL.createObjectURL(finalBlob);
        link.download = file.name.replace(/\.[^.]+$/, `.${outputFormat.split('/')[1]}`);
        link.click();
      } else {
        const zip = new JSZip();
        
        await Promise.all(files.map(async (file) => {
          try {
            const convertedBlob = await convertToFormat(file, outputFormat, quality);
            let finalBlob = convertedBlob;
            if (exifBytes) {
              finalBlob = await injectMetadata(convertedBlob, outputFormat, exifBytes);
            }
            zip.file(file.name.replace(/\.[^.]+$/, `.${outputFormat.split('/')[1]}`), finalBlob);
          } catch (e) {
            console.error("Failed to process " + file.name, e);
          }
        }));

        const archive = await zip.generateAsync({ type: "blob" });
        setOptimizedBlob(archive);

        const link = document.createElement("a");
        link.href = URL.createObjectURL(archive);
        link.download = `optimized_images.zip`;
        link.click();
      }
      
      toast({ title: "Success", description: files.length > 1 ? "Images optimized and zipped successfully!" : "Image optimized and downloaded successfully!" });

    } catch (e) {
      toast({ title: "Processing failed", description: e instanceof Error ? e.message : "Unknown error occurred" });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setDimensions(null);
    setOptimizedBlob(null);
    setLat(null);
    setLng(null);
    setLocationName("");
    setImageTitle("");
    setAltText("");
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-16">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Complete Image SEO Optimizer</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* STEP 1: Upload */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.04)] p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Step 1: Upload Image</h3>
          <div className="flex gap-4">
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files); }}
              className={cn(
                "flex-1 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors",
                isDragging ? "border-[#4CA7D1] bg-[#4CA7D1]/10" : "border-[#BCE0F0] bg-[#F4FAFD]",
                files.length > 0 ? "h-32" : "h-48"
              )}
            >
              <Upload className="w-8 h-8 text-[#4CA7D1] mb-2" strokeWidth={1.5} />
              <p className="font-bold text-slate-800 mb-3 text-sm">Drag & Drop Image(s)</p>
              <button 
                onClick={() => inputRef.current?.click()}
                className="bg-[#4CA7D1] hover:bg-[#3b93bc] text-white px-5 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Or Select File(s)
              </button>
              <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { if(e.target.files?.length) handleFiles(e.target.files); }} />
            </div>

            {files.length > 0 && previewUrls.length > 0 && (
              <div className="w-[180px] shrink-0">
                <div className="h-20 w-full rounded-lg overflow-hidden border border-slate-200 mb-2 relative">
                  <img src={previewUrls[0]} alt="Preview" className="w-full h-full object-cover" />
                  {files.length > 1 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-sm">
                      +{files.length - 1} more
                    </div>
                  )}
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <p><span className="font-semibold text-slate-800">Files:</span> {files.length} image{files.length > 1 ? 's' : ''}</p>
                  {files.length === 1 && <p><span className="font-semibold text-slate-800">Format:</span> {files[0].type.split('/')[1].toUpperCase()}</p>}
                  <p><span className="font-semibold text-slate-800">Total Size:</span> {formatBytes(totalOriginalSize)}</p>
                  {files.length === 1 && dimensions && <p><span className="font-semibold text-slate-800">Dimensions:</span> {dimensions.w}x{dimensions.h}px</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STEP 2: Compress */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.04)] p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Step 2: Compress & Convert</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Output Format</label>
              <div className="relative">
                <select 
                  value={outputFormat}
                  onChange={e => setOutputFormat(e.target.value as OutputFormat)}
                  className="w-full bg-white border border-slate-300 rounded-xl py-2 pl-3 pr-10 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#4CA7D1] focus:ring-1 focus:ring-[#4CA7D1] appearance-none transition-colors"
                >
                  <option value="image/webp">WebP</option>
                  <option value="image/avif">AVIF</option>
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Compression</label>
              <div className="flex bg-slate-100 p-1 rounded-xl h-[38px]">
                <button 
                  onClick={() => setCompressionMode('smart')}
                  className={cn("flex-1 text-xs font-bold rounded-lg transition-all", compressionMode === 'smart' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                >
                  Smart (Auto)
                </button>
                <button 
                  onClick={() => setCompressionMode('manual')}
                  className={cn("flex-1 text-xs font-bold rounded-lg transition-all", compressionMode === 'manual' ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                >
                  Manual
                </button>
              </div>
            </div>
          </div>

          <div className={cn("transition-all duration-300 overflow-hidden", compressionMode === 'smart' ? "h-0 opacity-0 mb-0" : "h-[50px] opacity-100 mb-5")}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Quality Level</label>
              <span className="text-xs font-black text-[#4CA7D1]">{compressionLevel}%</span>
            </div>
            <input 
              type="range" min="1" max="100" 
              value={compressionLevel} onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
              className="w-full accent-[#4CA7D1]"
            />
          </div>

          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Estimated Output Size</span>
            <div className="text-right flex items-center gap-2">
              <span className="text-sm font-black text-slate-900">~{formatBytes(estimatedSize)}</span>
              {savingsPct > 0 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                  -{savingsPct}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* STEP 3: Geotagging */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.04)] p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Step 3: Add Geotagging</h3>
          
          <div className="h-[180px] rounded-xl overflow-hidden border border-slate-200 mb-3 relative">
            {showGeoMap ? (
              <Suspense fallback={<div className="h-full flex items-center justify-center bg-slate-50 text-sm"><Loader2 className="w-5 h-5 animate-spin mr-2"/>Loading map...</div>}>
                <GeoMap
                  lat={lat ? String(lat) : ""}
                  lng={lng ? String(lng) : ""}
                  locationName={locationName}
                  onChange={(latStr, lngStr, name) => {
                    setLat(parseFloat(latStr));
                    setLng(parseFloat(lngStr));
                    setLocationName(name);
                  }}
                />
              </Suspense>
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-slate-50 px-6 text-center">
                <MapPin className="mb-3 h-8 w-8 text-[#4CA7D1]" />
                <p className="text-sm font-semibold text-slate-800">Load the interactive map only when you need geotagging.</p>
                <p className="mt-1 text-xs text-slate-500">This keeps the homepage lighter on first load and opens the map picker on demand.</p>
                <button
                  onClick={() => setShowGeoMap(true)}
                  className="mt-4 rounded-lg bg-[#4CA7D1] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#3b93bc]"
                >
                  Open Map Picker
                </button>
              </div>
            )}
          </div>

          <div className="relative mb-2">
            <input 
              type="text" 
              placeholder="Search Location"
              value={locationName}
              readOnly
              className="w-full border border-slate-300 rounded-md py-2 px-3 text-sm focus:outline-none"
            />
          </div>
          
          <p className="text-xs text-slate-600 font-medium">
            Latitude: <span className="text-slate-800">{lat ? lat.toFixed(4) : "—"}</span>, 
            Longitude: <span className="text-slate-800">{lng ? lng.toFixed(4) : "—"}</span>
          </p>
        </div>

        {/* STEP 4: Finalize */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_10px_rgb(0,0,0,0.04)] p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Step 4: Finalize & Download</h3>
          
          <div className="flex gap-6">
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">Location coordinate</label>
                <input 
                  type="text" value={locationName || (lat ? `${lat.toFixed(4)}, ${lng?.toFixed(4)}` : "")} readOnly
                  placeholder="Lisbon, Portugal"
                  className="w-full border border-slate-300 rounded-md py-1.5 px-3 text-sm focus:outline-none bg-slate-50"
                />
                <p className="text-[10px] text-slate-500 mt-1">Latitude: {lat ? lat.toFixed(4) : "—"} Longitude: {lng ? lng.toFixed(4) : "—"}</p>
              </div>
              
              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">Image Title (optional)</label>
                <input 
                  type="text" placeholder="Image Title" value={imageTitle} onChange={e => setImageTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:border-[#4CA7D1]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 mb-1">Alt Text (optional)</label>
                <input 
                  type="text" placeholder="SEO relevant metadata" value={altText} onChange={e => setAltText(e.target.value)}
                  className="w-full border border-slate-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:border-[#4CA7D1]"
                />
              </div>
            </div>

            <div className="w-[180px] shrink-0 flex flex-col items-center">
              <div className="flex gap-2 w-full mb-4">
                <div className="flex-1 text-center">
                  <div className="h-[50px] rounded border border-slate-200 overflow-hidden mb-1 bg-slate-50 relative">
                    {previewUrls.length > 0 && <img src={previewUrls[0]} className="w-full h-full object-cover" />}
                    {files.length > 1 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold">+{files.length - 1}</div>}
                  </div>
                  <p className="text-[9px] font-bold text-slate-800">Original</p>
                  <p className="text-[9px] text-slate-500">({files.length === 1 ? files[0].type.split('/')[1].toUpperCase() : 'MIXED'}, {formatBytes(totalOriginalSize)})</p>
                </div>
                <div className="flex-1 text-center">
                  <div className="h-[50px] rounded border border-[#4CA7D1] overflow-hidden mb-1 relative">
                    {previewUrls.length > 0 && <img src={previewUrls[0]} className="w-full h-full object-cover" />}
                    {optimizedBlob && <div className="absolute inset-0 bg-[#4CA7D1]/10" />}
                    {files.length > 1 && <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-bold">+{files.length - 1}</div>}
                  </div>
                  <p className="text-[9px] font-bold text-slate-800">Optimized</p>
                  <p className="text-[9px] text-slate-500">({outputFormat.split('/')[1].toUpperCase()}, ~{formatBytes(estimatedSize)}, {lat ? "Geotagged" : ""})</p>
                </div>
              </div>

              <button 
                onClick={processAndDownload}
                disabled={files.length === 0 || isProcessing}
                className="w-full bg-gradient-to-r from-[#21C0E1] to-[#398DB4] hover:opacity-90 text-white font-bold text-xs py-3 px-2 rounded-lg shadow-[0_4px_14px_rgba(33,192,225,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex flex-col items-center text-center leading-tight"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mb-0.5" /> : (files.length > 1 ? "PROCESS & DOWNLOAD ALL (ZIP)" : "PROCESS & DOWNLOAD OPTIMIZED IMAGE")}
              </button>

              <button onClick={resetAll} className="text-[11px] text-[#4CA7D1] font-semibold mt-3 hover:underline">
                Reset & Start New
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
