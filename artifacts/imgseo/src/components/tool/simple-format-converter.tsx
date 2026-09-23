import { useMemo, useRef, useState, useEffect } from "react";
import { Download, UploadCloud, Trash2, Clock, CheckSquare, Square, ChevronDown } from "lucide-react";
import JSZip from "jszip";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export type OutputFormat = "image/webp" | "image/jpeg" | "image/png";

interface ConvertedImage {
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

const outputFormatOptions: { value: OutputFormat; label: string; extension: string }[] = [
  { value: "image/webp", label: "WebP", extension: "webp" },
  { value: "image/jpeg", label: "JPEG", extension: "jpg" },
  { value: "image/png", label: "PNG", extension: "png" },
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

async function convertFile(file: File, format: OutputFormat, qualityValue: number) {
  return new Promise<Blob>((resolve, reject) => {
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

      const q = format === "image/png" ? undefined : qualityValue / 100;
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Conversion failed."));
          return;
        }
        resolve(blob);
      }, format, q);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not read ${file.name}.`));
    };

    image.src = objectUrl;
  });
}

export function SimpleFormatConverter() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Sidebar Settings
  const [globalQuality, setGlobalQuality] = useState(85);
  const [globalFormat, setGlobalFormat] = useState<OutputFormat>("image/webp");
  const [preserveMetadata, setPreserveMetadata] = useState(true);
  const [lossless, setLossless] = useState(false);
  const [resize, setResize] = useState(false);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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
    const nextFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));

    if (!nextFiles.length) {
      toast({
        title: "Invalid files",
        description: "Please select valid image files.",
      });
      return;
    }

    const nextImages = nextFiles.map((file) => ({
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
    // Set status to converting
    setImages(current => current.map(img => 
      idsToConvert.includes(img.id) ? { ...img, status: 'converting' } : img
    ));

    for (const id of idsToConvert) {
      const imageToConvert = images.find(img => img.id === id);
      if (!imageToConvert) continue;

      try {
        // Fake delay for progress bar effect
        await new Promise(r => setTimeout(r, 600)); 
        
        const blob = await convertFile(imageToConvert.file, imageToConvert.targetFormat, imageToConvert.quality);
        
        setImages(current => current.map(img => {
          if (img.id === id) {
            if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
            return {
              ...img,
              status: 'done',
              convertedBlob: blob,
              convertedUrl: URL.createObjectURL(blob),
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

  return (
    <div className="mx-auto w-full max-w-6xl font-sans text-slate-800">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          
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
              "cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all",
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-blue-200 bg-blue-50/40 hover:border-blue-300 hover:bg-blue-50/60"
            )}
          >
            <div className="mx-auto flex flex-col items-center justify-center">
              <UploadCloud className="h-12 w-12 text-blue-500 mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold text-slate-900">
                Drag & Drop or Click to Upload Images
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Supports JPEG, PNG, SVG up to 50MB
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => addFiles(event.target.files)}
              className="hidden"
            />
          </div>

          {/* My Conversions */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">My Conversions</h3>
                <p className="text-xs text-slate-500 mt-1">Current files with real-time status</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
                <Clock className="h-4 w-4" />
                <span>Queued/Processing</span>
              </div>
            </div>

            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-100">
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
                    <th className="p-4 w-48">Progress</th>
                    <th className="p-4 w-32">Target</th>
                    <th className="p-4 w-40">Settings</th>
                    <th className="p-4 w-32 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {queuedImages.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No files in queue.
                      </td>
                    </tr>
                  ) : (
                    queuedImages.map(img => (
                      <tr key={img.id} className="hover:bg-slate-50/50 transition-colors">
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
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                              <img src={img.previewUrl} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 truncate max-w-[150px]">{img.file.name}</span>
                              <span className="text-xs text-slate-500">{formatBytes(img.file.size)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full bg-blue-600 rounded-full transition-all duration-500 ease-out",
                                  img.status === 'converting' ? "w-[65%]" : "w-0"
                                )}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="relative">
                            <select 
                              value={img.targetFormat}
                              onChange={(e) => updateTargetFormat(img.id, e.target.value as OutputFormat)}
                              className="w-full appearance-none rounded-md bg-green-100/60 text-green-800 font-medium px-3 py-1.5 text-xs outline-none border border-transparent focus:border-green-300 pr-8"
                            >
                              {outputFormatOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label.split(' ')[0]}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-green-700 pointer-events-none" />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col text-xs text-slate-600">
                            <span>Quality {img.quality}%</span>
                            <span>Auto-optimize</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => processConversion([img.id])}
                              disabled={img.status === 'converting'}
                              className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
                            >
                              Convert
                            </button>
                            <button 
                              onClick={() => removeImage(img.id)}
                              className="rounded-md border border-red-100 bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
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
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Recently Converted</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {doneImages.map((img) => {
                  const savings = img.convertedBlob && img.file.size > 0 
                    ? Math.max(0, Math.round((1 - img.convertedBlob.size / img.file.size) * 100)) 
                    : 0;

                  return (
                    <div key={img.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col">
                      <div className="h-32 w-full overflow-hidden rounded-lg bg-slate-100 mb-3 border border-slate-100">
                         <img src={img.previewUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-900 truncate max-w-[180px]">{img.file.name.replace(/\.[^.]+$/, `.${getOutputExtension(img.targetFormat)}`)}</p>
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <span className="text-slate-500">{formatBytes(img.convertedBlob?.size || 0)}</span>
                            {savings > 0 && (
                              <span className="text-emerald-600 font-semibold">{savings}% smaller</span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => downloadOne(img)}
                          className="shrink-0 rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="mt-auto space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Savings</span>
                          <span className="bg-emerald-100/80 text-emerald-700 font-semibold px-2 py-0.5 rounded text-[10px]">{savings}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Original Format</span>
                          <span className="text-slate-700">{formatDate(img.date)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Conversion Settings</h3>
            
            <div className="space-y-6">
              {/* Quality */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-semibold text-slate-800">Quality</label>
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">{globalQuality}%</span>
                </div>
                <Slider 
                  min={0} 
                  max={100} 
                  step={1} 
                  value={[globalQuality]} 
                  onValueChange={([val]) => {
                    setGlobalQuality(val);
                    // Update selected images quality
                    if (selectedIds.size > 0) {
                      setImages(curr => curr.map(img => selectedIds.has(img.id) ? {...img, quality: val} : img));
                    }
                  }} 
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
                  <span>0-100%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Format */}
              <div>
                <label className="text-sm font-semibold text-slate-800 mb-2 block">Format</label>
                <div className="relative">
                  <select 
                    value={globalFormat}
                    onChange={(e) => {
                      const newFormat = e.target.value as OutputFormat;
                      setGlobalFormat(newFormat);
                      // Update selected images format
                      if (selectedIds.size > 0) {
                        setImages(curr => curr.map(img => selectedIds.has(img.id) ? {...img, targetFormat: newFormat} : img));
                      }
                    }}
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pr-10"
                  >
                    {outputFormatOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label.split(' ')[0]}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Advanced */}
              <div>
                <label className="text-sm font-semibold text-slate-800 mb-3 block">Advanced</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer sr-only" 
                        checked={lossless}
                        onChange={(e) => setLossless(e.target.checked)}
                      />
                      <div className="h-5 w-5 rounded border border-slate-300 bg-white transition-colors peer-checked:border-blue-600 peer-checked:bg-blue-600 group-hover:border-blue-500" />
                      <svg className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-700 font-medium">Lossless</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer sr-only" 
                        checked={preserveMetadata}
                        onChange={(e) => setPreserveMetadata(e.target.checked)}
                      />
                      <div className="h-5 w-5 rounded border border-slate-300 bg-white transition-colors peer-checked:border-blue-600 peer-checked:bg-blue-600 group-hover:border-blue-500" />
                      <svg className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-700 font-medium">Preserve Metadata</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer sr-only" 
                        checked={resize}
                        onChange={(e) => setResize(e.target.checked)}
                      />
                      <div className="h-5 w-5 rounded border border-slate-300 bg-white transition-colors peer-checked:border-blue-600 peer-checked:bg-blue-600 group-hover:border-blue-500" />
                      <svg className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-slate-700 font-medium">Resize</span>
                  </label>
                </div>
              </div>

              {/* Bulk Convert Action */}
              <div className="pt-4">
                <button 
                  onClick={() => processConversion(Array.from(selectedIds))}
                  disabled={selectedIds.size === 0 || queuedImages.some(img => selectedIds.has(img.id) && img.status === 'converting')}
                  className="w-full rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Bulk Convert {selectedIds.size > 0 ? `(${selectedIds.size} File${selectedIds.size > 1 ? 's' : ''})` : ''}
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
