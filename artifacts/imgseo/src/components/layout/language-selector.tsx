import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { supportedLanguages, getLanguageFromPath, getEquivalentPath } from "@/data/languages";

interface LanguageSelectorProps {
  currentPath?: string;
}

export function LanguageSelector({ currentPath }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const pathname = currentPath || (typeof window !== "undefined" ? window.location.pathname : "/");
  const currentLang = getLanguageFromPath(pathname);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Language selector. Current language: ${currentLang.nativeName}`}
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="hidden sm:inline font-medium">{currentLang.nativeName}</span>
        <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Select Language
          </div>
          <div className="grid gap-0.5">
            {supportedLanguages.map((lang) => {
              const targetUrl = getEquivalentPath(pathname, lang.code);
              const isActive = currentLang.code === lang.code;

              return (
                <a
                  key={lang.code}
                  href={targetUrl}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-violet-50 font-bold text-violet-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  hrefLang={lang.code}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm leading-none">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </div>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
