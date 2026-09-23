import { ArrowRight, Globe, Lock, Sparkles, Zap } from "lucide-react";

const metrics = [
  { value: "100%", label: "Free forever" },
  { value: "0", label: "Server uploads" },
  { value: "8+", label: "Image formats" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-bg pb-28 pt-12 lg:pt-16">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-60" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb-float absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-400/8 blur-3xl" />
        <div className="orb-float-delay absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-400/8 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-300/60 bg-violet-50/90 px-4 py-1.5 text-xs font-bold text-violet-700 dark:border-violet-700/50 dark:bg-violet-950/50 dark:text-violet-300">
          <Sparkles className="h-3.5 w-3.5" />
          Free · No Account · No Upload
        </div>

        <h1 className="mx-auto mb-6 max-w-4xl text-5xl font-black leading-[1.06] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl">
          Optimize Images <span className="text-gradient">for Local SEO</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Compress, convert, geo-tag, and generate SEO file names — all in your browser.{" "}
          <strong className="font-semibold text-foreground">Your images never leave your device.</strong>
        </p>

        <div className="mb-16 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#tool"
            data-testid="button-hero-cta"
            className="btn-3d shine inline-flex h-13 w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 px-8 text-base font-bold text-white transition-colors hover:from-violet-500 hover:to-indigo-500 sm:w-auto"
          >
            <Zap className="h-4.5 w-4.5" />
            Optimize Images Free
            <ArrowRight className="h-4 w-4 opacity-80" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full border-2 border-border px-8 text-base font-semibold transition-all hover:border-border/80 hover:bg-muted/40 sm:w-auto"
          >
            See how it works
          </a>
        </div>

        <div className="mb-16 flex flex-wrap items-center justify-center gap-12">
          {metrics.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="mb-0.5 text-3xl font-black text-gradient">{value}</p>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { icon: Lock, label: "No Upload Required" },
            { icon: Zap, label: "100% Free" },
            { icon: Globe, label: "Runs In Your Browser" },
            { icon: Lock, label: "Private & Secure" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-primary/60" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
