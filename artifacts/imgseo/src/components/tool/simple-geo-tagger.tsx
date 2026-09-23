import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { Loader2, MapPin, Globe, Image as ImageIcon, Search, Plus, Trash2, CheckCircle2, Download, Sparkles, Sliders, ShieldCheck, MapPinned } from "lucide-react";
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
  { value: "image/jpeg", label: "JPEG (Standard EXIF)", extension: "jpg" },
  { value: "image/webp", label: "WebP (SEO Optimized)", extension: "webp" },
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
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makePngChunk(type: string, data: Uint8Array): Uint8Array {
  const length = data.length;
  const typeBytes = stringToBytes(type);
  const crcPayload = new Uint8Array(4 + length);
  crcPayload.set(typeBytes, 0);
  crcPayload.set(data, 4);
  const chunkCrc = crc32(crcPayload);

  const chunk = new Uint8Array(8 + length + 4);
  chunk.set(writeUint32BE(length), 0);
  chunk.set(typeBytes, 4);
  chunk.set(data, 8);
  chunk.set(writeUint32BE(chunkCrc), 8 + length);
  return chunk;
}

function injectPngExif(pngBytes: Uint8Array, exifPayload: Uint8Array): Uint8Array {
  const signature = pngBytes.slice(0, 8);
  const chunks: Uint8Array[] = [signature];
  let offset = 8;
  let inserted = false;

  while (offset < pngBytes.length) {
    const length = (pngBytes[offset] << 24) | (pngBytes[offset + 1] << 16) | (pngBytes[offset + 2] << 8) | pngBytes[offset + 3];
    const type = String.fromCharCode(...pngBytes.slice(offset + 4, offset + 8));
    const fullChunkLength = 12 + length;
    const chunk = pngBytes.slice(offset, offset + fullChunkLength);

    if (type !== "eXIf") {
      chunks.push(chunk);
    }

    if (type === "IHDR" && !inserted) {
      chunks.push(makePngChunk("eXIf", exifPayload));
      inserted = true;
    }

    offset += fullChunkLength;
  }

  if (!inserted) {
    chunks.splice(1, 0, makePngChunk("eXIf", exifPayload));
  }

  return concatBytes(...chunks);
}

function injectWebpExif(webpBytes: Uint8Array, exifPayload: Uint8Array): Uint8Array {
  const riff = String.fromCharCode(...webpBytes.slice(0, 4));
  const webp = String.fromCharCode(...webpBytes.slice(8, 12));
  if (riff !== "RIFF" || webp !== "WEBP") throw new Error("Invalid WebP container");

  const firstChunkType = String.fromCharCode(...webpBytes.slice(12, 16));

  if (firstChunkType === "VP8X") {
    let flags = webpBytes[20];
    flags |= 0x08; // Set EXIF flag
    webpBytes[20] = flags;

    const chunks: Uint8Array[] = [];
    let offset = 12;

    while (offset < webpBytes.length) {
      const fourCC = String.fromCharCode(...webpBytes.slice(offset, offset + 4));
      const chunkSize = readUint32LE(webpBytes, offset + 4);
      const paddedSize = 8 + chunkSize + (chunkSize % 2);
      const chunk = webpBytes.slice(offset, offset + paddedSize);

      if (fourCC !== "EXIF") {
        chunks.push(chunk);
      }
      offset += paddedSize;
    }

    const exifChunk = makeChunk("EXIF", exifPayload);
    chunks.push(exifChunk);

    const body = concatBytes(...chunks);
    const header = new Uint8Array(12);
    header.set(stringToBytes("RIFF"), 0);
    header.set(writeUint32LE(body.length + 4), 4);
    header.set(stringToBytes("WEBP"), 8);

    return concatBytes(header, body);
  }

  // VP8 or VP8L simple format -> Convert to VP8X
  let width = 0;
  let height = 0;
  let hasAlpha = false;

  if (firstChunkType === "VP8 ") {
    const frameHeader = webpBytes.slice(20, 30);
    width = ((frameHeader[7] << 8) | frameHeader[6]) & 0x3fff;
    height = ((frameHeader[9] << 8) | frameHeader[8]) & 0x3fff;
  } else if (firstChunkType === "VP8L") {
    const b1 = webpBytes[21];
    const b2 = webpBytes[22];
    const b3 = webpBytes[23];
    const b4 = webpBytes[24];
    width = 1 + (((b2 & 0x3f) << 8) | b1);
    height = 1 + (((b4 & 0xf) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6));
    hasAlpha = !!(b4 & 0x10);
  }

  const vp8xPayload = new Uint8Array(10);
  let flags = 0x08; // EXIF bit
  if (hasAlpha) flags |= 0x10;
  vp8xPayload[0] = flags;
  vp8xPayload.set(writeUint24LE(Math.max(0, width - 1)), 4);
  vp8xPayload.set(writeUint24LE(Math.max(0, height - 1)), 7);

  const vp8xChunk = makeChunk("VP8X", vp8xPayload);
  const imageChunk = webpBytes.slice(12);
  const exifChunk = makeChunk("EXIF", exifPayload);

  const body = concatBytes(vp8xChunk, imageChunk, exifChunk);
  const header = new Uint8Array(12);
  header.set(stringToBytes("RIFF"), 0);
  header.set(writeUint32LE(body.length + 4), 4);
  header.set(stringToBytes("WEBP"), 8);

  return concatBytes(header, body);
}

async function injectMetadata(blob: Blob, format: OutputFormat, exifBytes: Uint8Array): Promise<Blob> {
  if (format === "image/jpeg") {
    const dataUrl = await blobToDataUrl(blob);
    const exifStr = piexif.dump({
      GPS: {
        [piexif.GPSIFD.GPSLatitudeRef]: exifBytes[0] === 0x4e ? "N" : "S",
      },
    });
    // Use piexif.insert directly with standard binary string
    const binary = Array.from(exifBytes, (byte) => String.fromCharCode(byte)).join("");
    const inserted = piexif.insert(binary, dataUrl);
    const response = await fetch(inserted);
    return response.blob();
  }

  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  if (format === "image/png") {
    const tagged = injectPngExif(bytes, exifBytes);
    return new Blob([toArrayBuffer(tagged)], { type: "image/png" });
  }

  if (format === "image/webp") {
    const tagged = injectWebpExif(bytes, exifBytes);
    return new Blob([toArrayBuffer(tagged)], { type: "image/webp" });
  }

  return blob;
}

async function convertToFormat(file: File, format: OutputFormat, quality = 0.9): Promise<Blob> {
  if (file.type === format && format === "image/jpeg") return file;
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
        reject(new Error("Canvas context is not available."));
        return;
      }
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(objectUrl);
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
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SimpleGeoTagger() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<TaggedImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/jpeg");
  const [isBulkTagging, setIsBulkTagging] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const selectedImage = useMemo(() => images.find(i => i.id === selectedId), [images, selectedId]);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const nextFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (!nextFiles.length) {
      toast({ title: "No supported images found", description: "Upload browser-supported image files (JPG, PNG, WebP)." });
      return;
    }

    const nowStr = formatDate(new Date());

    const nextImages: TaggedImage[] = nextFiles.map((file) => ({
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

    toast({
      title: `${nextFiles.length} ${nextFiles.length === 1 ? 'image' : 'images'} added`,
      description: "Select a photo and click the map or search a city to attach GPS coordinates.",
    });
  };

  const removeImage = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setImages(current => {
      const filtered = current.filter(img => img.id !== id);
      if (selectedId === id) {
        setSelectedId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  };

  const updateSelectedImage = (updates: Partial<TaggedImage>) => {
    if (!selectedId) return;
    setImages(current => current.map(img => img.id === selectedId ? { ...img, ...updates } : img));
  };

  const runGeoTagging = async () => {
    if (!selectedImage) return;
    if (selectedImage.lat === null || selectedImage.lng === null) {
      toast({ title: "Coordinates missing", description: "Please search or click on the map to pin a location first." });
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
      link.download = selectedImage.file.name.replace(/\.[^.]+$/, `_geotagged.${outputExtension(outputFormat)}`);
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
    toast({ title: "Geotag cleared", description: "Location removed from current photo." });
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
            
            zip.file(img.file.name.replace(/\.[^.]+$/, `_geotagged.${outputExtension(outputFormat)}`), taggedBlob);
            
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

  const latStr = selectedImage && selectedImage.lat !== null ? String(selectedImage.lat) : "";
  const lngStr = selectedImage && selectedImage.lng !== null ? String(selectedImage.lng) : "";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      
      {/* Top Image Upload Strip / Dropzone */}
      {images.length === 0 ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "card-3d relative cursor-pointer overflow-hidden rounded-[2rem] border-2 border-dashed p-10 md:p-14 text-center transition-all duration-300 select-none",
            isDragging
              ? "border-amber-500 bg-amber-500/5 scale-[1.01] shadow-2xl shadow-amber-500/15"
              : "border-border/80 bg-card hover:border-amber-500/60 hover:bg-muted/15"
          )}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.6),transparent)] dark:bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
          
          <div className="relative mx-auto flex flex-col items-center justify-center">
            <div className="h-18 w-18 rounded-[1.6rem] bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center mb-5 shadow-xl shadow-amber-500/25">
              <MapPinned className="h-9 w-9 text-white" strokeWidth={2} />
            </div>
            
            <h3 className="text-xl md:text-2xl font-black text-foreground mb-2">
              Drag & Drop Photos to Embed GPS Metadata
            </h3>
            
            <p className="text-sm font-medium text-muted-foreground max-w-md mx-auto mb-5">
              Attach precise latitude, longitude, city coordinates, and EXIF SEO metadata locally in your browser.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
              <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1 shadow-sm">100% Client-Side EXIF</span>
              <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1 shadow-sm">Zero Server Uploads</span>
              <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1 shadow-sm">Google Maps & GBP Ready</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
              className="btn-3d shine relative inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Browse Photos to Geotag
            </button>
          </div>
        </div>
      ) : (
        <div className="card-3d rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 border-b border-border/50 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Uploaded Photos ({images.length})</span>
              <span className="text-xs text-muted-foreground">· Click a photo to view and edit its geotag</span>
            </div>
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add More Photos
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin">
            {images.map((img) => {
              const isSelected = img.id === selectedId;
              const hasCoordinates = img.lat !== null && img.lng !== null;
              return (
                <div
                  key={img.id}
                  onClick={() => setSelectedId(img.id)}
                  className={cn(
                    "group relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 cursor-pointer transition-all bg-muted",
                    isSelected
                      ? "border-amber-500 shadow-lg shadow-amber-500/20 ring-2 ring-amber-500/30 scale-[1.02]"
                      : "border-border/80 hover:border-amber-500/50 opacity-80 hover:opacity-100"
                  )}
                >
                  <img src={img.previewUrl} alt={img.file.name} className="w-full h-full object-cover" />
                  
                  {/* Pin Status Badge */}
                  <div className="absolute top-1.5 left-1.5 rounded-md bg-background/90 backdrop-blur-sm p-1 shadow-sm">
                    <MapPin className={cn("w-3 h-3", hasCoordinates ? "text-amber-500 fill-amber-500" : "text-muted-foreground/40")} />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => removeImage(img.id, e)}
                    className="absolute top-1.5 right-1.5 h-5 w-5 rounded-md bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-white text-muted-foreground transition-all shadow-sm"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                    <p className="text-[10px] font-bold text-white truncate text-center">{img.file.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.svg"
        multiple
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
        className="hidden"
      />

      {/* Main Workspace (2-Column Balanced Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center Column: Interactive Map & Search (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="card-3d rounded-[2rem] border border-border/70 bg-card overflow-hidden shadow-sm flex flex-col h-[560px] relative">
            <div className="p-4 border-b border-border/60 bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-extrabold text-foreground">Interactive Geotag Map</h3>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Click map to pin coordinates
              </span>
            </div>

            {/* Leaflet Map */}
            <div className="flex-1 relative w-full h-full bg-muted">
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center text-sm font-bold text-muted-foreground animate-pulse">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-amber-500" />
                    Loading interactive map...
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

              {/* Floating Bottom Coordinates HUD */}
              {selectedImage && selectedImage.lat !== null && (
                <div className="absolute bottom-4 left-4 right-4 z-[400] pointer-events-none">
                  <div className="mx-auto w-fit max-w-full pointer-events-auto rounded-2xl border border-border/80 bg-background/95 backdrop-blur-md px-4 py-2.5 shadow-xl flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    <div className="text-xs min-w-0">
                      <span className="font-extrabold text-foreground truncate block">
                        {selectedImage.locationName || "Pinned Location"}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {selectedImage.lat.toFixed(6)}, {selectedImage.lng?.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Photo Details & EXIF Parameters (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-3d rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm space-y-5 sticky top-6">
            
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Sliders className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">Geotag Parameters</h3>
                  <p className="text-xs text-muted-foreground">EXIF location metadata</p>
                </div>
              </div>
              {selectedImage && selectedImage.lat !== null && (
                <button
                  onClick={removeGeotag}
                  className="text-xs font-bold text-destructive hover:underline"
                >
                  Clear Pin
                </button>
              )}
            </div>

            {selectedImage ? (
              <div className="space-y-4">
                
                {/* Active Photo Card */}
                <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-border/60 bg-muted/20">
                  <div className="h-12 w-12 rounded-xl overflow-hidden border border-border bg-muted shrink-0">
                    <img src={selectedImage.previewUrl} alt={selectedImage.file.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground truncate">{selectedImage.file.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatBytes(selectedImage.file.size)} · {selectedImage.date}</p>
                  </div>
                </div>

                {/* Latitude & Longitude Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 37.7749"
                      value={selectedImage.lat ?? ""}
                      onChange={(e) => updateSelectedImage({ lat: e.target.value ? parseFloat(e.target.value) : null })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-amber-500/25"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-1.5">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. -122.4194"
                      value={selectedImage.lng ?? ""}
                      onChange={(e) => updateSelectedImage({ lng: e.target.value ? parseFloat(e.target.value) : null })}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-amber-500/25"
                    />
                  </div>
                </div>

                {/* Location / City Name */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Location / Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dallas Central Business District"
                    value={selectedImage.locationName}
                    onChange={(e) => updateSelectedImage({ locationName: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-amber-500/25"
                  />
                </div>

                {/* Image SEO Title & Description */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Image SEO Title / Alt Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. QuickFix Roofing Dallas Branch"
                    value={selectedImage.tags}
                    onChange={(e) => updateSelectedImage({ tags: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-amber-500/25"
                  />
                </div>

                {/* Output Format Selector */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Export Format
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-amber-500/25 cursor-pointer"
                  >
                    {outputFormats.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-background text-foreground font-semibold">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 space-y-2.5">
                  <button
                    onClick={runGeoTagging}
                    disabled={selectedImage.tagging || isBulkTagging || selectedImage.lat === null}
                    className="btn-3d shine w-full py-3.5 px-4 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {selectedImage.tagging ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Embedding EXIF...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Embed GPS & Download
                      </>
                    )}
                  </button>

                  {images.length > 1 && (
                    <button
                      onClick={runBulkGeoTagging}
                      disabled={isBulkTagging || selectedImage.lat === null}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                    >
                      {isBulkTagging ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Tagging All Images...
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          Apply Pin & Tag All ({images.length} Images as ZIP)
                        </>
                      )}
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground flex flex-col items-center">
                <MapPin className="h-10 w-10 mb-3 opacity-25 text-amber-500" />
                <p className="text-sm font-semibold">No photo selected</p>
                <p className="text-xs mt-1 text-muted-foreground">Upload photos above to begin geotagging</p>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
