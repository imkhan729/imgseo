import { motion } from "framer-motion";
import { FileSearch, Gauge, MapPin, Image, ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: FileSearch,
    gradient: "from-violet-500 to-indigo-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200/60 dark:border-violet-800/40",
    title: "SEO File Naming",
    points: [
      "Use lowercase with hyphens, never spaces",
      "Format: keyword-city-business.webp",
      "Include your primary service keyword first",
      "Add location — city and country/state",
    ],
    example: "best-plumber-doha-qatar.webp",
  },
  {
    icon: Image,
    gradient: "from-blue-500 to-cyan-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200/60 dark:border-blue-800/40",
    title: "ALT Text & Compression",
    points: [
      "Describe image naturally — no keyword stuffing",
      "Always include service + location in ALT",
      "Target 70–85% quality for WebP/JPG",
      "WebP is 30–50% smaller than JPG",
    ],
    example: '"Professional plumber in Doha Qatar by QuickFix"',
  },
  {
    icon: Gauge,
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200/60 dark:border-emerald-800/40",
    title: "Page Speed & Format",
    points: [
      "Core Web Vitals directly affect local ranking",
      "Convert JPG/PNG to WebP before publishing",
      "Keep images under 150KB for web pages",
      "Use 720×720px for Google Business Profile",
    ],
    example: "2MB JPG → 180KB WebP (same quality)",
  },
  {
    icon: MapPin,
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200/60 dark:border-amber-800/40",
    title: "Geo Tagging",
    points: [
      "Embed GPS coordinates in image EXIF data",
      "Reinforces location relevance for local Google",
      "IMGSEO embeds EXIF directly in your browser",
      "Upload geo-tagged images to Google Business",
    ],
    example: "GPSLatitude: 25.285447, GPSLong: 51.531040",
  },
];

export function SEOContent() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Image SEO for Local Business
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A practical guide to optimizing images for Google ranking — file names, ALT text, compression, and geo tagging explained.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {pillars.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`card-3d ${p.bg} ${p.border} border rounded-2xl p-5 flex flex-col gap-4`}
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${p.gradient} shadow-md`}>
                <p.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-base">{p.title}</h3>
              <ul className="space-y-1.5 flex-1">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary/50" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="bg-background/70 border rounded-lg px-3 py-2 text-xs font-mono text-primary/80 break-all">
                {p.example}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#tool"
            className="btn-3d shine inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-500 hover:to-indigo-700 transition-colors shadow-lg shadow-violet-500/20"
            data-testid="button-seo-cta"
          >
            Try the Free Image SEO Tool <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
