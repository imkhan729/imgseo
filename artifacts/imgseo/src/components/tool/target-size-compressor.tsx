import { useMemo, useRef, useState } from "react";
import { Download, UploadCloud, X, Image as ImageIcon, Check, Sliders, ShieldCheck } from "lucide-react";
import JSZip from "jszip";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type OutputFormat = "image/jpeg" | "image/webp";

interface TargetItem {
  id: string;
  file: File;
  previewUrl: string;
  compressedBlob: Blob | null;
  compressedUrl: string | null;
  status: "queued" | "compressing" | "done" | "error";
  achievedBytes: number | null;
  quality: number | null;
  scale: number | null;
}

const targetPresets = [20, 50, 100, 200, 500];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function compressToTargetKB(file: File, targetKB: number, outputFormat: OutputFormat) {
  return new Promise<{ blob: Blob; finalQuality: number; scale: number }>((resolve, reject) => {
    const targetBytes = targetKB * 1024;
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = async () => {
      let scale = 1.0;
      let bestBlob: Blob | null = null;
      let bestQuality = 0.8;

      for (let scaleAttempt = 0; scaleAttempt < 4; scaleAttempt++) {
        const canvas = document.createElement("canvas");
        const w = Math.max(32, Math.round(image.naturalWidth * scale));
        const h = Math.max(32, Math.round(image.naturalHeight * scale));
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) break;

        if (outputFormat === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(image, 0, 0, w, h);

        let minQ = 0.05;
        let maxQ = 0.98;
        let foundForScale: Blob | null = null;

        for (let iter = 0; iter < 7; iter++) {
          const midQ = (minQ + maxQ) / 2;
          const blob: Blob | null = await new Promise((res) => canvas.toBlob((b) => res(b), outputFormat, midQ));
          if (!blob) continue;

          if (blob.size <= targetBytes) {
            foundForScale = blob;
            bestQuality = midQ;
            minQ = midQ; // try higher quality
          } else {
            maxQ = midQ; // try lower quality
          }
        }

        if (foundForScale) {
          bestBlob = foundForScale;
          break;
        }

        scale *= 0.75;
      }

      URL.revokeObjectURL(objectUrl);
      if (bestBlob) {
        resolve({ blob: bestBlob, finalQuality: Math.round(bestQuality * 100), scale: Math.round(scale * 100) });
      } else {
        const canvas = document.createElement("canvas");
        const w = Math.max(32, Math.round(image.naturalWidth * scale));
        const h = Math.max(32, Math.round(image.naturalHeight * scale));
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          if (outputFormat === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, w, h);
          }
          ctx.drawImage(image, 0, 0, w, h);
        }
        canvas.toBlob((b) => resolve({ blob: b!, finalQuality: 5, scale: Math.round(scale * 100) }), outputFormat, 0.05);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load ${file.name}`));
    };

    image.src = objectUrl;
  });
}

export function TargetSizeCompressor() {
  const [items, setItems] = useState<TargetItem[]>([]);
  const [targetKB, setTargetKB] = useState<number>(100);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: TargetItem[] = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        compressedBlob: null,
        compressedUrl: null,
        status: "queued",
        achievedBytes: null,
        quality: null,
        scale: null,
      }));

    if (newItems.length === 0) {
      toast({ title: "No valid images", description: "Please select JPEG, PNG, or WebP image files." });
      return;
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  const processAll = async (overrideTarget?: number, overrideFormat?: OutputFormat) => {
    const tKB = overrideTarget ?? targetKB;
    const fmt = overrideFormat ?? format;
    setIsProcessing(true);

    try {
      const updated = await Promise.all(
        items.map(async (item) => {
          try {
            const { blob, finalQuality, scale } = await compressToTargetKB(item.file, tKB, fmt);
            const compressedUrl = URL.createObjectURL(blob);
            return {
              ...item,
              compressedBlob: blob,
              compressedUrl,
              status: "done" as const,
              achievedBytes: blob.size,
              quality: finalQuality,
              scale,
            };
          } catch (e) {
            return { ...item, status: "error" as const };
          }
        })
      );
      setItems(updated);
      toast({ title: "Compression complete", description: `Compressed ${updated.length} image(s) under ${tKB} KB.` });
    } catch (e) {
      toast({ title: "Error", description: "Could not complete compression.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSingle = (item: TargetItem) => {
    if (!item.compressedBlob) return;
    const ext = format === "image/jpeg" ? "jpg" : "webp";
    const nameWithoutExt = item.file.name.replace(/\.[^/.]+$/, "");
    const a = document.createElement("a");
    a.href = item.compressedUrl || URL.createObjectURL(item.compressedBlob);
    a.download = `${nameWithoutExt}-${targetKB}kb.${ext}`;
    a.click();
  };

  const downloadAllZip = async () => {
    const readyItems = items.filter((i) => i.compressedBlob);
    if (readyItems.length === 0) return;

    const zip = new JSZip();
    const ext = format === "image/jpeg" ? "jpg" : "webp";

    readyItems.forEach((item) => {
      const nameWithoutExt = item.file.name.replace(/\.[^/.]+$/, "");
      zip.file(`${nameWithoutExt}-${targetKB}kb.${ext}`, item.compressedBlob!);
    });

    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = `imgseo-compressed-${targetKB}kb.zip`;
    a.click();
    toast({ title: "ZIP Downloaded", description: `Saved ${readyItems.length} files in archive.` });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Target Setting Header Controls */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Target File Size</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">Specify the maximum target size per image in Kilobytes (KB).</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {targetPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setTargetKB(preset);
                  if (items.length > 0) processAll(preset, format);
                }}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all",
                  targetKB === preset
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                )}
              >
                {preset} KB
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 pt-6">
          <div>
            <label htmlFor="custom-kb" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Custom Max KB</label>
            <div className="relative">
              <input
                id="custom-kb"
                type="number"
                min="5"
                max="5000"
                value={targetKB}
                onChange={(e) => setTargetKB(Math.max(5, Number(e.target.value) || 5))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">KB max</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Output Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormat("image/jpeg");
                  if (items.length > 0) processAll(targetKB, "image/jpeg");
                }}
                className={cn(
                  "rounded-xl border py-2.5 text-xs font-bold transition-all text-center",
                  format === "image/jpeg"
                    ? "border-indigo-500 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                    : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                )}
              >
                JPEG (.jpg)
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormat("image/webp");
                  if (items.length > 0) processAll(targetKB, "image/webp");
                }}
                className={cn(
                  "rounded-xl border py-2.5 text-xs font-bold transition-all text-center",
                  format === "image/webp"
                    ? "border-indigo-500 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                    : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                )}
              >
                WebP (.webp)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="group relative cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-white p-10 text-center transition-all hover:border-indigo-400 hover:bg-indigo-50/20 dark:border-slate-800 dark:bg-slate-950"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform dark:bg-indigo-950/40">
          <UploadCloud className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Click or drag images here to compress to &le;{targetKB} KB</h3>
        <p className="mt-2 text-sm text-slate-500">Supports JPG, PNG, WebP. Batch processing in your browser with zero uploads.</p>
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full dark:bg-emerald-950/30 dark:text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" /> 100% Client-Side Private Processing
        </div>
      </div>

      {/* Image List & Processing Grid */}
      {items.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-900">
            <h3 className="font-bold text-slate-900 dark:text-white">{items.length} Image(s) Queued</h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => processAll()}
                disabled={isProcessing}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-500/20 transition-all"
              >
                {isProcessing ? "Compressing..." : `Compress All to \u2264${targetKB} KB`}
              </button>
              {items.some((i) => i.status === "done") && (
                <button
                  type="button"
                  onClick={downloadAllZip}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
                >
                  Download All (.ZIP)
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>

                <div>
                  <div className="h-32 w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <img src={item.compressedUrl || item.previewUrl} alt={item.file.name} className="h-full w-full object-cover" />
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-900 dark:text-white truncate pr-6">{item.file.name}</p>
                  <div className="mt-2 text-[11px] space-y-1 text-slate-500">
                    <div className="flex justify-between">
                      <span>Original Size:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{formatBytes(item.file.size)}</span>
                    </div>
                    {item.achievedBytes !== null && (
                      <div className="flex justify-between">
                        <span>Target: &le;{targetKB} KB</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatBytes(item.achievedBytes)} ({Math.round(((item.file.size - item.achievedBytes) / item.file.size) * 100)}% off)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                  {item.status === "done" ? (
                    <button
                      type="button"
                      onClick={() => downloadSingle(item)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 hover:bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  ) : (
                    <span className="block text-center text-xs font-semibold text-slate-400 py-2">
                      {item.status === "compressing" ? "Optimizing..." : "Ready to compress"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
