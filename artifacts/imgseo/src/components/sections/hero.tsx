import { ArrowRight, Globe, Lock, Sparkles, Zap, ShieldCheck, Cpu } from "lucide-react";

const metrics = [
  { value: "100%", label: "Free Forever", sub: "No account required" },
  { value: "0", label: "Server Uploads", sub: "100% private in browser" },
  { value: "10+", label: "Supported Formats", sub: "WebP, JPG, PNG, AVIF, SVG" },
  { value: "⚡ Instant", label: "Client-Side Speed", sub: "Zero cloud queue delay" },
];

const trustPills = [
  { icon: ShieldCheck, label: "Zero Server Uploads" },
  { icon: Zap, label: "No File Limits" },
  { icon: Globe, label: "Runs 100% In Browser" },
  { icon: Lock, label: "Client-Side Privacy" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-bg pb-24 pt-12 lg:pt-20">
      {/* Background Ambience & Dot Mesh */}
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.14),rgba(255,255,255,0))]" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb-float absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="orb-float-delay absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        
        {/* Eyebrow Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 shadow-sm backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>100% Free · No Login · Zero Server Uploads</span>
        </div>

        {/* Hero Title with Balanced Gradient Typography */}
        <h1 className="mx-auto mb-6 max-w-5xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground text-balance">
          Optimize Images for <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400">Local SEO & Speed</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mx-auto mb-10 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground font-medium">
          Batch compress, convert to next-gen WebP, embed EXIF GPS coordinates, and generate SEO file names directly in your browser.{" "}
          <strong className="font-bold text-foreground">Your original photos never leave your device.</strong>
        </p>

        {/* Primary & Secondary Call to Actions */}
        <div className="mb-14 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
          <a
            href="#tool"
            data-testid="button-hero-cta"
            className="btn-3d shine inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-9 text-base font-extrabold text-white shadow-xl shadow-indigo-500/25 hover:from-blue-500 hover:to-violet-500 transition-all sm:w-auto"
          >
            <Zap className="h-5 w-5" />
            Start Optimizing Free
            <ArrowRight className="h-4 w-4 opacity-80" />
          </a>
          
          <a
            href="#how-it-works"
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-border/80 bg-background/90 px-8 text-base font-bold text-foreground shadow-sm hover:border-primary/40 hover:bg-muted/30 backdrop-blur-sm transition-all sm:w-auto"
          >
            See How It Works
          </a>
        </div>

        {/* Modern Metrics Grid Cards */}
        <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {metrics.map(({ value, label, sub }) => (
            <div key={label} className="card-3d rounded-2xl border border-border/70 bg-card/70 backdrop-blur-sm p-4 text-center shadow-sm">
              <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
                {value}
              </p>
              <p className="text-xs font-extrabold text-foreground mt-1">{label}</p>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Trust Badges Strip */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2.5 pt-2 border-t border-border/40 max-w-3xl mx-auto">
          {trustPills.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>{label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
