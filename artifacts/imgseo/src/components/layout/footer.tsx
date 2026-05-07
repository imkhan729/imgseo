import { ImageIcon, ShieldCheck } from "lucide-react";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-12 mb-10">

          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md">
                <ImageIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "var(--app-font-display)" }}>
                IMG<span className="text-gradient">SEO</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-5">
              The sharpest free image SEO tool for local businesses. Compress, convert, geo-tag, and optimize — entirely in your browser.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Zero uploads. 100% private.
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-sm font-bold mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                { href: "#tool",         label: "Image Optimizer" },
                { href: "#features",     label: "Features" },
                { href: "#how-it-works", label: "How It Works" },
                { href: "#faq",          label: "FAQ" },
              ].map(({ href, label }) => (
                <li key={label}>
                  <a href={href} className="hover:text-foreground transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-sm font-bold mb-4">Learn</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {[
                "Image File Names for Local SEO",
                "Google Business Profile Photos",
                "WebP vs JPG for Rankings",
                "Writing ALT Text",
              ].map((label) => (
                <li key={label}>
                  <a href="#" className="hover:text-foreground transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {year} IMGSEO. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
