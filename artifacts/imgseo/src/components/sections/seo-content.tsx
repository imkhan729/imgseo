import { motion } from "framer-motion";
import { FileSearch, Gauge, MapPin, Image, ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: FileSearch,
    title: "SEO File Naming",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
    points: [
      "Use lowercase with hyphens, never spaces",
      'Format: keyword-city-business.webp',
      "Include your primary service keyword",
      "Add location — city and country/state",
    ],
    example: "best-plumber-doha-qatar.webp",
  },
  {
    icon: Image,
    title: "ALT Text & Compression",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    points: [
      "Describe image naturally — avoid keyword stuffing",
      "Always include service + location in ALT",
      "Target 70–85% quality for WebP/JPG",
      "WebP is 30–50% smaller than JPG",
    ],
    example: '"Professional plumber in Doha Qatar by QuickFix"',
  },
  {
    icon: Gauge,
    title: "Page Speed & Format",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
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
    title: "Geo Tagging",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    points: [
      "Embed GPS coordinates in image EXIF data",
      "Reinforces location relevance for local Google",
      "Use ExifTool or geoimgr.com to write EXIF",
      "Required before uploading to Google Business",
    ],
    example: "GPSLatitude: 25.285447, GPSLongitude: 51.531040",
  },
];

const faqs = [
  {
    q: "What is image SEO for local business?",
    a: "Image SEO for local business is the practice of optimizing images — file names, ALT text, size, format, and geo metadata — so they rank higher in Google Image Search and local results.",
  },
  {
    q: "How do I reduce image size without losing quality?",
    a: "Use lossy compression at 70–85% quality and convert to WebP. IMGSEO processes images locally in your browser using the Canvas API — no upload required, zero privacy risk.",
  },
  {
    q: "What file format is best for local SEO?",
    a: "WebP is Google's preferred format — up to 50% smaller than JPG with the same visual quality. Use JPG as a fallback for platforms that don't support WebP.",
  },
];

export function SEOContent() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Image SEO for Local Business
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A practical guide to optimizing images for Google ranking — file names, ALT text, compression, and geo tagging explained.
          </p>
        </div>

        {/* Pillar cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {pillars.map((p, idx) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-muted/30 border rounded-2xl p-5 flex flex-col gap-4"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${p.color}`}>
                <p.icon className="h-5 w-5" />
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
              <div className="bg-background border rounded-lg px-3 py-2 text-xs font-mono text-primary/80 break-all">
                {p.example}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Inline FAQ */}
        <div className="max-w-3xl mx-auto space-y-0 divide-y border rounded-2xl overflow-hidden bg-muted/20">
          <div className="px-6 py-4 bg-muted/40">
            <h3 className="font-bold text-base">Quick Answers</h3>
          </div>
          {faqs.map((faq) => (
            <div key={faq.q} className="px-6 py-5">
              <h4 className="font-semibold text-sm mb-1">{faq.q}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#tool"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md"
            data-testid="button-seo-cta"
          >
            Try the Free Image SEO Tool <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
