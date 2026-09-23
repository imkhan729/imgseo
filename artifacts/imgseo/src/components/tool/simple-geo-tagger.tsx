import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { Loader2, MapPin, Globe, Image as ImageIcon, Search, Plus, Minus, Layers, Settings, ChevronRight } from "lucide-react";
import piexif from "piexifjs";
import JSZip from "jszip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const GeoMap = lazy(() => import("./geo-map").then((module) => ({ default: module.GeoMap })));

type OutputFormat = "image/jpeg" | "image/webp" | "image/png";

interface TaggedImage {
  id: string;
  file: File;
  previewUrl: string;
  taggedBlob: Blob | null;
  taggedUrl: string | null;
  tagging: boolean;
  lat: number | null;
  lng: number | null;
  locationName: string;
  date: string;
  device: string;
  tags: string;
}

const outputFormats: { value: OutputFormat; label: string; extension: string }[] = [
  { value: "image/jpeg", label: "JPEG", extension: "jpg" },
  { value: "image/webp", label: "WebP", extension: "webp" },
  { value: "image/png", label: "PNG", extension: "png" },
];

function outputExtension(format: OutputFormat) {
  return outputFormats.find((option) => option.value === format)?.extension ?? "jpg";
}

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

async function convertToFormat(file: File, format: OutputFormat): Promise<Blob> {
  if (file.type === format) return file;

  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
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
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(objectUrl);
      const quality = format === "image/png" ? undefined : 0.92;
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Conversion failed.")), format, quality);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not read ${file.name}.`));
    };
    image.src = objectUrl;
  });
}

function formatDate(date: Date) {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-GB', options);
}

export function SimpleGeoTagger() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<TaggedImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/jpeg");
  const [isBulkTagging, setIsBulkTagging] = useState(false);

  const selectedImage = useMemo(() => images.find(i => i.id === selectedId), [images, selectedId]);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const nextFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (!nextFiles.length) {
      toast({ title: "No supported images found", description: "Upload browser-supported image files." });
      return;
    }

    const nowStr = formatDate(new Date());

    const nextImages = nextFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      taggedBlob: null,
      taggedUrl: null,
      tagging: false,
      lat: null,
      lng: null,
      locationName: "",
      date: nowStr,
      device: "",
      tags: ""
    }));

    setImages((current) => {
      const newImages = [...current, ...nextImages];
      if (!selectedId && newImages.length > 0) {
        setSelectedId(newImages[0].id);
      }
      return newImages;
    });
  };

  const updateSelectedImage = (updates: Partial<TaggedImage>) => {
    if (!selectedId) return;
    setImages(current => current.map(img => img.id === selectedId ? { ...img, ...updates } : img));
  };

  const runGeoTagging = async () => {
    if (!selectedImage) return;
    if (selectedImage.lat === null || selectedImage.lng === null) {
      toast({ title: "Coordinates missing", description: "Please pin a location on the map first." });
      return;
    }

    updateSelectedImage({ tagging: true });

    try {
      const exifBytes = createExifBytes(selectedImage.lat, selectedImage.lng, selectedImage.tags, selectedImage.device);
      const converted = await convertToFormat(selectedImage.file, outputFormat);
      const taggedBlob = await injectMetadata(converted, outputFormat, exifBytes);
      const taggedUrl = URL.createObjectURL(taggedBlob);

      updateSelectedImage({
        tagging: false,
        taggedBlob,
        taggedUrl,
      });

      toast({
        title: "GPS metadata embedded",
        description: `Successfully tagged ${selectedImage.file.name}.`,
      });
      
      const link = document.createElement("a");
      link.href = taggedUrl;
      link.download = selectedImage.file.name.replace(/\.[^.]+$/, `_tagged.${outputExtension(outputFormat)}`);
      link.click();

    } catch (error) {
      updateSelectedImage({ tagging: false });
      toast({
        title: "Geo tagging failed",
        description: error instanceof Error ? error.message : "Please try another image.",
      });
    }
  };

  const removeGeotag = () => {
    if (!selectedImage) return;
    updateSelectedImage({ lat: null, lng: null, locationName: "" });
  };

  const runBulkGeoTagging = async () => {
    if (!selectedImage) return;
    if (selectedImage.lat === null || selectedImage.lng === null) {
      toast({ title: "Coordinates missing", description: "Please pin a location on the map first." });
      return;
    }
    if (images.length === 0) return;

    setIsBulkTagging(true);

    try {
      const zip = new JSZip();
      const exifBytes = createExifBytes(selectedImage.lat, selectedImage.lng, selectedImage.tags, selectedImage.device);
      
      const updatedImages = await Promise.all(
        images.map(async (img) => {
          try {
            const converted = await convertToFormat(img.file, outputFormat);
            const taggedBlob = await injectMetadata(converted, outputFormat, exifBytes);
            
            zip.file(img.file.name.replace(/\.[^.]+$/, `_tagged.${outputExtension(outputFormat)}`), taggedBlob);
            
            if (img.taggedUrl) URL.revokeObjectURL(img.taggedUrl);
            
            return {
              ...img,
              lat: selectedImage.lat,
              lng: selectedImage.lng,
              locationName: selectedImage.locationName,
              date: selectedImage.date,
              device: selectedImage.device,
              tags: selectedImage.tags,
              taggedBlob,
              taggedUrl: URL.createObjectURL(taggedBlob)
            };
          } catch (e) {
            console.error(`Failed to tag ${img.file.name}`, e);
            return img; 
          }
        })
      );

      setImages(updatedImages);

      const archive = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(archive);
      link.download = `geotagged_images.zip`;
      link.click();
      URL.revokeObjectURL(link.href);

      toast({
        title: "Bulk Tagging Complete",
        description: `Successfully tagged and zipped ${images.length} images.`,
      });

    } catch (error) {
      toast({
        title: "Bulk tagging failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setIsBulkTagging(false);
    }
  };

  const downloadAll = async () => {
    const ready = images.filter(i => i.taggedBlob);
    if(ready.length === 0) {
      toast({ title: "Nothing to download", description: "No images have been geotagged yet." });
      return;
    }
    
    try {
      const zip = new JSZip();
      ready.forEach((img) => {
        if (img.taggedBlob) {
          zip.file(img.file.name.replace(/\.[^.]+$/, `_tagged.${outputExtension(outputFormat)}`), img.taggedBlob);
        }
      });
      const archive = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(archive);
      link.download = `geotagged_images.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (e) {
      toast({ title: "Download failed", description: "Could not create ZIP file." });
    }
  }

  // Derived state with correct null checks to avoid "undefined" strings
  const latStr = selectedImage && selectedImage.lat !== null ? String(selectedImage.lat) : "";
  const lngStr = selectedImage && selectedImage.lng !== null ? String(selectedImage.lng) : "";

  return (
    <div className="w-full max-w-6xl mx-auto h-[800px] lg:h-[860px] rounded-2xl bg-white text-slate-900 font-sans shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200 overflow-hidden flex flex-col md:flex-row -mt-4">
      
      {/* LEFT COLUMN: Image Gallery */}
      <div className="w-full md:w-64 flex flex-col border-r border-slate-200 bg-slate-50 shrink-0">
        <div className="flex items-center justify-between p-5 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
          <span>Image Gallery</span>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {images.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm text-center border-2 border-dashed border-slate-300 bg-white rounded-xl p-4 cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors" onClick={() => inputRef.current?.click()}>
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <p>Click Import to add images</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {images.map(img => {
                const isSelected = img.id === selectedId;
                const hasTag = img.lat !== null;
                return (
                  <div 
                    key={img.id} 
                    onClick={() => setSelectedId(img.id)}
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-slate-100 border-2 transition-all",
                      isSelected ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-2 ring-amber-500/20 z-10" : "border-transparent hover:border-slate-300 hover:shadow-sm"
                    )}
                  >
                    <img src={img.previewUrl} alt={img.file.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-slate-200">
                      <MapPin className={cn("w-3 h-3", hasTag ? "text-amber-500 fill-amber-500" : "text-slate-300")} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4 text-xs font-semibold text-slate-500 bg-white">
          <button className="hover:text-slate-800 transition-colors" onClick={downloadAll}>Download All</button>
          <button className="text-amber-600 hover:text-amber-700 transition-colors font-bold" onClick={() => inputRef.current?.click()}>Import</button>
          <button className="hover:text-slate-800 transition-colors">Sort by Date</button>
          
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => addFiles(event.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* MIDDLE COLUMN: Main View */}
      <div className="flex-1 flex flex-col gap-4 p-4 min-w-0 bg-slate-50/50">
        
        {/* Top: Selected Photo */}
        <div className="relative flex-[1.2] min-h-0 rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-white p-4 flex flex-col shadow-sm">
          <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-3">
            <span>Selected Photo</span>
          </div>
          
          <div className="flex-1 relative rounded-xl overflow-hidden flex items-center justify-center bg-slate-100/50 border border-slate-100 shadow-inner">
            {selectedImage ? (
              <img src={selectedImage.previewUrl} className="max-h-full max-w-full object-contain rounded-xl shadow-md drop-shadow-sm" />
            ) : (
              <div className="text-slate-400 flex flex-col items-center">
                <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
                <span>No photo selected</span>
              </div>
            )}
          </div>
          
          {selectedImage && (
            <div className="mt-4 flex items-center gap-4 bg-white/70 backdrop-blur-md rounded-xl p-3 border border-slate-200 shadow-sm">
              <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 text-slate-600">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900 truncate">{selectedImage.file.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{selectedImage.date}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom: Map */}
        <div className="h-[45%] rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden relative shadow-sm">
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-sm font-medium text-slate-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-amber-500" />
                Loading map...
              </div>
            }
          >
            <GeoMap
              lat={latStr}
              lng={lngStr}
              locationName={selectedImage?.locationName || ""}
              onChange={(nextLat, nextLng, nextName) => {
                if (selectedImage) {
                  updateSelectedImage({ 
                    lat: parseFloat(nextLat), 
                    lng: parseFloat(nextLng), 
                    locationName: nextName 
                  });
                }
              }}
            />
          </Suspense>
        </div>
      </div>

      {/* RIGHT COLUMN: Geotag Details */}
      <div className="w-full md:w-80 flex flex-col border-l border-slate-200 bg-white p-5 overflow-y-auto shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.01)]">
        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-6">
          Geotag Details
        </div>

        {selectedImage ? (
          <div className="space-y-8">
            
            {/* Small preview */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Selected Photo:</p>
              <div className="flex items-center gap-3">
                <img src={selectedImage.previewUrl} className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{selectedImage.file.name}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{selectedImage.date}</p>
                </div>
              </div>
            </div>

            {/* Location Data */}
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-2">Location Data</div>
              
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Location</label>
                <div className="text-sm font-medium text-slate-800 mb-2 truncate">
                  {selectedImage.locationName || (selectedImage.lat ? "Custom Location" : "No location set")}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-4 w-4 text-amber-500" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search Location..."
                    className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Coordinates</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly
                    value={selectedImage.lat ? `${Math.abs(selectedImage.lat).toFixed(4)}° ${selectedImage.lat >= 0 ? 'N' : 'S'}` : ''}
                    placeholder="Latitude"
                    className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium text-slate-700 text-center focus:outline-none"
                  />
                  <input 
                    type="text" 
                    readOnly
                    value={selectedImage.lng ? `${Math.abs(selectedImage.lng).toFixed(4)}° ${selectedImage.lng >= 0 ? 'E' : 'W'}` : ''}
                    placeholder="Longitude"
                    className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-medium text-slate-700 text-center focus:outline-none"
                  />
                  <button className="w-10 shrink-0 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-amber-600 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm">
                    <Globe className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-2">Metadata</div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Date</label>
                  <input 
                    type="text" 
                    value={selectedImage.date}
                    onChange={(e) => updateSelectedImage({ date: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Device</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sony A7R IV"
                    value={selectedImage.device}
                    onChange={(e) => updateSelectedImage({ device: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Tags</label>
                  <textarea 
                    placeholder="#landscape #nature"
                    value={selectedImage.tags}
                    onChange={(e) => updateSelectedImage({ tags: e.target.value })}
                    rows={3}
                    className="w-full resize-none bg-white border border-slate-300 rounded-xl py-2.5 px-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-2">Export Options</div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Output Format</label>
                <div className="relative">
                  <select 
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                    className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-3 pr-10 text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors shadow-sm appearance-none"
                  >
                    {outputFormats.map(format => (
                      <option key={format.value} value={format.value}>{format.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col gap-3">
              <button 
                onClick={runGeoTagging}
                disabled={selectedImage.tagging || isBulkTagging}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-amber-500/30 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {selectedImage.tagging ? (
                  <span className="flex items-center justify-center"><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</span>
                ) : "Save Current Image"}
              </button>

              {images.length > 1 && (
                <button 
                  onClick={runBulkGeoTagging}
                  disabled={isBulkTagging || selectedImage.tagging}
                  className="w-full bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-bold py-3.5 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {isBulkTagging ? (
                    <span className="flex items-center justify-center"><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing All...</span>
                  ) : `Tag All ${images.length} Images (ZIP)`}
                </button>
              )}
              
              <button 
                onClick={removeGeotag}
                className="w-full bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all active:scale-[0.98] shadow-sm mt-2"
              >
                Remove Geotag
              </button>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm text-center px-4">
            <MapPin className="w-10 h-10 mb-4 opacity-20 text-slate-500" />
            <p>Import and select an image to view and edit its geotag details.</p>
          </div>
        )}
      </div>

    </div>
  );
}
