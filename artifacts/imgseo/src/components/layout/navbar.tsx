import { useEffect, useRef, useState } from "react";
import { ChevronDown, ImageIcon, Menu, X } from "lucide-react";
import { toolPageList } from "@/lib/tool-pages";
import { LanguageSelector } from "./language-selector";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/blog", label: "Blog" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!toolsMenuRef.current?.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div className="sticky top-0 z-50 flex justify-center border-b border-slate-200 bg-white shadow-sm">
      <header className="w-full max-w-5xl bg-white">
        <div className="flex h-16 items-center justify-between gap-4 px-5">
          <a href="/" className="flex items-center gap-2.5 shrink-0 group" data-testid="nav-logo">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/25 transition-shadow group-hover:shadow-violet-400/40">
              <ImageIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "var(--app-font-display)" }}>
              IMG<span className="text-gradient">SEO</span>
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <a
              href="/"
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900"
            >
              Home
            </a>

            <div
              ref={toolsMenuRef}
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                onClick={() => setToolsOpen((value) => !value)}
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900"
                aria-expanded={toolsOpen}
                aria-haspopup="true"
              >
                Tools
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsOpen && (
                <div className="absolute left-0 top-full w-[360px] pt-2">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Free SEO Tools</p>
                    </div>
                    <div className="p-2 grid gap-1">
                      {toolPageList.map(({ path, navLabel, icon: Icon, description }) => (
                        <a
                          key={path}
                          href={path}
                          className="flex items-start gap-3 rounded-xl p-3 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="bg-slate-100 text-slate-500 p-2 rounded-lg group-hover:bg-[#4CA7D1]/10 group-hover:text-[#4CA7D1] transition-colors shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800 group-hover:text-[#4CA7D1] transition-colors">{navLabel}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2 pr-2">{description}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-slate-100 hover:text-slate-900"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSelector />

            <a
              href="/#tool"
              data-testid="button-nav-cta"
              className="btn-3d shine hidden sm:inline-flex items-center gap-2 h-9 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-sm font-bold text-white transition-colors hover:from-violet-500 hover:to-indigo-500"
            >
              Try Free
            </a>

            <button
              onClick={() => setMobileOpen((value) => !value)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted/60 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="space-y-1 rounded-b-2xl border-t bg-background/95 px-4 py-4 backdrop-blur-md md:hidden">
            <a
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted/60"
            >
              Home
            </a>

            <div className="rounded-2xl border border-border/60 bg-muted/20 p-1.5">
              <button
                onClick={() => setMobileToolsOpen((value) => !value)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold"
                aria-expanded={mobileToolsOpen}
              >
                <span>Tools</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileToolsOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileToolsOpen && (
                <div className="space-y-1 px-1 pb-1 mt-1">
                  {toolPageList.map(({ path, navLabel, icon: Icon }) => (
                    <a
                      key={path}
                      href={path}
                      onClick={() => {
                        setMobileToolsOpen(false);
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                    >
                      <Icon className="w-4 h-4 opacity-70" />
                      {navLabel}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted/60"
              >
                {label}
              </a>
            ))}

            <a
              href="/#tool"
              onClick={() => setMobileOpen(false)}
              className="mt-2 block rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-center text-sm font-bold text-white"
            >
              Try Free - No Account Needed
            </a>
          </div>
        )}
      </header>
    </div>
  );
}
