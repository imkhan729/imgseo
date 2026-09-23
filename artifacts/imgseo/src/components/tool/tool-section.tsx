import { useState, useRef, useCallback, useEffect, lazy, Suspense } from "react";
import {
  Upload, X, Download, Copy, Check, Archive, MapPin, ChevronDown,
  ImageIcon, Tag, Satellite, Zap, Settings2, FileImage, CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { getToolPath, type ToolMode } from "@/lib/tool-pages";
import JSZip from "jszip";
import piexif from "piexifjs";

const GeoMap = lazy(() => import("./geo-map").then((m) => ({ default: m.GeoMap })));

type OutputFormat = "image/webp" | "image/jpeg" | "image/png";
type ResizePreset = "none" | "google-business" | "thumbnail";
type RightTab = "geo" | "seo";

interface ProcessedImage {
  id: string;
  file: File;
  originalUrl: string;
  originalSize: number;
  gpsEmbedded: boolean;
  gpsExifBytes: Uint8Array | null;
  optimizedBlob: Blob | null;
  optimizedUrl: string | null;
  optimizedSize: number | null;
  processing: boolean;
}

interface GeoTaggedResult {
  id: string;
  name: string;
  blob: Blob;
  previewUrl: string;
  size: number;
}

const toolModes: { key: ToolMode; label: string; summary: string }[] = [
  {
    key: "webp-converter",
    label: "WebP Converter",
    summary: "Convert JPG and PNG into lighter WebP files for faster pages and better Core Web Vitals.",
  },
  {
    key: "geo-tagger",
    label: "Geo Tagger",
    summary: "Embed GPS metadata into your image exports for stronger local relevance.",
  },
  {
    key: "online-image-compressor",
    label: "Online Image Compressor",
    summary: "Reduce image size with quality controls tuned for speed and visual clarity.",
  },
];

function readToolMode(): ToolMode {
  if (typeof window === "undefined") return "webp-converter";
  const pathname = window.location.pathname;
  if (pathname.endsWith(getToolPath("geo-tagger"))) return "geo-tagger";
  if (pathname.endsWith(getToolPath("online-image-compressor"))) return "online-image-compressor";
  if (pathname.endsWith(getToolPath("webp-converter"))) return "webp-converter";
  const value = new URLSearchParams(window.location.search).get("tool");
  return value === "geo-tagger" || value === "online-image-compressor" || value === "webp-converter"
    ? value
    : "webp-converter";
}

interface ToolSectionProps {
  forcedMode?: ToolMode;
  routeMode?: boolean;
}


/* ─── helpers ─── */
function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / (1024 * 1024)).toFixed(2) + " MB";
}
function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}
function ext(f: OutputFormat) { return f === "image/webp" ? "webp" : f === "image/jpeg" ? "jpg" : "png"; }
function outName(name: string, f: OutputFormat) { return name.replace(/\.[^.]+$/, `.${ext(f)}`); }
function stringToBytes(s: string): Uint8Array {
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i) & 0xff;
  return bytes;
}

function degToDms(d: number): [[number, number], [number, number], [number, number]] {
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  const sec = Math.round(((d - deg) * 60 - min) * 60 * 1000);
  return [[deg, 1], [min, 1], [sec, 1000]];
}
function createExifBytes(lat: number, lng: number, title?: string, desc?: string): Uint8Array {
  const exifObj: Record<string, Record<number, unknown>> = {
    GPS: {
      [piexif.GPSIFD.GPSLatitudeRef]: lat >= 0 ? "N" : "S",
      [piexif.GPSIFD.GPSLatitude]: degToDms(Math.abs(lat)),
      [piexif.GPSIFD.GPSLongitudeRef]: lng >= 0 ? "E" : "W",
      [piexif.GPSIFD.GPSLongitude]: degToDms(Math.abs(lng)),
    },
  };
  if (title || desc) {
    exifObj["0th"] = {};
    exifObj["0th"][piexif.ImageIFD.ImageDescription] = desc ? `${title ?? ""} - ${desc}`.trim() : title!;
  }
  return stringToBytes(piexif.dump(exifObj));
}
async function blobToDataUrl(b: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onloadend = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(b);
  });
}
function readUint32LE(bytes: Uint8Array, offset: number): number {
  return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16) | (bytes[offset + 3] << 24);
}
function writeUint32BE(value: number): Uint8Array {
  return new Uint8Array([(value >> 24) & 0xff, (value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff]);
}
function writeUint24LE(value: number): Uint8Array {
  return new Uint8Array([value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff]);
}
function writeUint32LE(value: number): Uint8Array {
  return new Uint8Array([value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >> 24) & 0xff]);
}
function makeChunk(fourCC: string, payload: Uint8Array): Uint8Array {
  const header = new Uint8Array(8);
  header.set(stringToBytes(fourCC), 0);
  header.set(writeUint32LE(payload.length), 4);
  const padding = payload.length % 2 === 1 ? 1 : 0;
  const chunk = new Uint8Array(header.length + payload.length + padding);
  chunk.set(header, 0);
  chunk.set(payload, 8);
  return chunk;
}
function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  arrays.forEach((arr) => {
    out.set(arr, offset);
    offset += arr.length;
  });
  return out;
}
function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}
function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) {
      const mask = -(crc & 1);
      crc = (crc >>> 1) ^ (0xedb88320 & mask);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function makePngChunk(type: string, payload: Uint8Array): Uint8Array {
  const typeBytes = stringToBytes(type);
  const crcBytes = writeUint32BE(crc32(concatBytes(typeBytes, payload)));
  return concatBytes(writeUint32BE(payload.length), typeBytes, payload, crcBytes);
}
async function blobToJpeg(b: Blob, q = 0.92): Promise<Blob> {
  if (b.type === "image/jpeg") return b;
  return new Promise((res, rej) => {
    const img = new Image();
    const url = URL.createObjectURL(b);
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      if (!ctx) { rej(new Error("No canvas")); return; }
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      c.toBlob((bl) => bl ? res(bl) : rej(new Error("fail")), "image/jpeg", q);
    };
    img.onerror = () => rej(new Error("load fail"));
    img.src = url;
  });
}
async function embedGPS(blob: Blob, lat: number, lng: number, title?: string, desc?: string): Promise<Blob> {
  const jpegBlob = await blobToJpeg(blob);
  const dataUrl = await blobToDataUrl(jpegBlob);
  const exifObj: Record<string, Record<number, unknown>> = {
    GPS: {
      [piexif.GPSIFD.GPSLatitudeRef]: lat >= 0 ? "N" : "S",
      [piexif.GPSIFD.GPSLatitude]: degToDms(Math.abs(lat)),
      [piexif.GPSIFD.GPSLongitudeRef]: lng >= 0 ? "E" : "W",
      [piexif.GPSIFD.GPSLongitude]: degToDms(Math.abs(lng)),
    },
  };
  if (title || desc) {
    exifObj["0th"] = {};
    if (title) exifObj["0th"][piexif.ImageIFD.ImageDescription] = desc ? `${title} — ${desc}` : title;
  }
  try {
    const exifStr = piexif.dump(exifObj);
    const newUrl = piexif.insert(exifStr, dataUrl);
    const bin = atob(newUrl.split(",")[1]);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: "image/jpeg" });
  } catch { return jpegBlob; }
}
async function getImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("load fail"));
    };
    img.src = url;
  });
}
async function injectExifIntoWebP(blob: Blob, exifBytes: Uint8Array): Promise<Blob> {
  if (!exifBytes.length) return blob;

  const source = new Uint8Array(await blob.arrayBuffer());
  if (String.fromCharCode(...source.slice(0, 4)) !== "RIFF" || String.fromCharCode(...source.slice(8, 12)) !== "WEBP") {
    return blob;
  }

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
  if (!exifBytes.length) return blob;

  const source = new Uint8Array(await blob.arrayBuffer());
  const pngSignature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!pngSignature.every((value, idx) => source[idx] === value)) return blob;

  const chunks: Uint8Array[] = [];
  let offset = 8;
  let inserted = false;

  while (offset + 8 <= source.length) {
    const length =
      (source[offset] << 24) |
      (source[offset + 1] << 16) |
      (source[offset + 2] << 8) |
      source[offset + 3];
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

  const output = concatBytes(pngSignature, ...chunks);
  return new Blob([toArrayBuffer(output)], { type: "image/png" });
}
async function injectMetadata(blob: Blob, format: OutputFormat, exifBytes: Uint8Array): Promise<Blob> {
  if (!exifBytes.length) return blob;

  if (format === "image/webp") return injectExifIntoWebP(blob, exifBytes);
  if (format === "image/png") return injectExifIntoPng(blob, exifBytes);

  const jpegBlob = format === "image/jpeg" ? blob : await blobToJpeg(blob);
  const dataUrl = await blobToDataUrl(jpegBlob);
  const exifStr = Array.from(exifBytes, (byte) => String.fromCharCode(byte)).join("");
  const newUrl = piexif.insert(exifStr, dataUrl);
  const bin = atob(newUrl.split(",")[1]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([toArrayBuffer(bytes)], { type: "image/jpeg" });
}
async function processImage(file: File, quality: number, format: OutputFormat, preset: ResizePreset): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (preset === "google-business") { width = 720; height = 720; }
      else if (preset === "thumbnail") { width = 320; height = 240; }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas")); return; }
      if (format === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, width, height); }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      const q = format === "image/png" ? undefined : quality / 100;
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error("fail")), format, q);
    };
    img.onerror = () => reject(new Error("load fail"));
    img.src = url;
  });
}

/* ─── GPS Result Popup ─── */
function GeoTagPopup({
  results,
  lat, lng, locationName,
  onClose,
}: {
  results: GeoTaggedResult[];
  lat: string; lng: string; locationName: string;
  onClose: () => void;
}) {
  const [zipping, setZipping] = useState(false);

  const downloadOne = (r: GeoTaggedResult) => {
    const a = document.createElement("a");
    a.href = r.previewUrl;
    a.download = r.name;
    a.click();
  };

  const downloadAll = async () => {
    if (results.length === 1) { downloadOne(results[0]); return; }
    setZipping(true);
    try {
      const zip = new JSZip();
      results.forEach((r) => zip.file(r.name, r.blob));
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "imgseo-geotagged.zip";
      a.click();
    } finally { setZipping(false); }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      data-testid="geo-popup"
    >
      {/* Panel */}
      <div className="relative bg-background rounded-3xl border border-border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">GPS Coordinates Embedded</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {results.length} image{results.length > 1 ? "s" : ""} ready · {locationName || `${lat}, ${lng}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            data-testid="geo-popup-close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* GPS info strip */}
        <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="font-mono font-semibold">{lat}, {lng}</span>
          {locationName && <span className="text-emerald-600/70 dark:text-emerald-400/70 truncate">— {locationName}</span>}
        </div>

        {/* Image list */}
        <div className="max-h-72 overflow-y-auto divide-y">
          {results.map((r) => (
            <div key={r.id} className="flex items-center gap-3 px-6 py-3.5 hover:bg-muted/10 transition-colors">
              <div className="h-11 w-11 shrink-0 rounded-xl overflow-hidden border bg-muted">
                <img src={r.previewUrl} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{r.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-muted-foreground">{formatBytes(r.size)}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-bold">GPS ✓</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadOne(r)}
                className="h-8 w-8 p-0 rounded-xl shrink-0"
                title="Download this image"
                data-testid={`geo-download-single-${r.id}`}
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-5 border-t bg-muted/10 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Output: current format with GPS metadata embedded
          </p>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-2xl px-4 h-9 text-sm"
            >
              Close
            </Button>
            <button
              onClick={downloadAll}
              disabled={zipping}
              className="btn-3d shine inline-flex items-center gap-2 px-5 h-9 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 transition-colors"
              data-testid="geo-download-all"
            >
              {zipping
                ? <><Archive className="h-4 w-4 animate-pulse" /> Zipping…</>
                : results.length === 1
                  ? <><Download className="h-4 w-4" /> Save Image</>
                  : <><Archive className="h-4 w-4" /> Save All as ZIP</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── sub-components ─── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }); }}
      className="shrink-0 h-7 w-7 inline-flex items-center justify-center rounded-lg bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors"
      title="Copy"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
    </button>
  );
}
function SEORow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-muted/20 p-3.5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground/70">{label}</span>
        <CopyBtn text={value} />
      </div>
      <p className="text-sm font-mono break-all leading-relaxed text-foreground/80 min-h-[1.4rem]">
        {value || <span className="text-muted-foreground/50 not-italic font-sans text-xs">Fill in details above…</span>}
      </p>
    </div>
  );
}
function FieldInput({ label, value, onChange, placeholder, testId }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; testId?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-extrabold text-muted-foreground uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        data-testid={testId}
        className="w-full text-sm border border-border/60 rounded-2xl px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40"
      />
    </div>
  );
}

/* ─── main component ─── */
export function ToolSection({ forcedMode, routeMode = false }: ToolSectionProps) {
  const singlePassMode = !routeMode;
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [preset, setPreset] = useState<ResizePreset>("none");
  const [rightTab, setRightTab] = useState<RightTab>("geo");
  const [toolMode, setToolMode] = useState<ToolMode>(forcedMode ?? readToolMode);

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [geoLocation, setGeoLocation] = useState("");
  const [geoTitle, setGeoTitle] = useState("");
  const [geoDescription, setGeoDescription] = useState("");
  const [geoCopied, setGeoCopied] = useState(false);
  const [applyingGeo, setApplyingGeo] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [zipping, setZipping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const processTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const imagesRef = useRef<ProcessedImage[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    if (forcedMode) setToolMode(forcedMode);
  }, [forcedMode]);

  useEffect(() => {
    if (routeMode) return;
    const onPopState = () => setToolMode(readToolMode());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [routeMode]);

  useEffect(() => {
    if (toolMode === "geo-tagger") {
      setRightTab("geo");
      setFormat("image/jpeg");
      return;
    }
    setRightTab("seo");
    if (toolMode === "webp-converter") {
      setFormat("image/webp");
    }
  }, [toolMode]);

  const fmtExt = ext(format);
  const seoFileName = keyword && location
    ? `${slugify(keyword)}-${slugify(businessName) ? slugify(businessName) + "-" : ""}${slugify(location)}.${fmtExt}`
    : "";
  const altText = keyword && location
    ? `Professional ${keyword} in ${location}${businessName ? " by " + businessName : ""} for local residents`
    : "";
  const titleText = keyword && location
    ? `Best ${keyword} in ${location}${businessName ? " | " + businessName : ""}`
    : "";
  const caption = keyword && location
    ? `Trusted ${keyword} services in ${location}${businessName ? " by " + businessName : ""} — fast and reliable.`
    : "";

  const geoText = lat && lng
    ? [`Latitude: ${lat}`, `Longitude: ${lng}`, `Location: ${geoLocation || "N/A"}`,
       geoTitle ? `Title: ${geoTitle}` : "",
       geoDescription ? `Description: ${geoDescription}` : "",
       "", "ExifTool command:",
       `exiftool -GPSLatitude=${lat} -GPSLongitude=${lng} -GPSLatitudeRef=N -GPSLongitudeRef=E image.jpg`,
      ].filter(Boolean).join("\n")
    : "";

  const hasGeoCoordinates = lat.trim() !== "" && lng.trim() !== "" && !Number.isNaN(parseFloat(lat)) && !Number.isNaN(parseFloat(lng));

  const triggerProcess = useCallback((id: string, file: File) => {
    const ex = processTimers.current.get(id);
    if (ex) clearTimeout(ex);
    const t = setTimeout(async () => {
      setImages((p) => p.map((i) => i.id === id ? { ...i, processing: true } : i));
      try {
        const currentImage = imagesRef.current.find((entry) => entry.id === id);
        const processed = await processImage(file, quality, format, preset);
        const inlineExifBytes =
          singlePassMode && hasGeoCoordinates
            ? createExifBytes(parseFloat(lat), parseFloat(lng), geoTitle, geoDescription)
            : null;
        const metadataBytes = currentImage?.gpsExifBytes ?? inlineExifBytes;
        const blob = metadataBytes ? await injectMetadata(processed, format, metadataBytes) : processed;
        const url = URL.createObjectURL(blob);
        setImages((p) => p.map((i) => {
          if (i.id !== id) return i;
          if (i.optimizedUrl) URL.revokeObjectURL(i.optimizedUrl);
          return {
            ...i,
            processing: false,
            gpsEmbedded: Boolean(metadataBytes),
            gpsExifBytes: metadataBytes ?? null,
            optimizedBlob: blob,
            optimizedUrl: url,
            optimizedSize: blob.size,
          };
        }));
      } catch {
        setImages((p) => p.map((i) => i.id === id ? { ...i, processing: false, optimizedBlob: null, optimizedUrl: null, optimizedSize: null } : i));
      }
      processTimers.current.delete(id);
    }, 300);
    processTimers.current.set(id, t);
  }, [quality, format, preset, singlePassMode, hasGeoCoordinates, lat, lng, geoTitle, geoDescription]);

  useEffect(() => {
    images.forEach((i) => { if (!i.processing) triggerProcess(i.id, i.file); });
  }, [quality, format, preset, lat, lng, geoTitle, geoDescription, triggerProcess]);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp|tiff?|svg|heic|avif)$/i.test(f.name));
    if (!arr.length) return;
    const newImgs: ProcessedImage[] = arr.map((file) => ({
      id: crypto.randomUUID(), file,
      originalUrl: URL.createObjectURL(file),
      originalSize: file.size, gpsEmbedded: false, gpsExifBytes: null, optimizedBlob: null, optimizedUrl: null, optimizedSize: null, processing: false,
    }));
    setImages((p) => [...p, ...newImgs]);
    newImgs.forEach((i) => triggerProcess(i.id, i.file));
    toast({
      title: arr.length === 1 ? "Image uploaded" : `${arr.length} images uploaded`,
      description: arr.length === 1 ? `${arr[0].name} uploaded successfully.` : "Your files were added successfully.",
    });
  }, [triggerProcess]);

  const removeImage = (id: string) => {
    setImages((p) => {
      const img = p.find((i) => i.id === id);
      if (img?.originalUrl) URL.revokeObjectURL(img.originalUrl);
      if (img?.optimizedUrl) URL.revokeObjectURL(img.optimizedUrl);
      return p.filter((i) => i.id !== id);
    });
  };

  const downloadSingle = (img: ProcessedImage) => {
    if (!img.optimizedBlob) return;
    const a = document.createElement("a"); a.href = img.optimizedUrl!; a.download = outName(img.file.name, format); a.click();
  };

  const downloadAll = async () => {
    const ready = images.filter((i) => i.optimizedBlob);
    if (!ready.length) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      ready.forEach((i) => zip.file(outName(i.file.name, format), i.optimizedBlob!));
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "imgseo-optimized.zip"; a.click();
    } finally { setZipping(false); }
  };

  /* ── NEW: embed GPS into memory → show popup ── */
  const embedGPSAndShowPopup = async () => {
    if (!lat || !lng || !images.length) return;
    setApplyingGeo(true);
    try {
      const latN = parseFloat(lat);
      const lngN = parseFloat(lng);
      const exifBytes = createExifBytes(latN, lngN, geoTitle, geoDescription);
      const results = await Promise.all(
        images.map(async (img) => {
          const processed = await processImage(img.file, quality, format, preset);
          const tagged = await injectMetadata(processed, format, exifBytes);
          const name = outName(img.file.name, format);
          const previewUrl = URL.createObjectURL(tagged);
          return { id: img.id, name, blob: tagged, previewUrl, size: tagged.size };
        })
      );
      
      setImages((prev) => prev.map((img) => {
        const tagged = results.find((result) => result.id === img.id);
        if (!tagged) return img;
        if (img.optimizedUrl) URL.revokeObjectURL(img.optimizedUrl);
        return {
          ...img,
          gpsEmbedded: true,
          gpsExifBytes: exifBytes,
          optimizedBlob: tagged.blob,
          optimizedUrl: tagged.previewUrl,
          optimizedSize: tagged.size,
          processing: false,
        };
      }));
      toast({
        title: "GPS embedded",
        description: `${results.length} ${ext(format).toUpperCase()} image${results.length > 1 ? "s are" : " is"} ready below.`,
      });
    } finally {
      setApplyingGeo(false);
    }
  };

  const canEmbedGPS = lat && lng && images.length > 0 && !images.some((i) => i.processing);
  const readyCount = images.filter((i) => i.optimizedBlob).length;
  const processingCount = images.filter((i) => i.processing).length;
  const activeMode = toolModes.find((mode) => mode.key === toolMode) ?? toolModes[0];
  const setModeAndUrl = (mode: ToolMode) => {
    setToolMode(mode);
    if (typeof window !== "undefined") {
      if (routeMode) {
        window.location.assign(getToolPath(mode));
        return;
      }
      const url = new URL(window.location.href);
      url.searchParams.set("tool", mode);
      url.hash = "tool";
      window.history.replaceState({}, "", url.toString());
    }
  };
  const imageQueueCard = images.length > 0 ? (
    <div className="card-3d rounded-[2rem] border border-border/60 bg-background overflow-hidden">
      <div className="flex flex-col gap-3 px-5 py-4 border-b bg-muted/15 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ImageIcon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="block font-extrabold text-sm">{images.length} image{images.length > 1 ? "s" : ""}</span>
            <span className="text-xs text-muted-foreground">{processingCount > 0 ? `${processingCount} processing` : `${readyCount} ready to download`}</span>
          </div>
        </div>
        {images.length > 1 && (
          <Button size="sm" variant="outline" onClick={downloadAll}
            disabled={zipping || images.some((i) => i.processing)}
            className="gap-1.5 h-9 px-4 text-xs rounded-full"
            data-testid="button-download-all">
            <Archive className="h-3.5 w-3.5" />
            {zipping ? "Zippingâ€¦" : "Download ZIP"}
          </Button>
        )}
      </div>

      <div className="divide-y max-h-[24rem] overflow-y-auto">
        {images.map((img) => {
          const saved = img.optimizedSize != null ? Math.round((1 - img.optimizedSize / img.originalSize) * 100) : null;
          return (
            <div key={img.id} className="flex items-center gap-3 px-5 py-4 hover:bg-muted/10 transition-colors">
              <div className="h-14 w-14 shrink-0 rounded-[1.1rem] overflow-hidden border bg-muted">
                <img src={img.originalUrl} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{img.file.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="text-xs text-muted-foreground">{formatBytes(img.originalSize)}</span>
                  {img.gpsEmbedded && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-black">GPS</span>}
                  {img.processing && <span className="text-xs text-primary animate-pulse font-semibold">Processingâ€¦</span>}
                  {!img.processing && img.optimizedSize != null && (
                    <>
                      <span className="text-muted-foreground/40 text-xs">â†’</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{formatBytes(img.optimizedSize)}</span>
                      {saved != null && saved > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-black">-{saved}%</span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button size="sm" variant="outline" onClick={() => downloadSingle(img)}
                  disabled={!img.optimizedBlob || img.processing}
                  className="h-9 w-9 p-0 rounded-xl" title="Download">
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <button onClick={() => removeImage(img.id)}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-xl border hover:bg-destructive/10 hover:border-destructive/50 transition-colors text-muted-foreground hover:text-destructive">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="text-center py-3 text-sm text-muted-foreground/60 flex items-center justify-center gap-2">
      <ImageIcon className="h-4 w-4" /> Upload images above to get started
    </div>
  );

  return (
    <section id="tool" className="scroll-mt-16 py-24 bg-muted/15">
      <div className="container mx-auto px-4">


        {!singlePassMode && (
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {toolModes.map((mode) => (
            <button
              key={mode.key}
              type="button"
              onClick={() => setModeAndUrl(mode.key)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                toolMode === mode.key
                  ? "bg-foreground text-background shadow-lg"
                  : "border border-border/60 bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        )}

        <div className="grid grid-cols-1 gap-6 items-start max-w-4xl mx-auto">

          {/* ════ LEFT ════ */}
          <div className="space-y-5">

            {/* Drop zone */}
            <div
              data-testid="dropzone"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer overflow-hidden rounded-[2rem] border-2 border-dashed p-10 md:p-14 flex flex-col items-center justify-center text-center select-none transition-all duration-200 ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.01] shadow-xl shadow-primary/10"
                  : "border-border/70 hover:border-primary/50 hover:bg-muted/10 bg-background"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.12),_transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.5),transparent)] dark:bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.18),_transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
              {isDragging && (
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-b from-primary/6 to-transparent" />
              )}
              <div className="relative h-18 w-18 rounded-[1.6rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-600 flex items-center justify-center mb-5 shadow-xl shadow-violet-500/25">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <p className="relative text-lg font-black mb-1.5">{isDragging ? "Drop to upload" : "Drag & drop images here"}</p>
              <div className="relative flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground/80 mb-4">
                <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1">Zero uploads</span>
                <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1">Batch export</span>
                <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1">Geo EXIF</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">JPG · PNG · WebP · GIF · BMP · TIFF · AVIF · HEIC</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="btn-3d shine relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors"
                data-testid="button-browse"
              >
                <FileImage className="h-4 w-4" /> Browse Files
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
                data-testid="input-file"
              />
            </div>

            {/* Settings */}
            <div className="hidden">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Settings2 className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-extrabold text-sm">Processing Settings</h3>
              </div>

              {/* Quality */}
              <div>
                <div className="flex justify-between text-sm font-semibold mb-3">
                  <span className="text-muted-foreground">Quality</span>
                  <span className="font-black text-primary tabular-nums">{quality}%</span>
                </div>
                <Slider min={10} max={100} step={5} value={[quality]} onValueChange={([v]) => setQuality(v)} data-testid="slider-quality" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Smaller file</span><span>Best quality</span>
                </div>
              </div>

              {/* Format + Preset */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-1.5">Format</label>
                  <div className="relative">
                    <select value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}
                      className="w-full appearance-none text-sm border border-border/60 rounded-2xl px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/25 pr-8 font-semibold"
                      data-testid="select-format">
                      <option value="image/webp">WebP (recommended)</option>
                      <option value="image/jpeg">JPEG</option>
                      <option value="image/png">PNG</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-1.5">Resize</label>
                  <div className="relative">
                    <select value={preset} onChange={(e) => setPreset(e.target.value as ResizePreset)}
                      className="w-full appearance-none text-sm border border-border/60 rounded-2xl px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/25 pr-8 font-semibold"
                      data-testid="select-preset">
                      <option value="none">Original size</option>
                      <option value="google-business">Google Biz 720×720</option>
                      <option value="thumbnail">Thumbnail 320×240</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Image list */}
            {false && images.length > 0 && (
              <div className="card-3d rounded-[2rem] border border-border/60 bg-background overflow-hidden">
                <div className="flex flex-col gap-4 px-5 py-5 border-b bg-muted/15 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="block font-extrabold text-sm">{images.length} image{images.length > 1 ? "s" : ""}</span>
                      <span className="text-xs text-muted-foreground">{processingCount > 0 ? `${processingCount} processing` : `${readyCount} ready to download`}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {images.length > 1 && (
                      <Button size="sm" variant="outline" onClick={downloadAll}
                        disabled={zipping || images.some((i) => i.processing)}
                        className="gap-1.5 h-9 px-4 text-xs rounded-full"
                        data-testid="button-download-all">
                        <Archive className="h-3.5 w-3.5" />
                        {zipping ? "Zipping…" : "Download ZIP"}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="divide-y max-h-[30rem] overflow-y-auto">
                  {images.map((img) => {
                    const saved = img.optimizedSize != null ? Math.round((1 - img.optimizedSize / img.originalSize) * 100) : null;
                    return (
                      <div key={img.id} className="flex items-center gap-3 px-5 py-4 hover:bg-muted/10 transition-colors">
                        <div className="h-14 w-14 shrink-0 rounded-[1.1rem] overflow-hidden border bg-muted">
                          <img src={img.originalUrl} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{img.file.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-xs text-muted-foreground">{formatBytes(img.originalSize)}</span>
                            {img.gpsEmbedded && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-black">GPS</span>}
                            {img.processing && <span className="text-xs text-primary animate-pulse font-semibold">Processing…</span>}
                            {!img.processing && img.optimizedSize != null && (
                              <>
                                <span className="text-muted-foreground/40 text-xs">→</span>
                                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{formatBytes(img.optimizedSize)}</span>
                                {saved != null && saved > 0 && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-black">-{saved}%</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <Button size="sm" variant="outline" onClick={() => downloadSingle(img)}
                            disabled={!img.optimizedBlob || img.processing}
                            className="h-9 w-9 p-0 rounded-xl" title="Download">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <button onClick={() => removeImage(img.id)}
                            className="h-9 w-9 inline-flex items-center justify-center rounded-xl border hover:bg-destructive/10 hover:border-destructive/50 transition-colors text-muted-foreground hover:text-destructive">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {false && images.length === 0 && (
              <div className="text-center py-3 text-sm text-muted-foreground/60 flex items-center justify-center gap-2">
                <ImageIcon className="h-4 w-4" /> Upload images above to get started
              </div>
            )}
          </div>

          {/* ════ RIGHT ════ */}
          <div className="space-y-4">

            {singlePassMode ? (
              <div className="card-3d rounded-[2rem] border border-border/60 bg-background overflow-hidden">
                <div className="p-5 border-b bg-muted/15 md:p-6">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Satellite className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm">Single-Pass Workflow</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Set your location and processing options once. Every upload is compressed, geo tagged, and converted in one go.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-5 md:p-6">
                  <Suspense fallback={
                    <div className="h-56 rounded-2xl border bg-muted/20 flex items-center justify-center text-sm text-muted-foreground animate-pulse">
                      Loading map...
                    </div>
                  }>
                    <GeoMap
                      lat={lat}
                      lng={lng}
                      locationName={geoLocation}
                      onChange={(nLat, nLng, nName) => { setLat(nLat); setLng(nLng); setGeoLocation(nName); }}
                    />
                  </Suspense>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-1.5">Latitude</label>
                      <input
                        type="text"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        placeholder="25.285447"
                        data-testid="input-lat"
                        className="w-full text-sm border border-border/60 rounded-2xl px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/25 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-1.5">Longitude</label>
                      <input
                        type="text"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        placeholder="51.531040"
                        data-testid="input-lng"
                        className="w-full text-sm border border-border/60 rounded-2xl px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/25 font-mono"
                      />
                    </div>
                  </div>

                  <FieldInput
                    label="Image Title (optional)"
                    value={geoTitle}
                    onChange={setGeoTitle}
                    placeholder="e.g. QuickFix Plumbing Doha Branch"
                    testId="input-geo-title"
                  />

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1.5">Description (optional)</label>
                    <textarea
                      value={geoDescription}
                      onChange={(e) => setGeoDescription(e.target.value)}
                      placeholder="e.g. Emergency plumbing in Doha, Qatar"
                      rows={2}
                      data-testid="input-geo-description"
                      className="w-full text-sm border border-border/60 rounded-2xl px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/25 resize-none"
                    />
                  </div>

                  <div className="card-3d rounded-[1.6rem] border border-border/60 bg-muted/10 p-5 space-y-5">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Settings2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm">Processing Settings</h3>
                        <p className="text-xs text-muted-foreground">These settings apply automatically to every upload.</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-semibold mb-3">
                        <span className="text-muted-foreground">Quality</span>
                        <span className="font-black text-primary tabular-nums">{quality}%</span>
                      </div>
                      <Slider min={10} max={100} step={5} value={[quality]} onValueChange={([v]) => setQuality(v)} data-testid="slider-quality" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>Smaller file</span><span>Best quality</span>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-1.5">Format</label>
                        <div className="relative">
                          <select value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}
                            className="w-full appearance-none text-sm border border-border/60 rounded-2xl px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/25 pr-8 font-semibold"
                            data-testid="select-format">
                            <option value="image/webp">WebP (recommended)</option>
                            <option value="image/jpeg">JPEG</option>
                            <option value="image/png">PNG</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-1.5">Resize</label>
                        <div className="relative">
                          <select value={preset} onChange={(e) => setPreset(e.target.value as ResizePreset)}
                            className="w-full appearance-none text-sm border border-border/60 rounded-2xl px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/25 pr-8 font-semibold"
                            data-testid="select-preset">
                            <option value="none">Original size</option>
                            <option value="google-business">Google Biz 720x720</option>
                            <option value="thumbnail">Thumbnail 320x240</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-200/60 dark:border-emerald-800/40 px-4 py-3 text-xs leading-relaxed text-emerald-800 dark:text-emerald-300">
                      Uploading an image now runs compression, format conversion, and GPS embedding in one pass. Downloads keep the original file base name.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <div className="card-3d rounded-[2rem] border border-border/60 bg-background overflow-hidden">

              {/* Pill tab bar */}
              <div className="p-4 border-b bg-muted/15">
                <div className="flex gap-1 bg-muted/40 rounded-2xl p-1 w-full sm:w-fit">
                  {([
                    { key: "geo", icon: MapPin, label: "Geo Tag" },
                    { key: "seo", icon: Tag,    label: "SEO Text" },
                  ] as { key: RightTab; icon: typeof MapPin; label: string }[]).map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setRightTab(key)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold rounded-xl transition-all duration-200 sm:min-w-[150px] ${
                        rightTab === key
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      data-testid={`tab-${key}`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── GEO TAB ── */}
              {rightTab === "geo" && (
                <div className="p-5 space-y-5 md:p-6">
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    Search your city or click the map to pin your business location. Click <strong>Embed GPS First</strong> to write coordinates into the source images, then use the processing settings below to compress and convert them.
                  </p>

                  <Suspense fallback={
                    <div className="h-56 rounded-2xl border bg-muted/20 flex items-center justify-center text-sm text-muted-foreground animate-pulse">
                      Loading map…
                    </div>
                  }>
                    <GeoMap lat={lat} lng={lng} locationName={geoLocation}
                      onChange={(nLat, nLng, nName) => { setLat(nLat); setLng(nLng); setGeoLocation(nName); }}
                    />
                  </Suspense>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-1.5">Latitude</label>
                      <input type="text" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="25.285447"
                        data-testid="input-lat"
                        className="w-full text-sm border border-border/60 rounded-2xl px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/25 font-mono" />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-1.5">Longitude</label>
                      <input type="text" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="51.531040"
                        data-testid="input-lng"
                        className="w-full text-sm border border-border/60 rounded-2xl px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/25 font-mono" />
                    </div>
                  </div>

                  <FieldInput label="Image Title (optional)" value={geoTitle} onChange={setGeoTitle}
                    placeholder="e.g. QuickFix Plumbing Doha Branch" testId="input-geo-title" />

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-1.5">Description (optional)</label>
                    <textarea value={geoDescription} onChange={(e) => setGeoDescription(e.target.value)}
                      placeholder="e.g. Emergency plumbing in Doha, Qatar" rows={2} data-testid="input-geo-description"
                      className="w-full text-sm border border-border/60 rounded-2xl px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/25 resize-none" />
                  </div>

                  {/* EMBED GPS button — now stores in memory, opens popup */}
                  <button
                    onClick={embedGPSAndShowPopup}
                    disabled={applyingGeo || !canEmbedGPS}
                    data-testid="button-embed-gps"
                    className="btn-3d shine w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none transition-colors"
                  >
                    <Satellite className="h-4 w-4" />
                    {applyingGeo
                      ? "Embedding GPS…"
                      : !lat || !lng
                        ? "Select a location above first"
                        : !images.length
                          ? "Upload images first"
                          : `Embed GPS in ${images.length} Image${images.length > 1 ? "s" : ""}`
                    }
                  </button>

                  {geoText && (
                    <div className="space-y-2.5">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">GPS Reference</p>
                      <div className="rounded-2xl bg-muted/30 border border-border/50 p-4 font-mono text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {geoText}
                      </div>
                      <div className="grid gap-2 md:grid-cols-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          const b = new Blob([geoText], { type: "text/plain" });
                          const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "geo-metadata.txt"; a.click();
                        }} className="gap-1.5 rounded-2xl h-9 text-xs font-bold" data-testid="button-download-geo">
                          <Download className="h-3.5 w-3.5" /> Download .txt
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(geoText); setGeoCopied(true); setTimeout(() => setGeoCopied(false), 1800); }}
                          className="gap-1.5 rounded-2xl h-9 text-xs font-bold" data-testid="button-copy-geo">
                          {geoCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          {geoCopied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/25 border border-amber-200/60 dark:border-amber-800/40 px-4 py-3 text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-1">
                    <p className="font-extrabold">GPS is written directly into image EXIF:</p>
                    <ul className="space-y-0.5 list-disc list-inside text-amber-700/90 dark:text-amber-300/80">
                      <li>JPG, PNG, WebP, GIF, BMP, TIFF, AVIF, and HEIC inputs are supported</li>
                      <li>GPS coordinates are embedded into the final JPEG, PNG, or WebP download</li>
                      <li>The export format follows the format dropdown in Processing Settings</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ── SEO TAB ── */}
              {rightTab === "seo" && (
                <div className="p-5 space-y-5 md:p-6">
                  <p className="text-xs text-muted-foreground leading-relaxed">Enter your business details — SEO-optimised file names, ALT text, title, and captions generated instantly.</p>

                  <div className="grid gap-3 lg:grid-cols-3">
                    <FieldInput label="Business Name" value={businessName} onChange={setBusinessName}
                      placeholder="e.g. QuickFix Plumbing" testId="input-business-name" />
                    <FieldInput label="Target Keyword" value={keyword} onChange={setKeyword}
                      placeholder="e.g. emergency plumber" testId="input-keyword" />
                    <FieldInput label="City / Location" value={location} onChange={setLocation}
                      placeholder="e.g. Doha Qatar" testId="input-location" />
                  </div>

                  <div className="space-y-3 pt-1">
                    <SEORow label="File Name"  value={seoFileName} />
                    <SEORow label="ALT Text"   value={altText} />
                    <SEORow label="Page Title" value={titleText} />
                    <SEORow label="Caption"    value={caption} />
                  </div>
                </div>
              )}
            </div>
            )}

            {!singlePassMode && (
            <div className="card-3d rounded-[2rem] border border-border/60 bg-background p-6 space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Settings2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Processing Settings</h3>
                  <p className="text-xs text-muted-foreground">Embed GPS first, then compress and convert below.</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-3">
                  <span className="text-muted-foreground">Quality</span>
                  <span className="font-black text-primary tabular-nums">{quality}%</span>
                </div>
                <Slider min={10} max={100} step={5} value={[quality]} onValueChange={([v]) => setQuality(v)} data-testid="slider-quality" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Smaller file</span><span>Best quality</span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-1.5">Format</label>
                  <div className="relative">
                    <select value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}
                      className="w-full appearance-none text-sm border border-border/60 rounded-2xl px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/25 pr-8 font-semibold"
                      data-testid="select-format">
                      <option value="image/webp">WebP (recommended)</option>
                      <option value="image/jpeg">JPEG</option>
                      <option value="image/png">PNG</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block mb-1.5">Resize</label>
                  <div className="relative">
                    <select value={preset} onChange={(e) => setPreset(e.target.value as ResizePreset)}
                      className="w-full appearance-none text-sm border border-border/60 rounded-2xl px-4 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/25 pr-8 font-semibold"
                      data-testid="select-preset">
                      <option value="none">Original size</option>
                      <option value="google-business">Google Biz 720Ã—720</option>
                      <option value="thumbnail">Thumbnail 320Ã—240</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
            )}

            {imageQueueCard}

            {/* Pro tips */}
            <div className="rounded-[2rem] border border-primary/15 bg-primary/3 p-5 space-y-3">
              <p className="text-xs font-extrabold text-primary uppercase tracking-widest">Pro Tips</p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="h-4 w-4 mt-0.5 shrink-0 rounded-full bg-primary/10 text-primary text-[9px] font-black flex items-center justify-center">1</span>
                  Use WebP format for 30–40% smaller files and better Google Core Web Vitals scores
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-4 w-4 mt-0.5 shrink-0 rounded-full bg-primary/10 text-primary text-[9px] font-black flex items-center justify-center">2</span>
                  Keyword + city in the file name is the strongest local SEO signal for Google Business Profile
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-4 w-4 mt-0.5 shrink-0 rounded-full bg-primary/10 text-primary text-[9px] font-black flex items-center justify-center">3</span>
                  Embed GPS into images before uploading to GBP for stronger location relevance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
