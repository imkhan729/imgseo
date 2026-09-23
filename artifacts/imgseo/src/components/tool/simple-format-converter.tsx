import { useMemo, useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Download, UploadCloud, Trash2, Clock, CheckSquare, Square, ChevronDown, Sparkles, FileArchive, CheckCircle2 } from "lucide-react";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
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

const outputFormatOptions: { value: OutputFormat; label: string; extension: string }[] = [
  { value: "image/webp", label: "WebP (Best for Web & SEO)", extension: "webp" },
  { value: "image/jpeg", label: "JPEG / JPG (Universal)", extension: "jpg" },
  { value: "image/png", label: "PNG (Lossless / Transparent)", extension: "png" },
];

function getOutputExtension(format: OutputFormat) {
  return outputFormatOptions.find((option) => option.value === format)?.extension ?? "webp";
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
      reject(new Error(`Could not decode ${file.name}. Please ensure it is a supported image format.`));
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
  
  // Sidebar Settings
  const [globalQuality, setGlobalQuality] = useState(85);
  const [globalFormat, setGlobalFormat] = useState<OutputFormat>(initialTargetFormat);
  const [currentSourceExt, setCurrentSourceExt] = useState(activeSourceExt || initialSourceFormat || "JPG");
  const [currentTargetExt, setCurrentTargetExt] = useState(activeTargetExt || "WEBP");
  const [preserveMetadata, setPreserveMetadata] = useState(true);
  const [lossless, setLossless] = useState(false);
  const [resize, setResize] = useState(false);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Sync when props change
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
        title: "Invalid files",
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
    
    // Auto select new files
    setSelectedIds(current => {
      const newSet = new Set(current);
      nextImages.forEach(img => newSet.add(img.id));
      return newSet;
    });

    toast({
      title: `${nextFiles.length} ${nextFiles.length === 1 ? 'image' : 'images'} added`,
      description: `Target format set to ${getOutputExtension(globalFormat).toUpperCase()}. Click Convert to process.`,
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

    // Set status to converting
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
        
        // Remove from selection once done
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
    <div className="mx-auto w-full max-w-6xl font-sans text-slate-800">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          
          {/* Active Mode Indicator Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-sky-500/10 border border-blue-200/80 dark:border-blue-800/60 rounded-2xl px-5 py-3.5 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></div>
              <span className="text-xs text-slate-600 dark:text-slate-300">Active Conversion:</span>
              <span className="rounded-md bg-blue-600 text-white font-extrabold px-2.5 py-0.5 text-xs uppercase tracking-wide shadow-sm">
                {currentModeDisplay}
              </span>
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <span>Exporting as:</span>
              <strong className="text-blue-700 dark:text-blue-300 font-bold uppercase">{getOutputExtension(globalFormat)}</strong>
            </div>
          </div>

          {/* Dropzone */}
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
              "cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all relative overflow-hidden group",
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-[1.01]"
                : "border-blue-200 bg-blue-50/40 hover:border-blue-400 hover:bg-blue-50/70 dark:border-slate-800 dark:bg-slate-900/40"
            )}
          >
            <div className="mx-auto flex flex-col items-center justify-center">
              <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <UploadCloud className="h-8 w-8 text-blue-600" strokeWidth={1.8} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Drag & Drop or Click to Upload {currentSourceExt !== "WEBP" ? currentSourceExt : "Images"}
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                100% Client-Side Sandbox · Zero Server Uploads · Fast Batch Conversion
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors">
                <Sparkles className="h-3.5 w-3.5" />
                Browse {currentSourceExt} Files
              </div>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.svg,.gif,.bmp,.ico,.tiff,.heic"
              multiple
              onChange={(event) => addFiles(event.target.files)}
              className="hidden"
            />
          </div>

          {/* My Conversions Queue */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Conversions</h3>
                <p className="text-xs text-slate-500 mt-1">Current files with real-time status</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                <span>{queuedImages.length} Queued / {doneImages.length} Ready</span>
              </div>
            </div>

            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-100 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="p-4 w-12 text-center">
                      <button onClick={toggleSelectAll} className="text-slate-400 hover:text-blue-600 outline-none">
                        {selectedIds.size > 0 && selectedIds.size === queuedImages.length ? (
                          <CheckSquare className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </th>
                    <th className="p-4">File</th>
                    <th className="p-4 w-48">Status / Progress</th>
                    <th className="p-4 w-32">Target Format</th>
                    <th className="p-4 w-36">Quality</th>
                    <th className="p-4 w-32 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {queuedImages.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                        {images.length === 0 ? "No images uploaded yet. Drop files above to begin." : "All queued images have been converted! See recently converted below."}
                      </td>
                    </tr>
                  ) : (
                    queuedImages.map(img => (
                      <tr key={img.id} className="hover:bg-slate-50/50 transition-colors dark:hover:bg-slate-900/30">
                        <td className="p-4 text-center">
                          <button onClick={() => toggleSelect(img.id)} className="text-slate-400 hover:text-blue-600 outline-none">
                            {selectedIds.has(img.id) ? (
                              <CheckSquare className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Square className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                              <img src={img.previewUrl} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 dark:text-white truncate max-w-[160px]">{img.file.name}</span>
                              <span className="text-xs text-slate-500">{formatBytes(img.file.size)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {img.status === 'converting' ? (
                              <div className="flex items-center gap-2 w-full">
                                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden dark:bg-slate-800">
                                  <div className="h-full bg-blue-600 rounded-full w-3/4 animate-pulse" />
                                </div>
                                <span className="text-xs font-bold text-blue-600">Converting...</span>
                              </div>
                            ) : img.status === 'error' ? (
                              <span className="text-xs font-bold text-red-500">Failed</span>
                            ) : (
                              <span className="text-xs text-slate-500 font-medium">Ready in queue</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="relative">
                            <select 
                              value={img.targetFormat}
                              onChange={(e) => updateTargetFormat(img.id, e.target.value as OutputFormat)}
                              className="w-full appearance-none rounded-md bg-blue-50 text-blue-800 font-bold px-3 py-1.5 text-xs outline-none border border-blue-200 focus:border-blue-400 pr-8 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
                            >
                              {outputFormatOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label.split(' ')[0]}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-blue-700 pointer-events-none dark:text-blue-300" />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col text-xs text-slate-600 dark:text-slate-400">
                            <span className="font-semibold text-slate-900 dark:text-white">Quality {img.quality}%</span>
                            <span className="text-[11px] text-slate-500">Browser canvas</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => processConversion([img.id])}
                              disabled={img.status === 'converting'}
                              className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 shadow-sm hover:bg-blue-600 hover:text-white disabled:opacity-50 transition-colors dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                            >
                              Convert
                            </button>
                            <button 
                              onClick={() => removeImage(img.id)}
                              className="rounded-md border border-red-100 bg-red-50 p-1.5 text-red-500 hover:bg-red-100 dark:border-red-950 dark:bg-red-950/30"
                              title="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
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

          {/* Recently Converted */}
          {doneImages.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Recently Converted ({doneImages.length})
                  </h3>
                  <p className="text-xs text-slate-500">Download individually or all at once</p>
                </div>
                {doneImages.length > 1 && (
                  <button
                    onClick={downloadAllZip}
                    disabled={isZipping}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
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
                    <div key={img.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col dark:border-slate-800 dark:bg-slate-950">
                      <div className="h-32 w-full overflow-hidden rounded-lg bg-slate-100 mb-3 border border-slate-100 dark:border-slate-800 dark:bg-slate-900">
                         <img src={img.convertedUrl || img.previewUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                            {img.file.name.replace(/\.[^.]+$/, `.${getOutputExtension(img.targetFormat)}`)}
                          </p>
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <span className="text-slate-500">{formatBytes(img.convertedBlob?.size || 0)}</span>
                            {savings > 0 ? (
                              <span className="text-emerald-600 font-bold">-{savings}%</span>
                            ) : (
                              <span className="text-slate-500">Converted</span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => downloadOne(img)}
                          className="shrink-0 rounded-md bg-blue-50 border border-blue-200 p-2 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                          title="Download Converted File"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex justify-between items-center text-slate-500">
                        <span>Format: <strong className="text-slate-700 dark:text-slate-300 uppercase">{getOutputExtension(img.targetFormat)}</strong></span>
                        <span>{formatDate(img.date)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
        </div>

        {/* Sidebar Controls */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 sticky top-6 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Conversion Settings</h3>
            
            <div className="space-y-6">
              {/* Quality */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Quality</label>
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">{globalQuality}%</span>
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
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                  <span>Smaller Size</span>
                  <span>Maximum Quality</span>
                </div>
              </div>

              {/* Target Format */}
              <div>
                <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 block">Target Export Format</label>
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
                        onModeChange(currentSourceExt, getOutputExtension(newFormat).toUpperCase(), newFormat);
                      }
                    }}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    {outputFormatOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Bulk Convert Action */}
              <div className="pt-2">
                <button 
                  onClick={() => processConversion(Array.from(selectedIds.size > 0 ? selectedIds : new Set(queuedImages.map(img => img.id))))}
                  disabled={queuedImages.length === 0 || queuedImages.some(img => img.status === 'converting')}
                  className="w-full rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Convert {queuedImages.length > 0 ? `(${queuedImages.length} Image${queuedImages.length > 1 ? 's' : ''})` : ''}
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
});
