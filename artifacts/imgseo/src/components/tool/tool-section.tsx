import { useState, useRef, useCallback, useEffect, lazy, Suspense } from "react";
import { Upload, X, Download, Copy, Check, Archive, MapPin, ChevronDown, ImageIcon, Tag, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import JSZip from "jszip";
import piexif from "piexifjs";

const GeoMap = lazy(() => import("./geo-map").then((m) => ({ default: m.GeoMap })));

type OutputFormat = "image/webp" | "image/jpeg" | "image/png";
type ResizePreset = "none" | "google-business" | "thumbnail";

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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

function getExtension(format: OutputFormat): string {
  if (format === "image/webp") return "webp";
  if (format === "image/jpeg") return "jpg";
  return "png";
}

function outputName(originalName: string, format: OutputFormat): string {
  return originalName.replace(/\.[^.]+$/, `.${getExtension(format)}`);
}

function degToDmsRational(deg: number): [[number, number], [number, number], [number, number]] {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.round(((deg - d) * 60 - m) * 60 * 1000);
  return [[d, 1], [m, 1], [s, 1000]];
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onloadend = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(blob);
  });
}

async function blobToJpeg(blob: Blob, quality = 0.92): Promise<Blob> {
  if (blob.type === "image/jpeg") return blob;
  return new Promise((res, rej) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { rej(new Error("Canvas unavailable")); return; }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => b ? res(b) : rej(new Error("Conversion failed")), "image/jpeg", quality);
    };
    img.onerror = () => rej(new Error("Image load failed"));
    img.src = url;
  });
}

async function embedGPS(blob: Blob, lat: number, lng: number, title?: string, description?: string): Promise<Blob> {
  const jpegBlob = await blobToJpeg(blob);
  const dataUrl = await blobToDataUrl(jpegBlob);

  const exifObj: Record<string, Record<number, unknown>> = {
    GPS: {
      [piexif.GPSIFD.GPSLatitudeRef]: lat >= 0 ? "N" : "S",
      [piexif.GPSIFD.GPSLatitude]: degToDmsRational(Math.abs(lat)),
      [piexif.GPSIFD.GPSLongitudeRef]: lng >= 0 ? "E" : "W",
      [piexif.GPSIFD.GPSLongitude]: degToDmsRational(Math.abs(lng)),
    },
  };

  if (title || description) {
    exifObj["0th"] = {};
    if (title) exifObj["0th"][piexif.ImageIFD.ImageDescription] = description ? `${title} — ${description}` : title;
  }

  try {
    const exifStr = piexif.dump(exifObj);
    const newDataUrl = piexif.insert(exifStr, dataUrl);
    const binary = atob(newDataUrl.split(",")[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: "image/jpeg" });
  } catch {
    return jpegBlob;
  }
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
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not available")); return; }
      if (format === "image/jpeg") { ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, width, height); }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      const q = format === "image/png" ? undefined : quality / 100;
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Conversion failed")), format, q);
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = url;
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }); }}
      data-testid="button-copy"
      className="ml-2 shrink-0 h-7 w-7 inline-flex items-center justify-center rounded-md border border-border bg-muted/50 hover:bg-muted transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
    </button>
  );
}

function SEOOutput({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
        <CopyButton text={value} />
      </div>
      <div className="text-sm bg-muted/30 rounded-lg px-3 py-2.5 font-mono break-all leading-relaxed border">
        {value || <span className="text-muted-foreground italic">Fill in details above…</span>}
      </div>
    </div>
  );
}

export function ToolSection() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [preset, setPreset] = useState<ResizePreset>("none");

  // Geo state
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [geoLocation, setGeoLocation] = useState("");
  const [geoTitle, setGeoTitle] = useState("");
  const [geoDescription, setGeoDescription] = useState("");
  const [geoCopied, setGeoCopied] = useState(false);
  const [applyingGeo, setApplyingGeo] = useState(false);

  // SEO state
  const [businessName, setBusinessName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const [zipping, setZipping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const ext = getExtension(format);
  const bn = slugify(businessName);
  const kw = slugify(keyword);
  const loc = slugify(location);

  const seoFileName = kw && loc ? `${kw}-${bn ? bn + "-" : ""}${loc}.${ext}` : "";
  const altText = keyword && location ? `Professional ${keyword} in ${location}${businessName ? " by " + businessName : ""} for local residents` : "";
  const titleText = keyword && location ? `Best ${keyword} in ${location}${businessName ? " | " + businessName : ""}` : "";
  const caption = keyword && location ? `Trusted ${keyword} services in ${location}${businessName ? " by " + businessName : ""} — fast and reliable solutions.` : "";

  const geoText = lat && lng
    ? [
        `Latitude: ${lat}`,
        `Longitude: ${lng}`,
        `Location: ${geoLocation || "N/A"}`,
        geoTitle ? `Title: ${geoTitle}` : "",
        geoDescription ? `Description: ${geoDescription}` : "",
        "",
        "ExifTool command:",
        `exiftool -GPSLatitude=${lat} -GPSLongitude=${lng} -GPSLatitudeRef=N -GPSLongitudeRef=E your-image.jpg`,
        "",
        "How to use:",
        "1. Click 'Embed GPS in Images' to download geo-tagged copies of your images",
        "2. Or use ExifTool / geoimgr.com with the command above",
        "3. Upload geo-tagged images to Google Business Profile",
      ].filter(Boolean).join("\n")
    : "";

  const triggerProcess = useCallback((id: string, file: File) => {
    const existing = processTimers.current.get(id);
    if (existing) clearTimeout(existing);
    const timer = setTimeout(async () => {
      setImages((prev) => prev.map((img) => img.id === id ? { ...img, processing: true } : img));
      try {
        const blob = await processImage(file, quality, format, preset);
        const url = URL.createObjectURL(blob);
        setImages((prev) => prev.map((img) => img.id === id ? { ...img, processing: false, optimizedBlob: blob, optimizedUrl: url, optimizedSize: blob.size } : img));
      } catch {
        setImages((prev) => prev.map((img) => img.id === id ? { ...img, processing: false } : img));
      }
      processTimers.current.delete(id);
    }, 300);
    processTimers.current.set(id, timer);
  }, [quality, format, preset]);

  useEffect(() => {
    images.forEach((img) => { if (!img.processing) triggerProcess(img.id, img.file); });
  }, [quality, format, preset]);

  const addFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp|tiff?|svg|heic|avif)$/i.test(f.name));
    const newImages: ProcessedImage[] = arr.map((file) => ({
      id: crypto.randomUUID(),
      file,
      originalUrl: URL.createObjectURL(file),
      originalSize: file.size,
      optimizedBlob: null,
      optimizedUrl: null,
      optimizedSize: null,
      processing: false,
    }));
    setImages((prev) => [...prev, ...newImages]);
    newImages.forEach((img) => triggerProcess(img.id, img.file));
  }, [triggerProcess]);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img?.originalUrl) URL.revokeObjectURL(img.originalUrl);
      if (img?.optimizedUrl) URL.revokeObjectURL(img.optimizedUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const downloadSingle = (img: ProcessedImage) => {
    if (!img.optimizedBlob) return;
    const name = outputName(img.file.name, format);
    const a = document.createElement("a");
    a.href = img.optimizedUrl!;
    a.download = name;
    a.click();
  };

  const downloadAll = async () => {
    const ready = images.filter((i) => i.optimizedBlob);
    if (!ready.length) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      ready.forEach((img) => { zip.file(outputName(img.file.name, format), img.optimizedBlob!); });
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "imgseo-optimized.zip";
      a.click();
    } finally { setZipping(false); }
  };

  const applyGeoToImages = async () => {
    if (!lat || !lng) return;
    const ready = images.filter((i) => i.optimizedBlob);
    if (!ready.length) return;
    setApplyingGeo(true);
    try {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      if (ready.length === 1) {
        const img = ready[0];
        const tagged = await embedGPS(img.optimizedBlob!, latNum, lngNum, geoTitle, geoDescription);
        const name = img.file.name.replace(/\.[^.]+$/, "_geotagged.jpg");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(tagged);
        a.download = name;
        a.click();
      } else {
        const zip = new JSZip();
        await Promise.all(ready.map(async (img) => {
          const tagged = await embedGPS(img.optimizedBlob!, latNum, lngNum, geoTitle, geoDescription);
          zip.file(img.file.name.replace(/\.[^.]+$/, "_geotagged.jpg"), tagged);
        }));
        const blob = await zip.generateAsync({ type: "blob" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "imgseo-geotagged.zip";
        a.click();
      }
    } finally { setApplyingGeo(false); }
  };

  const downloadGeoTxt = () => {
    const blob = new Blob([geoText], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "geo-metadata.txt";
    a.click();
  };

  const onDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); addFiles(e.dataTransfer.files); };

  return (
    <section id="tool" className="scroll-mt-16 py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Free Image SEO Optimizer</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            All processing happens in your browser. Your images are never uploaded anywhere.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start max-w-7xl mx-auto">

          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-7 space-y-5">
            {/* Upload Zone */}
            <Card>
              <CardContent className="p-5">
                <div
                  data-testid="dropzone"
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all select-none ${
                    isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-muted/20 bg-background"
                  }`}
                >
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Upload className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-semibold text-base mb-1">{isDragging ? "Drop images here" : "Drag & drop images here"}</p>
                  <p className="text-sm text-muted-foreground mb-4">JPG, PNG, WebP, GIF, BMP, TIFF, AVIF, HEIC — all formats supported</p>
                  <Button variant="secondary" size="sm" data-testid="button-browse" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                    Browse Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
                    data-testid="input-file"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-base">Processing Settings</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-5">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>Quality</span>
                    <span className="text-primary font-semibold">{quality}%</span>
                  </div>
                  <Slider min={10} max={100} step={5} value={[quality]} onValueChange={([v]) => setQuality(v)} data-testid="slider-quality" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Smaller file</span><span>Better quality</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Output Format</label>
                    <div className="relative">
                      <select value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)} className="w-full appearance-none text-sm border rounded-lg px-3 py-2 pr-8 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40" data-testid="select-format">
                        <option value="image/webp">WebP (recommended)</option>
                        <option value="image/jpeg">JPG</option>
                        <option value="image/png">PNG</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1.5">Resize Preset</label>
                    <div className="relative">
                      <select value={preset} onChange={(e) => setPreset(e.target.value as ResizePreset)} className="w-full appearance-none text-sm border rounded-lg px-3 py-2 pr-8 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40" data-testid="select-preset">
                        <option value="none">Original size</option>
                        <option value="google-business">Google Business (720×720)</option>
                        <option value="thumbnail">Thumbnail (320×240)</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image List */}
            {images.length > 0 && (
              <Card>
                <CardHeader className="pb-2 pt-5 px-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-base">{images.length} Image{images.length > 1 ? "s" : ""}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      {lat && lng && images.some((i) => i.optimizedBlob) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={applyGeoToImages}
                          disabled={applyingGeo || images.some((i) => i.processing)}
                          data-testid="button-apply-geo"
                          className="gap-1.5 border-primary/40 text-primary hover:bg-primary/5"
                        >
                          <Satellite className="h-4 w-4" />
                          {applyingGeo ? "Embedding…" : `Embed GPS in ${images.length > 1 ? "All" : ""} Image${images.length > 1 ? "s" : ""}`}
                        </Button>
                      )}
                      {images.length > 1 && (
                        <Button size="sm" variant="outline" onClick={downloadAll} disabled={zipping || images.some((i) => i.processing)} data-testid="button-download-all" className="gap-1.5">
                          <Archive className="h-4 w-4" />
                          {zipping ? "Zipping…" : "Download All ZIP"}
                        </Button>
                      )}
                    </div>
                  </div>
                  {!lat && !lng && images.some((i) => i.optimizedBlob) && (
                    <p className="text-xs text-muted-foreground mt-1">Set coordinates in the Geo Tag panel to embed GPS EXIF data</p>
                  )}
                </CardHeader>
                <CardContent className="px-5 pb-5 space-y-3">
                  {images.map((img) => {
                    const saved = img.optimizedSize != null ? Math.round((1 - img.optimizedSize / img.originalSize) * 100) : null;
                    return (
                      <div key={img.id} data-testid={`image-item-${img.id}`} className="flex items-center gap-3 p-3 border rounded-xl bg-muted/10">
                        <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden border bg-muted">
                          <img src={img.originalUrl} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{img.file.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{outputName(img.file.name, format)}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs text-muted-foreground">{formatBytes(img.originalSize)}</span>
                            {img.processing && <span className="text-xs text-primary animate-pulse">Processing…</span>}
                            {!img.processing && img.optimizedSize != null && (
                              <>
                                <span className="text-xs text-muted-foreground">→</span>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{formatBytes(img.optimizedSize)}</span>
                                {saved != null && saved > 0 && (
                                  <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">-{saved}%</span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" variant="outline" onClick={() => downloadSingle(img)} disabled={!img.optimizedBlob || img.processing} data-testid={`button-download-${img.id}`} className="gap-1">
                            <Download className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Save</span>
                          </Button>
                          <button onClick={() => removeImage(img.id)} data-testid={`button-remove-${img.id}`} className="h-8 w-8 inline-flex items-center justify-center rounded-lg border hover:bg-destructive/10 hover:border-destructive transition-colors text-muted-foreground hover:text-destructive">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {images.length === 0 && (
              <div className="text-center py-6 text-sm text-muted-foreground flex flex-col items-center gap-2">
                <ImageIcon className="h-8 w-8 opacity-30" />
                Upload images above to see them here
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="lg:col-span-5 space-y-5">

            {/* GEO TAG CARD — top position */}
            <Card className="border-primary/20">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Geo Tag
                </CardTitle>
                <p className="text-sm text-muted-foreground">Search your city, place a pin, then embed GPS into your images</p>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-4">
                <Suspense fallback={<div className="h-60 rounded-xl border bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">Loading map…</div>}>
                  <GeoMap
                    lat={lat}
                    lng={lng}
                    locationName={geoLocation}
                    onChange={(newLat, newLng, newName) => { setLat(newLat); setLng(newLng); setGeoLocation(newName); }}
                  />
                </Suspense>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium block mb-1">Latitude</label>
                    <input type="text" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="25.285447" className="w-full text-sm border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono" data-testid="input-lat" />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-1">Longitude</label>
                    <input type="text" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="51.531040" className="w-full text-sm border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono" data-testid="input-lng" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1">Image Title <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <input type="text" value={geoTitle} onChange={(e) => setGeoTitle(e.target.value)} placeholder="e.g. QuickFix Plumbing Doha Branch" className="w-full text-sm border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40" data-testid="input-geo-title" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Image Description <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <textarea value={geoDescription} onChange={(e) => setGeoDescription(e.target.value)} placeholder="e.g. Emergency plumbing services in Doha, Qatar" rows={2} className="w-full text-sm border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" data-testid="input-geo-description" />
                </div>

                {/* PRIMARY CTA — Embed GPS */}
                {lat && lng && (
                  <Button
                    className="w-full gap-2"
                    onClick={applyGeoToImages}
                    disabled={applyingGeo || !images.some((i) => i.optimizedBlob)}
                    data-testid="button-embed-gps"
                  >
                    <Satellite className="h-4 w-4" />
                    {applyingGeo
                      ? "Embedding GPS…"
                      : images.some((i) => i.optimizedBlob)
                        ? `Embed GPS in ${images.filter((i) => i.optimizedBlob).length} Image${images.filter((i) => i.optimizedBlob).length > 1 ? "s" : ""}`
                        : "Upload images first"}
                  </Button>
                )}

                {!lat && !lng && (
                  <p className="text-xs text-center text-muted-foreground py-1">Search a location above to enable GPS embedding</p>
                )}

                {geoText && (
                  <div className="space-y-3 pt-1">
                    <div className="bg-muted/30 border rounded-lg p-3 font-mono text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {geoText}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={downloadGeoTxt} className="gap-1.5 flex-1" data-testid="button-download-geo">
                        <Download className="h-3.5 w-3.5" /> .txt File
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1.5 flex-1" data-testid="button-copy-geo"
                        onClick={() => { navigator.clipboard.writeText(geoText); setGeoCopied(true); setTimeout(() => setGeoCopied(false), 1800); }}>
                        {geoCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        {geoCopied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3.5 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  <p className="font-semibold mb-1.5">GPS is embedded directly into your image EXIF:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>JPEG/JPG: full GPS EXIF written in-browser, no upload needed</li>
                    <li>PNG/WebP/GIF: auto-converted to JPEG for EXIF embedding</li>
                    <li>Output file retains original name with <code className="font-mono">_geotagged.jpg</code> suffix</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* SEO DETAILS + OUTPUTS */}
            <Card>
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  SEO Text Generator
                </CardTitle>
                <p className="text-sm text-muted-foreground">Enter business details to generate optimized file names and copy</p>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-4">
                <div className="grid gap-3">
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Business Name (e.g. QuickFix Plumbing)" className="w-full text-sm border rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40" data-testid="input-business-name" />
                  <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Keyword (e.g. emergency plumber)" className="w-full text-sm border rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40" data-testid="input-keyword" />
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location (e.g. Doha Qatar)" className="w-full text-sm border rounded-lg px-3 py-2.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40" data-testid="input-location" />
                </div>
                <div className="space-y-4 pt-1">
                  <SEOOutput label="File Name" value={seoFileName} />
                  <SEOOutput label="ALT Text" value={altText} />
                  <SEOOutput label="Title" value={titleText} />
                  <SEOOutput label="Caption" value={caption} />
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </section>
  );
}
