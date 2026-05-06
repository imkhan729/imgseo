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
    const onScroll = () => setScrolled(window.scrollY > 12);
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
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "glass shadow-md"
            : "bg-background/80 backdrop-blur-sm border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0 group" data-testid="nav-logo">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-violet-400/40 transition-shadow">
              <ImageIcon className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--app-font-display)" }}>
              IMG<span className="text-gradient">SEO</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all duration-150 group"
              >
                {label}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-primary rounded-full group-hover:w-4 transition-all duration-200" />
              </a>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              data-testid="button-theme-toggle"
              className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-border/60 bg-background/60 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all duration-150"
              aria-label="Toggle theme"
            >
              {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <a
              href="#tool"
              data-testid="button-nav-cta"
              className="btn-3d shine hidden sm:inline-flex items-center gap-2 h-9 px-5 rounded-xl text-sm font-semibold text-white bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-500 hover:to-indigo-700 transition-colors"
            >
              Launch Tool
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-xl border border-border/60 bg-background/60 hover:bg-muted/80 text-muted-foreground transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden glass border-t px-4 py-4 space-y-1">
            {links.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium rounded-xl hover:bg-muted/60 transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="#tool"
              onClick={() => setMobileOpen(false)}
              className="block mt-2 px-4 py-2.5 text-sm font-semibold text-center text-white rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600"
            >
              Launch Tool
            </a>
          </div>
        )}
      </header>
    </>
  );
}
