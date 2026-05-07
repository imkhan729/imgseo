import { motion } from "framer-motion";
import { ArrowRight, Lock, Zap, Globe, Sparkles } from "lucide-react";

const metrics = [
  { value: "100%", label: "Free forever" },
  { value: "0",    label: "Server uploads" },
  { value: "8+",   label: "Image formats" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-bg pb-28 pt-12 lg:pt-16">

      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-60" />

      {/* Gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb-float absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-400/8 blur-3xl" />
        <div className="orb-float-delay absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-400/8 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-violet-300/60 bg-violet-50/90 dark:bg-violet-950/50 dark:border-violet-700/50 text-xs font-bold text-violet-700 dark:text-violet-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Free · No Account · No Upload
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mx-auto max-w-4xl text-5xl font-black leading-[1.06] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl mb-6"
        >
          Optimize Images{" "}
          <span className="text-gradient">for Local SEO</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed mb-10 md:text-xl"
        >
          Compress, convert, geo-tag, and generate SEO file names — all in your browser.{" "}
          <strong className="text-foreground font-semibold">Your images never leave your device.</strong>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <a
            href="#tool"
            data-testid="button-hero-cta"
            className="btn-3d shine inline-flex items-center gap-2.5 h-13 px-8 rounded-full text-base font-bold text-white bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors w-full sm:w-auto justify-center"
          >
            <Zap className="h-4.5 w-4.5" />
            Optimize Images Free
            <ArrowRight className="h-4 w-4 opacity-80" />
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 h-13 px-8 rounded-full text-base font-semibold border-2 border-border hover:border-border/80 hover:bg-muted/40 transition-all w-full sm:w-auto justify-center"
          >
            See how it works
          </a>
        </motion.div>

        {/* Metric strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-12 mb-16"
        >
          {metrics.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-black text-gradient mb-0.5">{value}</p>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2"
        >
          {[
            { icon: Lock,  label: "No Upload Required" },
            { icon: Zap,   label: "100% Free" },
            { icon: Globe, label: "Runs In Your Browser" },
            { icon: Lock,  label: "Private & Secure" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Icon className="h-3.5 w-3.5 text-primary/60" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
