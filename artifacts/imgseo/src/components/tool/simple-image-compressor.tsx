import { useMemo, useRef, useState } from "react";
import { Download, UploadCloud, X, ChevronUp, Image as ImageIcon, Check } from "lucide-react";
import JSZip from "jszip";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type CompressionFormat = "image/webp" | "image/jpeg" | "image/png" | "original";

interface CompressedImage {
  id: string;
  file: File;
  previewUrl: string;
  compressedBlob: Blob | null;
  compressedUrl: string | null;
  status: "queued" | "compressing" | "done" | "error";
  originalFormat: string;
}

const formatOptions: { value: CompressionFormat; label: string; extension: string }[] = [
  { value: "original", label: "Keep Original", extension: "" },
  { value: "image/webp", label: "WEBP", extension: "webp" },
  { value: "image/jpeg", label: "JPEG", extension: "jpg" },
  { value: "image/png", label: "PNG", extension: "png" },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getExtension(format: CompressionFormat, originalName: string) {
  if (format === "original") {
    const parts = originalName.split('.');
    return parts[parts.length - 1].toLowerCase();
  }
  return formatOptions.find((option) => option.value === format)?.extension ?? "webp";
}

async function compressFile(file: File, format: CompressionFormat, quality: number) {
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

      if (format === "image/jpeg" || (format === "original" && file.type === "image/jpeg")) {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(objectUrl);

      const outputFormat = format === "original" ? (file.type as CompressionFormat) : format;
      const q = outputFormat === "image/png" ? undefined : quality / 100;
      
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Compression failed."));
          return;
        }
        resolve(blob);
      }, outputFormat, q);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Could not read ${file.name}.`));
    };

    image.src = objectUrl;
  });
}

// Custom Toggle Switch
function Switch({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        checked ? "bg-indigo-500" : "bg-slate-200"
      )}
      onClick={() => onChange(!checked)}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

// Custom Checkbox
function CustomCheckbox({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
        checked ? "border-indigo-500 bg-indigo-500 text-white" : "border-slate-300 bg-white"
      )}
    >
      {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
    </button>
  )
}

export function SimpleImageCompressor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Settings State
  const [quality, setQuality] = useState(75);
  const [convertFormat, setConvertFormat] = useState(true);
  const [outputFormat, setOutputFormat] = useState<CompressionFormat>("image/webp");
  const [preserveMetadata, setPreserveMetadata] = useState(true);
  const [autoResize, setAutoResize] = useState(false);

  const [isCompressing, setIsCompressing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const queuedImages = useMemo(() => images.filter(img => img.status !== 'done'), [images]);
  const doneImages = useMemo(() => images.filter(img => img.status === 'done'), [images]);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;

    const nextFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (!nextFiles.length) {
      toast({
        title: "No supported images found",
        description: "Upload browser-supported image files to compress them.",
      });
      return;
    }

    const nextImages = nextFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      compressedBlob: null,
      compressedUrl: null,
      status: "queued" as const,
      originalFormat: file.type,
    }));

    setImages((current) => [...current, ...nextImages]);
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const target = current.find((image) => image.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.compressedUrl) URL.revokeObjectURL(target.compressedUrl);
      }
      return current.filter((image) => image.id !== id);
    });
  };

  const runCompression = async () => {
    const idsToCompress = queuedImages.map(img => img.id);
    if (!idsToCompress.length) return;

    setIsCompressing(true);
    setImages(current => current.map(img => 
      idsToCompress.includes(img.id) ? { ...img, status: 'compressing' } : img
    ));

    const finalFormat = convertFormat ? outputFormat : "original";

    for (const id of idsToCompress) {
      const imageToCompress = images.find(img => img.id === id);
      if (!imageToCompress) continue;

      try {
        // Fake delay for progress bar effect
        await new Promise(r => setTimeout(r, 400));
        
        const compressedBlob = await compressFile(imageToCompress.file, finalFormat, quality);
        
        setImages((current) =>
          current.map((image) => {
            if (image.id === id) {
              if (image.compressedUrl) URL.revokeObjectURL(image.compressedUrl);
              return {
                ...image,
                status: 'done',
                compressedBlob,
                compressedUrl: URL.createObjectURL(compressedBlob),
              };
            }
            return image;
          })
        );
      } catch (error) {
        setImages((current) => current.map(img => img.id === id ? { ...img, status: 'error' } : img));
        toast({
          title: "Compression failed",
          description: error instanceof Error ? error.message : "Please try another image.",
        });
      }
    }

    setIsCompressing(false);
  };

  const downloadOne = (image: CompressedImage) => {
    if (!image.compressedUrl || !image.compressedBlob) return;
    const link = document.createElement("a");
    link.href = image.compressedUrl;
    const finalFormat = convertFormat ? outputFormat : "original";
    link.download = image.file.name.replace(/\.[^.]+$/, `.${getExtension(finalFormat, image.file.name)}`);
    link.click();
  };

  const downloadAll = async () => {
    if (!doneImages.length) return;
    if (doneImages.length === 1) {
      downloadOne(doneImages[0]);
      return;
    }

    setIsZipping(true);
    try {
      const zip = new JSZip();
      const finalFormat = convertFormat ? outputFormat : "original";
      
      doneImages.forEach((image) => {
        if (!image.compressedBlob) return;
        zip.file(image.file.name.replace(/\.[^.]+$/, `.${getExtension(finalFormat, image.file.name)}`), image.compressedBlob);
      });
      const archive = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(archive);
      link.download = `compressed-images.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl font-sans text-slate-800 -mt-2">
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Content Area */}
        <div className="flex-1 space-y-6 min-w-0">
          
          {/* Main Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            
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
              className={cn(
                "flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-14 px-6 text-center transition-colors bg-[#F8FAFC]",
                isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-slate-300 hover:border-indigo-400"
              )}
            >
              <UploadCloud className="h-16 w-16 text-[#9BA3AF] mb-4" strokeWidth={1.5} />
              
              <h3 className="text-xl font-bold text-slate-900">
                Drag & Drop Images Here or <button onClick={() => inputRef.current?.click()} className="underline hover:text-indigo-600 focus:outline-none">Browse</button>
              </h3>
              <span className="text-slate-500 my-2 text-sm font-medium">or</span>
              
              <button 
                onClick={() => inputRef.current?.click()}
                className="bg-[#6B53FF] hover:bg-[#5C45EE] text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm transition-colors mb-4"
              >
                Upload Images
              </button>
              
              <p className="text-xs font-medium text-slate-500">
                Supports JPEG, PNG, WEBP, SVG, Max 25MB each
              </p>
              
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => addFiles(event.target.files)}
                className="hidden"
              />
            </div>

            {/* Queued List */}
            {queuedImages.length > 0 && (
              <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#EEF2F6] text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4 pl-5">Image name</th>
                      <th className="p-4">Original size</th>
                      <th className="p-4">Compressed size</th>
                      <th className="p-4">Savings</th>
                      <th className="p-4 w-12 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {queuedImages.map(img => (
                      <tr key={img.id}>
                        <td className="p-4 pl-5">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 shrink-0 rounded border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                            <span 
                              className="font-medium text-slate-700 block max-w-[120px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[400px] truncate" 
                              title={img.file.name}
                            >
                              {img.file.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">({formatBytes(img.file.size)})</td>
                        <td className="p-4 text-slate-600">TBD</td>
                        <td className="p-4">
                          {img.status === 'compressing' ? (
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 w-[60%] animate-pulse rounded-full" />
                            </div>
                          ) : (
                            <span className="text-slate-600">TBD</span>
                          )}
                        </td>
                        <td className="p-4 text-right pr-5">
                          <button 
                            onClick={() => removeImage(img.id)}
                            className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Results Card */}
          {doneImages.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Results</h3>
                <button 
                  onClick={downloadAll}
                  disabled={isZipping}
                  className="bg-[#6B53FF] hover:bg-[#5C45EE] text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-colors text-sm"
                >
                  {isZipping ? "Zipping..." : "Download All (zip)"}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white text-slate-900 font-bold border-b border-slate-100">
                    <tr>
                      <th className="p-4 pl-6">Image name</th>
                      <th className="p-4">Original size</th>
                      <th className="p-4">Compressed size</th>
                      <th className="p-4">Savings</th>
                      <th className="p-4 pr-6 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {doneImages.map(img => {
                      const savings = img.compressedBlob && img.file.size > 0 
                        ? Math.max(0, Math.round((1 - img.compressedBlob.size / img.file.size) * 100)) 
                        : 0;
                      
                      return (
                        <tr key={img.id}>
                          <td className="p-4 pl-6 font-medium text-slate-700">
                            <span 
                              className="block max-w-[120px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-[400px] truncate" 
                              title={img.file.name}
                            >
                              {img.file.name}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600">({formatBytes(img.file.size)})</td>
                          <td className="p-4 text-slate-900 font-medium">
                            {formatBytes(img.compressedBlob?.size || 0)}
                          </td>
                          <td className="p-4">
                            {savings > 0 ? (
                              <span className="inline-flex items-center justify-center bg-[#E5F7ED] text-[#00A95D] px-3 py-1 rounded-full text-xs font-bold border border-[#C2EED7]">
                                -{savings}%
                              </span>
                            ) : (
                              <span className="text-slate-400">0%</span>
                            )}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button 
                              onClick={() => downloadOne(img)}
                              className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-1.5 rounded-lg font-medium text-xs transition-colors shadow-sm"
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Compression Settings</h3>
            
            <div className="space-y-6">
              
              {/* Quality Slider */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold text-slate-900">Quality</label>
                  <span className="bg-[#6B53FF] text-white text-xs font-bold px-2 py-1 rounded-md">{quality}%</span>
                </div>
                <Slider 
                  min={1} 
                  max={100} 
                  step={1} 
                  value={[quality]} 
                  onValueChange={([val]) => setQuality(val)}
                  className="[&>span:first-child]:bg-indigo-100 [&_[role=slider]]:bg-white [&_[role=slider]]:border-4 [&_[role=slider]]:border-[#6B53FF] [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&_[data-orientation=horizontal]>span:first-child]:h-2 [&_[data-orientation=horizontal]>span:nth-child(2)]:bg-[#6B53FF]"
                />
                <div className="flex justify-between text-xs text-slate-700 mt-2 font-medium">
                  <span>0</span>
                  <span>Balanced</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Advanced Options */}
              <div>
                <div className="flex justify-between items-center mb-4 cursor-pointer">
                  <label className="text-sm font-bold text-slate-900">Advanced options</label>
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                </div>
                
                <div className="space-y-4">
                  {/* Convert Format */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheckbox checked={convertFormat} onChange={setConvertFormat} />
                      <span className="text-sm text-slate-700 font-medium">Convert format:</span>
                    </label>
                    <select 
                      disabled={!convertFormat}
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value as CompressionFormat)}
                      className="appearance-none rounded border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500 disabled:opacity-50"
                    >
                      {formatOptions.filter(o => o.value !== 'original').map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label.split(' ')[0]}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Preserve Metadata */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheckbox checked={preserveMetadata} onChange={setPreserveMetadata} />
                      <span className="text-sm text-slate-700 font-medium">Preserve Metadata</span>
                    </label>
                    <Switch checked={preserveMetadata} onChange={setPreserveMetadata} />
                  </div>

                  {/* Auto-resize */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <CustomCheckbox checked={autoResize} onChange={setAutoResize} />
                      <span className="text-sm text-slate-700 font-medium">Auto-resize width</span>
                    </label>
                    <Switch checked={autoResize} onChange={setAutoResize} />
                  </div>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-4">
                <button 
                  onClick={runCompression}
                  disabled={!queuedImages.length || isCompressing}
                  className="w-full rounded-xl bg-gradient-to-r from-[#6B53FF] to-[#A36BFF] py-3.5 px-4 text-sm font-bold text-white shadow-md hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 transition-opacity"
                >
                  {isCompressing ? "COMPRESSING..." : "START COMPRESSION"}
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
