import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Lock, Globe, Sparkles, ImageIcon, MapPin, Tag } from "lucide-react";

const floatingCards = [
  { icon: ImageIcon, label: "WebP Conversion",  color: "from-violet-500 to-indigo-600", delay: 0,    x: "-left-2 md:-left-16 lg:-left-28", y: "top-12" },
  { icon: MapPin,    label: "Geo Tagging",       color: "from-rose-500 to-pink-600",    delay: 0.25, x: "-right-2 md:-right-16 lg:-right-28", y: "top-24" },
  { icon: Tag,       label: "SEO File Names",    color: "from-emerald-500 to-teal-600", delay: 0.5,  x: "-left-2 md:-left-16 lg:-left-28", y: "bottom-20" },
  { icon: Shield,    label: "100% Private",      color: "from-amber-500 to-orange-500", delay: 0.75, x: "-right-2 md:-right-16 lg:-right-28", y: "bottom-12" },
];

const stats = [
  { icon: Lock,   label: "No Upload Required" },
  { icon: Zap,    label: "100% Free" },
  { icon: Globe,  label: "Runs In Your Browser" },
  { icon: Shield, label: "Private & Secure" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden py-28 lg:py-36 hero-bg">

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="orb-float absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="orb-float-delay absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-violet-300/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="relative max-w-3xl mx-auto text-center">

          {/* Floating feature cards */}
          {floatingCards.map(({ icon: Icon, label, color, delay, x, y }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + delay, duration: 0.45, type: "spring", stiffness: 200 }}
              className={`hidden lg:flex absolute ${x} ${y} items-center gap-2 px-3 py-2 rounded-xl glass card-3d border border-border/60 shadow-lg text-xs font-semibold whitespace-nowrap`}
            >
              <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
              {label}
            </motion.div>
          ))}

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-300/50 bg-violet-50/80 dark:bg-violet-950/40 dark:border-violet-700/40 text-xs font-semibold text-violet-700 dark:text-violet-300 mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Free Image SEO Tool — No Account Required
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
          >
            Optimize Images{" "}
            <span className="text-gradient">for Local SEO</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10"
          >
            Compress, convert, geo-tag, and generate SEO-ready images directly in your browser.{" "}
            <span className="font-semibold text-foreground">Your images never leave your device.</span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <a
              href="#tool"
              data-testid="button-hero-cta"
              className="btn-3d shine inline-flex items-center gap-2.5 h-14 px-8 rounded-2xl text-base font-bold text-white bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-700 hover:from-violet-500 hover:to-indigo-800 transition-colors shadow-xl shadow-violet-500/25 w-full sm:w-auto justify-center"
            >
              <Zap className="h-5 w-5" />
              Optimize Images Free
              <ArrowRight className="h-4 w-4 ml-1 opacity-80" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 h-14 px-8 rounded-2xl text-base font-semibold border border-border hover:bg-muted/60 transition-all w-full sm:w-auto justify-center"
            >
              See how it works
            </a>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-14"
          >
            {stats.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </div>
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
