import { useState, useRef, useCallback, useEffect, lazy, Suspense } from "react";
import {
  Upload, X, Download, Copy, Check, Archive, MapPin, ChevronDown,
  ImageIcon, Tag, Satellite, Zap, Settings2, FileImage,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
  optimizedBlob: Blob | null;
  optimizedUrl: string | null;
  optimizedSize: number | null;
  processing: boolean;
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

function degToDms(d: number): [[number, number], [number, number], [number, number]] {
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  const sec = Math.round(((d - deg) * 60 - min) * 60 * 1000);
  return [[deg, 1], [min, 1], [sec, 1000]];
}
async function blobToDataUrl(b: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader(); r.onloadend = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(b);
  });
}
async function blobToJpeg(b: Blob, q = 0.92): Promise<Blob> {
  if (b.type === "image/jpeg") return b;
  return new Promise((res, rej) => {
    const img = new Image(); const url = URL.createObjectURL(b);
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext("2d"); if (!ctx) { rej(new Error("No canvas")); return; }
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url); c.toBlob((bl) => bl ? res(bl) : rej(new Error("fail")), "image/jpeg", q);
    };
    img.onerror = () => rej(new Error("load fail")); img.src = url;
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
async function processImage(file: File, quality: number, format: OutputFormat, preset: ResizePreset): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      if (preset === "google-business") { width = 720; height = 720; }
      else if (preset === "thumbnail") { width = 320; height = 240; }
      const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d"); if (!ctx) { reject(new Error("No canvas")); return; }
      if (format === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, width, height); }
      ctx.drawImage(img, 0, 0, width, height); URL.revokeObjectURL(url);
      const q = format === "image/png" ? undefined : quality / 100;
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error("fail")), format, q);
    };
    img.onerror = () => reject(new Error("load fail")); img.src = url;
  });
}

/* ─── sub-components ─── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }); }}
      className="shrink-0 h-7 w-7 inline-flex items-center justify-center rounded-lg border border-border/60 bg-muted/40 hover:bg-muted transition-colors"
      title="Copy"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
    </button>
  );
}
function SEORow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/20 p-3 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        <CopyBtn text={value} />
      </div>
      <p className="text-sm font-mono break-all leading-relaxed text-foreground/80 min-h-[1.4rem]">
        {value || <span className="text-muted-foreground/60 not-italic font-sans text-xs">Fill details above…</span>}
      </p>
    </div>
  );
}
function FieldInput({ label, value, onChange, placeholder, testId }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; testId?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{label}</label>
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        data-testid={testId}
        className="w-full text-sm border border-border/60 rounded-xl px-3.5 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
      />
    </div>
  );
}

/* ─── main component ─── */
export function ToolSection() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [preset, setPreset] = useState<ResizePreset>("none");
  const [rightTab, setRightTab] = useState<RightTab>("geo");

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

  const triggerProcess = useCallback((id: string, file: File) => {
    const ex = processTimers.current.get(id);
    if (ex) clearTimeout(ex);
    const t = setTimeout(async () => {
      setImages((p) => p.map((i) => i.id === id ? { ...i, processing: true } : i));
      try {
        const blob = await processImage(file, quality, format, preset);
        const url = URL.createObjectURL(blob);
        setImages((p) => p.map((i) => i.id === id ? { ...i, processing: false, optimizedBlob: blob, optimizedUrl: url, optimizedSize: blob.size } : i));
      } catch {
        setImages((p) => p.map((i) => i.id === id ? { ...i, processing: false } : i));
      }
      processTimers.current.delete(id);
    }, 300);
    processTimers.current.set(id, t);
  }, [quality, format, preset]);

  useEffect(() => {
    images.forEach((i) => { if (!i.processing) triggerProcess(i.id, i.file); });
  }, [quality, format, preset]);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp|tiff?|svg|heic|avif)$/i.test(f.name));
    const newImgs: ProcessedImage[] = arr.map((file) => ({
      id: crypto.randomUUID(), file,
      originalUrl: URL.createObjectURL(file),
      originalSize: file.size, optimizedBlob: null, optimizedUrl: null, optimizedSize: null, processing: false,
    }));
    setImages((p) => [...p, ...newImgs]);
    newImgs.forEach((i) => triggerProcess(i.id, i.file));
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

  const applyGeoToImages = async () => {
    if (!lat || !lng) return;
    const ready = images.filter((i) => i.optimizedBlob);
    if (!ready.length) return;
    setApplyingGeo(true);
    try {
      const latN = parseFloat(lat); const lngN = parseFloat(lng);
      if (ready.length === 1) {
        const tagged = await embedGPS(ready[0].optimizedBlob!, latN, lngN, geoTitle, geoDescription);
        const a = document.createElement("a"); a.href = URL.createObjectURL(tagged);
        a.download = ready[0].file.name.replace(/\.[^.]+$/, "_geotagged.jpg"); a.click();
      } else {
        const zip = new JSZip();
        await Promise.all(ready.map(async (i) => {
          const tagged = await embedGPS(i.optimizedBlob!, latN, lngN, geoTitle, geoDescription);
          zip.file(i.file.name.replace(/\.[^.]+$/, "_geotagged.jpg"), tagged);
        }));
        const blob = await zip.generateAsync({ type: "blob" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "imgseo-geotagged.zip"; a.click();
      }
    } finally { setApplyingGeo(false); }
  };

  return (
    <section id="tool" className="scroll-mt-16 py-20 bg-muted/20">
      <div className="container mx-auto px-4">

        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-bold uppercase tracking-widest text-primary mb-5">
            <Zap className="h-3.5 w-3.5" /> Free Image SEO Tool
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Optimize in Your Browser
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            All processing happens locally. Your images are never uploaded anywhere.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start max-w-6xl mx-auto">

          {/* ════ LEFT COLUMN ════ */}
          <div className="space-y-4">

            {/* Upload drop zone */}
            <div
              data-testid="dropzone"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center select-none transition-all duration-200 ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.01] shadow-xl shadow-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-muted/20 bg-background"
              }`}
            >
              {/* gradient glow when dragging */}
              {isDragging && (
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/8 to-transparent" />
              )}
              <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-5 shadow-lg shadow-violet-500/25">
                <Upload className="h-7 w-7 text-white" />
              </div>
              <p className="text-base font-bold mb-1">{isDragging ? "Drop to upload" : "Drag & drop images"}</p>
              <p className="text-sm text-muted-foreground mb-5">JPG · PNG · WebP · GIF · BMP · TIFF · AVIF · HEIC</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="btn-3d inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-500 hover:to-indigo-700 transition-colors"
                data-testid="button-browse"
              >
                <FileImage className="h-4 w-4" /> Browse Files
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
                data-testid="input-file"
              />
            </div>

            {/* Settings card */}
            <div className="card-3d rounded-2xl border bg-background p-5 space-y-5">
              <div className="flex items-center gap-2 pb-1">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Settings2 className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-bold text-sm">Processing Settings</h3>
              </div>

              {/* Quality slider */}
              <div>
                <div className="flex justify-between text-sm font-medium mb-3">
                  <span className="text-muted-foreground">Quality</span>
                  <span className="font-bold text-primary tabular-nums">{quality}%</span>
                </div>
                <Slider min={10} max={100} step={5} value={[quality]} onValueChange={([v]) => setQuality(v)} data-testid="slider-quality" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Smaller file</span><span>Best quality</span>
                </div>
              </div>

              {/* Format + Preset */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">Format</label>
                  <div className="relative">
                    <select value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)}
                      className="w-full appearance-none text-sm border border-border/60 rounded-xl px-3.5 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 pr-8"
                      data-testid="select-format">
                      <option value="image/webp">WebP (best)</option>
                      <option value="image/jpeg">JPEG</option>
                      <option value="image/png">PNG</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-1.5">Resize</label>
                  <div className="relative">
                    <select value={preset} onChange={(e) => setPreset(e.target.value as ResizePreset)}
                      className="w-full appearance-none text-sm border border-border/60 rounded-xl px-3.5 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 pr-8"
                      data-testid="select-preset">
                      <option value="none">Original</option>
                      <option value="google-business">Google Biz (720×720)</option>
                      <option value="thumbnail">Thumbnail (320×240)</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Image list */}
            {images.length > 0 && (
              <div className="card-3d rounded-2xl border bg-background overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b bg-muted/20">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span className="font-bold text-sm">{images.length} image{images.length > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex gap-2">
                    {lat && lng && images.some((i) => i.optimizedBlob) && (
                      <Button size="sm" variant="outline" onClick={applyGeoToImages}
                        disabled={applyingGeo || images.some((i) => i.processing)}
                        className="gap-1.5 h-8 text-xs border-primary/30 text-primary hover:bg-primary/5 rounded-lg"
                        data-testid="button-apply-geo">
                        <Satellite className="h-3.5 w-3.5" />
                        {applyingGeo ? "Embedding…" : "Embed GPS"}
                      </Button>
                    )}
                    {images.length > 1 && (
                      <Button size="sm" variant="outline" onClick={downloadAll}
                        disabled={zipping || images.some((i) => i.processing)}
                        className="gap-1.5 h-8 text-xs rounded-lg"
                        data-testid="button-download-all">
                        <Archive className="h-3.5 w-3.5" />
                        {zipping ? "Zipping…" : "Download ZIP"}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="divide-y max-h-96 overflow-y-auto">
                  {images.map((img) => {
                    const saved = img.optimizedSize != null ? Math.round((1 - img.optimizedSize / img.originalSize) * 100) : null;
                    return (
                      <div key={img.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/10 transition-colors">
                        <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden border bg-muted shadow-sm">
                          <img src={img.originalUrl} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{img.file.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-xs text-muted-foreground">{formatBytes(img.originalSize)}</span>
                            {img.processing && <span className="text-xs text-primary animate-pulse font-medium">Processing…</span>}
                            {!img.processing && img.optimizedSize != null && (
                              <>
                                <span className="text-muted-foreground/40 text-xs">→</span>
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{formatBytes(img.optimizedSize)}</span>
                                {saved != null && saved > 0 && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-bold">-{saved}%</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <Button size="sm" variant="outline" onClick={() => downloadSingle(img)}
                            disabled={!img.optimizedBlob || img.processing}
                            className="h-8 w-8 p-0 rounded-lg" title="Download">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <button onClick={() => removeImage(img.id)}
                            className="h-8 w-8 inline-flex items-center justify-center rounded-lg border hover:bg-destructive/10 hover:border-destructive transition-colors text-muted-foreground hover:text-destructive">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {images.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground flex items-center justify-center gap-2 opacity-60">
                <ImageIcon className="h-5 w-5" /> Upload images above to get started
              </div>
            )}
          </div>

          {/* ════ RIGHT COLUMN ════ */}
          <div className="space-y-4">

            {/* Tabs */}
            <div className="card-3d rounded-2xl border bg-background overflow-hidden">
              {/* Tab bar */}
              <div className="flex border-b bg-muted/30">
                {([
                  { key: "geo", icon: MapPin,  label: "Geo Tag" },
                  { key: "seo", icon: Tag,     label: "SEO Text" },
                ] as { key: RightTab; icon: typeof MapPin; label: string }[]).map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setRightTab(key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                      rightTab === key
                        ? "border-primary text-primary bg-background"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                    data-testid={`tab-${key}`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* ── GEO TAB ── */}
              {rightTab === "geo" && (
                <div className="p-5 space-y-4">
                  <p className="text-xs text-muted-foreground">Search your city or click the map to pin your business location, then embed GPS into your images.</p>

                  <Suspense fallback={
                    <div className="h-56 rounded-xl border bg-muted/30 flex items-center justify-center text-sm text-muted-foreground animate-pulse">
                      Loading map…
                    </div>
                  }>
                    <GeoMap lat={lat} lng={lng} locationName={geoLocation}
                      onChange={(nLat, nLng, nName) => { setLat(nLat); setLng(nLng); setGeoLocation(nName); }}
                    />
                  </Suspense>

                  {/* Coordinates */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Latitude</label>
                      <input type="text" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="25.285447"
                        data-testid="input-lat"
                        className="w-full text-sm border border-border/60 rounded-xl px-3.5 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Longitude</label>
                      <input type="text" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="51.531040"
                        data-testid="input-lng"
                        className="w-full text-sm border border-border/60 rounded-xl px-3.5 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" />
                    </div>
                  </div>

                  <FieldInput label="Image Title (optional)" value={geoTitle} onChange={setGeoTitle}
                    placeholder="e.g. QuickFix Plumbing Doha Branch" testId="input-geo-title" />

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Description (optional)</label>
                    <textarea value={geoDescription} onChange={(e) => setGeoDescription(e.target.value)}
                      placeholder="e.g. Emergency plumbing in Doha, Qatar" rows={2} data-testid="input-geo-description"
                      className="w-full text-sm border border-border/60 rounded-xl px-3.5 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                  </div>

                  {/* Embed GPS CTA */}
                  <button
                    onClick={applyGeoToImages}
                    disabled={applyingGeo || !lat || !lng || !images.some((i) => i.optimizedBlob)}
                    data-testid="button-embed-gps"
                    className="btn-3d shine w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-500 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none transition-colors"
                  >
                    <Satellite className="h-4.5 w-4.5" />
                    {applyingGeo
                      ? "Embedding GPS…"
                      : !lat || !lng
                        ? "Select a location above first"
                        : !images.some((i) => i.optimizedBlob)
                          ? "Upload images first"
                          : `Embed GPS in ${images.filter((i) => i.optimizedBlob).length} Image${images.filter((i) => i.optimizedBlob).length > 1 ? "s" : ""}`
                    }
                  </button>

                  {geoText && (
                    <div className="space-y-2.5">
                      <div className="rounded-xl bg-muted/30 border p-3.5 font-mono text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {geoText}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          const b = new Blob([geoText], { type: "text/plain" });
                          const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "geo-metadata.txt"; a.click();
                        }} className="gap-1.5 rounded-xl h-9 text-xs" data-testid="button-download-geo">
                          <Download className="h-3.5 w-3.5" /> Download .txt
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(geoText); setGeoCopied(true); setTimeout(() => setGeoCopied(false), 1800); }}
                          className="gap-1.5 rounded-xl h-9 text-xs" data-testid="button-copy-geo">
                          {geoCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                          {geoCopied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl bg-amber-50 dark:bg-amber-950/25 border border-amber-200/70 dark:border-amber-800/50 px-4 py-3 text-xs text-amber-800 dark:text-amber-300 leading-relaxed space-y-1">
                    <p className="font-bold">GPS is written directly into image EXIF:</p>
                    <ul className="space-y-0.5 list-disc list-inside text-amber-700/90 dark:text-amber-300/80">
                      <li>JPEG: full GPS EXIF embedded in-browser</li>
                      <li>PNG / WebP / GIF: auto-converted to JPEG first</li>
                      <li>Output saved as <code className="font-mono">_geotagged.jpg</code></li>
                    </ul>
                  </div>
                </div>
              )}

              {/* ── SEO TAB ── */}
              {rightTab === "seo" && (
                <div className="p-5 space-y-5">
                  <p className="text-xs text-muted-foreground">Enter your business details — SEO-optimized file names, ALT text, title, and captions are generated instantly.</p>

                  <div className="space-y-3">
                    <FieldInput label="Business Name" value={businessName} onChange={setBusinessName}
                      placeholder="e.g. QuickFix Plumbing" testId="input-business-name" />
                    <FieldInput label="Target Keyword" value={keyword} onChange={setKeyword}
                      placeholder="e.g. emergency plumber" testId="input-keyword" />
                    <FieldInput label="City / Location" value={location} onChange={setLocation}
                      placeholder="e.g. Doha Qatar" testId="input-location" />
                  </div>

                  <div className="space-y-3 pt-2">
                    <SEORow label="File Name"  value={seoFileName} />
                    <SEORow label="ALT Text"   value={altText} />
                    <SEORow label="Page Title" value={titleText} />
                    <SEORow label="Caption"    value={caption} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick tips */}
            <div className="rounded-2xl border border-primary/15 bg-primary/3 p-4 space-y-2">
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Pro Tips</p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-0.5">→</span> Use WebP format for 30–40% smaller files, which improves Google Core Web Vitals</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-0.5">→</span> Keyword + city in the file name is the strongest local SEO signal for Google Business Profile</li>
                <li className="flex items-start gap-2"><span className="text-primary font-bold mt-0.5">→</span> Embed GPS into images before uploading to GBP for stronger location relevance</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
