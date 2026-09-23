import { useMemo, useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Download, UploadCloud, Trash2, Clock, CheckSquare, Square, ChevronDown, Sparkles, CheckCircle2, Sliders, ShieldCheck, Check } from "lucide-react";
import JSZip from "jszip";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export type OutputFormat = "image/webp" | "image/jpeg" | "image/png";

export interface ConvertedImage {
  id: string;
  file: File;
  previewUrl: string;
  convertedBlob: Blob | null;
  convertedUrl: string | null;
  status: "queued" | "converting" | "done" | "error";
  targetFormat: OutputFormat;
  quality: number;
  date: Date;
}

export interface SimpleFormatConverterRef {
  openFilePicker: () => void;
  setTargetFormat: (fmt: OutputFormat) => void;
  setMode: (source: string, target: string, format: OutputFormat) => void;
}

export interface SimpleFormatConverterProps {
  initialTargetFormat?: OutputFormat;
  initialSourceFormat?: string;
  activeModeLabel?: string;
  activeSourceExt?: string;
  activeTargetExt?: string;
  onModeChange?: (source: string, target: string, format: OutputFormat) => void;
}

const outputFormatOptions: { value: OutputFormat; label: string; shortLabel: string; extension: string }[] = [
  { value: "image/webp", label: "WebP (Recommended for SEO)", shortLabel: "WebP", extension: "webp" },
  { value: "image/jpeg", label: "JPEG / JPG (Universal)", shortLabel: "JPEG", extension: "jpg" },
  { value: "image/png", label: "PNG (Lossless & Alpha)", shortLabel: "PNG", extension: "png" },
];

function getOutputExtension(format: OutputFormat) {
  return outputFormatOptions.find((option) => option.value === format)?.extension ?? "webp";
}

function getShortLabel(format: OutputFormat) {
  return outputFormatOptions.find((option) => option.value === format)?.shortLabel ?? "WebP";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function convertFile(file: File, format: OutputFormat, qualityValue: number): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      try {
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

        const q = format === "image/png" ? undefined : Math.min(Math.max(qualityValue / 100, 0.05), 1.0);
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Conversion output could not be generated."));
            return;
          }
          resolve(blob);
        }, format, q);
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err instanceof Error ? err : new Error("Failed to render and convert image."));
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not decode ${file.name}. Please ensure it is a valid image file.`));
    };

    image.src = objectUrl;
  });
}

export const SimpleFormatConverter = forwardRef<SimpleFormatConverterRef, SimpleFormatConverterProps>(function SimpleFormatConverter(
  {
    initialTargetFormat = "image/webp",
    initialSourceFormat = "JPG",
    activeModeLabel,
    activeSourceExt,
    activeTargetExt,
    onModeChange,
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  
  // Settings State
  const [globalQuality, setGlobalQuality] = useState(85);
  const [globalFormat, setGlobalFormat] = useState<OutputFormat>(initialTargetFormat);
  const [currentSourceExt, setCurrentSourceExt] = useState(activeSourceExt || initialSourceFormat || "JPG");
  const [currentTargetExt, setCurrentTargetExt] = useState(activeTargetExt || "WEBP");
  const [preserveMetadata, setPreserveMetadata] = useState(true);
  const [lossless, setLossless] = useState(false);
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Synchronize when props update
  useEffect(() => {
    if (initialTargetFormat) {
      setGlobalFormat(initialTargetFormat);
    }
  }, [initialTargetFormat]);

  useEffect(() => {
    if (activeSourceExt) setCurrentSourceExt(activeSourceExt);
    if (activeTargetExt) setCurrentTargetExt(activeTargetExt);
  }, [activeSourceExt, activeTargetExt]);

  useImperativeHandle(ref, () => ({
    openFilePicker: () => {
      inputRef.current?.click();
    },
    setTargetFormat: (fmt: OutputFormat) => {
      setGlobalFormat(fmt);
      if (selectedIds.size > 0) {
        setImages(curr => curr.map(img => selectedIds.has(img.id) ? { ...img, targetFormat: fmt } : img));
      }
    },
    setMode: (source: string, target: string, format: OutputFormat) => {
      setCurrentSourceExt(source);
      setCurrentTargetExt(target);
      setGlobalFormat(format);
      if (selectedIds.size > 0) {
        setImages(curr => curr.map(img => selectedIds.has(img.id) ? { ...img, targetFormat: format } : img));
      }
    }
  }));

  const queuedImages = useMemo(() => images.filter(img => img.status !== 'done'), [images]);
  const doneImages = useMemo(() => images.filter(img => img.status === 'done').sort((a, b) => b.date.getTime() - a.date.getTime()), [images]);

  const toggleSelectAll = () => {
    if (selectedIds.size === queuedImages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(queuedImages.map(img => img.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const addFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const nextFiles = Array.from(fileList).filter((file) => 
      file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|bmp|tiff?|svg|heic|avif|ico)$/i.test(file.name)
    );

    if (!nextFiles.length) {
      toast({
        title: "No supported images",
        description: "Please select valid image files (JPG, PNG, WebP, SVG, AVIF, GIF, BMP, TIFF, ICO).",
      });
      return;
    }

    const nextImages: ConvertedImage[] = nextFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      convertedBlob: null,
      convertedUrl: null,
      status: "queued" as const,
      targetFormat: globalFormat,
      quality: globalQuality,
      date: new Date(),
    }));

    setImages((current) => [...current, ...nextImages]);
    
    // Auto-select newly added files
    setSelectedIds(current => {
      const newSet = new Set(current);
      nextImages.forEach(img => newSet.add(img.id));
      return newSet;
    });

    toast({
      title: `${nextFiles.length} ${nextFiles.length === 1 ? 'image' : 'images'} added`,
      description: `Target set to ${getShortLabel(globalFormat)}. Click Convert to process.`,
    });
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const target = current.find((image) => image.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.convertedUrl) URL.revokeObjectURL(target.convertedUrl);
      }
      return current.filter((image) => image.id !== id);
    });
    setSelectedIds(current => {
      const newSet = new Set(current);
      newSet.delete(id);
      return newSet;
    });
  };

  const processConversion = async (idsToConvert: string[]) => {
    if (!idsToConvert.length) return;

    setImages(current => current.map(img => 
      idsToConvert.includes(img.id) ? { ...img, status: 'converting' } : img
    ));

    for (const id of idsToConvert) {
      const imageToConvert = images.find(img => img.id === id);
      if (!imageToConvert) continue;

      try {
        const blob = await convertFile(imageToConvert.file, imageToConvert.targetFormat, imageToConvert.quality);
        const newUrl = URL.createObjectURL(blob);
        
        setImages(current => current.map(img => {
          if (img.id === id) {
            if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
            return {
              ...img,
              status: 'done',
              convertedBlob: blob,
              convertedUrl: newUrl,
              date: new Date()
            };
          }
          return img;
        }));
        
        // Remove from selection once converted
        setSelectedIds(current => {
          const newSet = new Set(current);
          newSet.delete(id);
          return newSet;
        });

      } catch (error) {
        setImages(current => current.map(img => 
          img.id === id ? { ...img, status: 'error' } : img
        ));
        toast({
          title: "Conversion error",
          description: error instanceof Error ? error.message : "Failed to convert file.",
          variant: "destructive",
        });
      }
    }
  };

  const updateTargetFormat = (id: string, format: OutputFormat) => {
    setImages(current => current.map(img => img.id === id ? { ...img, targetFormat: format } : img));
  };

  const downloadOne = (image: ConvertedImage) => {
    if (!image.convertedUrl || !image.convertedBlob) return;
    const link = document.createElement("a");
    link.href = image.convertedUrl;
    link.download = image.file.name.replace(/\.[^.]+$/, `.${getOutputExtension(image.targetFormat)}`);
    link.click();
  };

  const downloadAllZip = async () => {
    if (!doneImages.length) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      doneImages.forEach(img => {
        if (img.convertedBlob) {
          const filename = img.file.name.replace(/\.[^.]+$/, `.${getOutputExtension(img.targetFormat)}`);
          zip.file(filename, img.convertedBlob);
        }
      });
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipBlob);
      link.download = `imgseo-converted-images.zip`;
      link.click();
      toast({
        title: "ZIP Downloaded",
        description: `Successfully packaged ${doneImages.length} converted images into ZIP.`,
      });
    } catch (err) {
      toast({
        title: "ZIP error",
        description: "Failed to generate ZIP archive.",
        variant: "destructive",
      });
    } finally {
      setIsZipping(false);
    }
  };

  const currentModeDisplay = activeModeLabel || `${currentSourceExt} → ${currentTargetExt}`;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Main Workspace Area */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Active Mode Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-sky-500/10 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Mode:</span>
                <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
                  {currentModeDisplay}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <span>Target Format:</span>
              <span className="rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-extrabold uppercase text-primary">
                {getShortLabel(globalFormat)}
              </span>
            </div>
          </div>

          {/* 3D Modern Dropzone */}
          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              addFiles(event.dataTransfer.files);
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "card-3d relative cursor-pointer overflow-hidden rounded-[2rem] border-2 border-dashed p-10 md:p-14 text-center transition-all duration-300 select-none",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01] shadow-2xl shadow-primary/15"
                : "border-border/80 bg-card hover:border-primary/60 hover:bg-muted/15"
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.6),transparent)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
            
            <div className="relative mx-auto flex flex-col items-center justify-center">
              <div className="h-18 w-18 rounded-[1.6rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center mb-5 shadow-xl shadow-indigo-500/25">
                <UploadCloud className="h-9 w-9 text-white" strokeWidth={2} />
              </div>
              
              <h3 className="text-xl md:text-2xl font-black text-foreground mb-2">
                Drag & Drop or Click to Upload {currentSourceExt !== "WEBP" ? currentSourceExt : "Images"}
              </h3>
              
              <p className="text-sm font-medium text-muted-foreground max-w-md mx-auto mb-5">
                Supports JPG, PNG, WebP, SVG, AVIF, HEIC, GIF, BMP, TIFF up to 50MB
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">
                <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1 shadow-sm">100% Client-Side</span>
                <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1 shadow-sm">Zero Server Uploads</span>
                <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1 shadow-sm">Batch ZIP Export</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="btn-3d shine relative inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                Browse {currentSourceExt} Files
              </button>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.svg,.gif,.bmp,.ico,.tiff,.heic"
              multiple
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = "";
              }}
              className="hidden"
            />
          </div>

          {/* My Conversions Queue */}
          <div className="card-3d rounded-[2rem] border border-border/70 bg-card overflow-hidden shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 p-5 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">My Conversions Queue</h3>
                  <p className="text-xs text-muted-foreground">Current image status and individual options</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-foreground shadow-sm">
                  {queuedImages.length} Queued · {doneImages.length} Ready
                </span>
              </div>
            </div>

            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted/40 text-muted-foreground font-bold text-xs uppercase tracking-wider border-b border-border/60">
                  <tr>
                    <th className="p-4 w-12 text-center">
                      <button onClick={toggleSelectAll} className="text-muted-foreground hover:text-primary transition-colors outline-none">
                        {selectedIds.size > 0 && selectedIds.size === queuedImages.length ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </th>
                    <th className="p-4">File</th>
                    <th className="p-4 w-40">Progress</th>
                    <th className="p-4 w-36">Target</th>
                    <th className="p-4 w-36">Settings</th>
                    <th className="p-4 w-28 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {queuedImages.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-muted-foreground">
                        {images.length === 0 
                          ? "No images in queue. Drop files into the upload box above to start converting." 
                          : "All queued files have been converted! See downloaded assets below."}
                      </td>
                    </tr>
                  ) : (
                    queuedImages.map(img => (
                      <tr key={img.id} className="hover:bg-muted/15 transition-colors">
                        <td className="p-4 text-center">
                          <button onClick={() => toggleSelect(img.id)} className="text-muted-foreground hover:text-primary transition-colors outline-none">
                            {selectedIds.has(img.id) ? (
                              <CheckSquare className="h-5 w-5 text-primary" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                              <img src={img.previewUrl} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-foreground truncate max-w-[180px]">{img.file.name}</span>
                              <span className="text-xs font-semibold text-muted-foreground">{formatBytes(img.file.size)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {img.status === 'converting' ? (
                              <div className="flex items-center gap-2 w-full">
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-primary rounded-full w-3/4 animate-pulse" />
                                </div>
                                <span className="text-xs font-bold text-primary animate-pulse">Converting...</span>
                              </div>
                            ) : img.status === 'error' ? (
                              <span className="text-xs font-bold text-destructive">Failed</span>
                            ) : (
                              <span className="text-xs text-muted-foreground font-medium">Ready in queue</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="relative inline-block min-w-[110px]">
                            <select 
                              value={img.targetFormat}
                              onChange={(e) => updateTargetFormat(img.id, e.target.value as OutputFormat)}
                              className="w-full appearance-none rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary outline-none focus:ring-2 focus:ring-primary/25 pr-7 cursor-pointer"
                            >
                              {outputFormatOptions.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-background text-foreground font-semibold">
                                  {opt.shortLabel}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary" />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col text-xs">
                            <span className="font-bold text-foreground">Quality {img.quality}%</span>
                            <span className="text-[11px] text-muted-foreground">Auto-tuned</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => processConversion([img.id])}
                              disabled={img.status === 'converting'}
                              className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white disabled:opacity-50 transition-colors shadow-sm"
                            >
                              Convert
                            </button>
                            <button 
                              onClick={() => removeImage(img.id)}
                              className="h-8 w-8 inline-flex items-center justify-center rounded-xl border border-border hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive text-muted-foreground transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recently Converted Grid */}
          {doneImages.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Recently Converted ({doneImages.length})
                  </h3>
                  <p className="text-xs text-muted-foreground">Download files individually or packaged as a ZIP</p>
                </div>
                {doneImages.length > 1 && (
                  <button
                    onClick={downloadAllZip}
                    disabled={isZipping}
                    className="btn-3d shine inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-emerald-500 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    {isZipping ? "Packaging ZIP..." : "Download All (ZIP)"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {doneImages.map((img) => {
                  const savings = img.convertedBlob && img.file.size > 0 
                    ? Math.round((1 - img.convertedBlob.size / img.file.size) * 100)
                    : 0;

                  return (
                    <div key={img.id} className="card-3d rounded-2xl border border-border/70 bg-card p-4 shadow-sm flex flex-col">
                      <div className="h-32 w-full overflow-hidden rounded-xl bg-muted mb-3 border border-border/50">
                         <img src={img.convertedUrl || img.previewUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                      
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-foreground text-sm truncate">
                            {img.file.name.replace(/\.[^.]+$/, `.${getOutputExtension(img.targetFormat)}`)}
                          </p>
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <span className="text-muted-foreground font-semibold">{formatBytes(img.convertedBlob?.size || 0)}</span>
                            {savings > 0 ? (
                              <span className="rounded-md bg-emerald-100 dark:bg-emerald-950/50 px-1.5 py-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-400">
                                -{savings}%
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-[10px]">Optimized</span>
                            )}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => downloadOne(img)}
                          className="shrink-0 h-9 w-9 inline-flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-colors shadow-sm"
                          title="Download Converted Image"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="mt-auto pt-2.5 border-t border-border/50 text-[11px] flex justify-between items-center text-muted-foreground">
                        <span className="font-medium">Format: <strong className="text-foreground uppercase">{getShortLabel(img.targetFormat)}</strong></span>
                        <span>{formatDate(img.date)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
        </div>

        {/* Sidebar Settings Panel */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="card-3d rounded-[2rem] border border-border/70 bg-card p-6 shadow-sm sticky top-6 space-y-6">
            <div className="flex items-center gap-2.5 border-b border-border/60 pb-4">
              <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Sliders className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-foreground">Conversion Settings</h3>
                <p className="text-xs text-muted-foreground">Batch output & compression</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Quality Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground">Quality</label>
                  <span className="rounded-lg bg-primary px-2.5 py-0.5 text-xs font-black text-primary-foreground tabular-nums shadow-sm">
                    {globalQuality}%
                  </span>
                </div>
                <Slider 
                  min={10} 
                  max={100} 
                  step={5} 
                  value={[globalQuality]} 
                  onValueChange={([val]) => {
                    setGlobalQuality(val);
                    if (selectedIds.size > 0) {
                      setImages(curr => curr.map(img => selectedIds.has(img.id) ? {...img, quality: val} : img));
                    }
                  }} 
                  className="py-2"
                />
                <div className="flex justify-between text-[11px] font-semibold text-muted-foreground mt-1.5">
                  <span>Lighter File</span>
                  <span>Maximum Quality</span>
                </div>
              </div>

              {/* Target Format Selector */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2 block">
                  Export Format
                </label>
                <div className="relative">
                  <select 
                    value={globalFormat}
                    onChange={(e) => {
                      const newFormat = e.target.value as OutputFormat;
                      setGlobalFormat(newFormat);
                      if (selectedIds.size > 0) {
                        setImages(curr => curr.map(img => selectedIds.has(img.id) ? {...img, targetFormat: newFormat} : img));
                      }
                      if (onModeChange) {
                        onModeChange(currentSourceExt, getShortLabel(newFormat).toUpperCase(), newFormat);
                      }
                    }}
                    className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/25 pr-10 shadow-sm cursor-pointer"
                  >
                    {outputFormatOptions.map(opt => (
                      <option key={opt.value} value={opt.value} className="bg-background text-foreground font-semibold">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-3 pt-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
                  Advanced Options
                </label>
                
                <div 
                  onClick={() => setPreserveMetadata(!preserveMetadata)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  <div className={cn(
                    "h-5 w-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                    preserveMetadata ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"
                  )}>
                    {preserveMetadata && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">Preserve Web Quality</span>
                    <span className="text-[10px] text-muted-foreground">Maintains color gamut and aspect ratio</span>
                  </div>
                </div>

                <div 
                  onClick={() => setLossless(!lossless)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors"
                >
                  <div className={cn(
                    "h-5 w-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                    lossless ? "bg-primary border-primary text-primary-foreground" : "border-border bg-background"
                  )}>
                    {lossless && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">Lossless Color Profile</span>
                    <span className="text-[10px] text-muted-foreground">Zero loss compression for sharp graphics</span>
                  </div>
                </div>
              </div>

              {/* Bulk Convert Action Button */}
              <div className="pt-2">
                <button 
                  onClick={() => processConversion(Array.from(selectedIds.size > 0 ? selectedIds : new Set(queuedImages.map(img => img.id))))}
                  disabled={queuedImages.length === 0 || queuedImages.some(img => img.status === 'converting')}
                  className="btn-3d shine w-full py-3.5 px-5 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-xl shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Bulk Convert {queuedImages.length > 0 ? `(${queuedImages.length} Image${queuedImages.length > 1 ? 's' : ''})` : ''}
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
});
