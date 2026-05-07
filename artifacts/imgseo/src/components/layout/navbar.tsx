import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, ImageIcon, Menu, X } from "lucide-react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#features",     label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#faq",          label: "FAQ" },
  ];

  return (
    <>
      <div className={`fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-300 ${scrolled ? "pt-3 px-4" : "pt-0 px-0"}`}>
        <header
          className={`w-full transition-all duration-300 ${
            scrolled
              ? "glass max-w-5xl rounded-2xl shadow-lg"
              : "bg-transparent border-b border-transparent"
          }`}
        >
          <div className="flex h-16 items-center justify-between gap-4 px-5">

            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 shrink-0 group" data-testid="nav-logo">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/25 group-hover:shadow-violet-400/40 transition-shadow">
                <ImageIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "var(--app-font-display)" }}>
                IMG<span className="text-gradient">SEO</span>
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
              {links.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted/50 transition-all duration-150"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                data-testid="button-theme-toggle"
                className="h-9 w-9 inline-flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
                aria-label="Toggle theme"
              >
                {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <a
                href="#tool"
                data-testid="button-nav-cta"
                className="btn-3d shine hidden sm:inline-flex items-center gap-2 h-9 px-5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors"
              >
                Try Free
              </a>

              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/60 transition-all"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden border-t px-4 py-4 space-y-1 bg-background/95 backdrop-blur-md rounded-b-2xl">
              {links.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-sm font-semibold rounded-xl hover:bg-muted/60 transition-colors"
                >
                  {label}
                </a>
              ))}
              <a
                href="#tool"
                onClick={() => setMobileOpen(false)}
                className="block mt-2 px-4 py-3 text-sm font-bold text-center text-white rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600"
              >
                Try Free — No Account Needed
              </a>
            </div>
          )}
        </header>
      </div>
      {/* Spacer so content isn't hidden under fixed nav */}
      <div className="h-16" />
    </>
  );
}
