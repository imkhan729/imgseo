import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ImageIcon, Search } from "lucide-react";

const groups = [
  {
    label: "About IMGSEO",
    icon: HelpCircle,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    items: [
      {
        q: "Does this tool upload my images anywhere?",
        a: "No. Every image is processed entirely inside your browser using the HTML5 Canvas API. They are never sent to any server, stored, or visible to anyone but you. When you close the tab, all data is gone.",
      },
      {
        q: "Is IMGSEO completely free?",
        a: "Yes — 100% free, forever. No account, no credit card, no hidden limits. IMGSEO is a public tool built to help local businesses compete on Google without paying for expensive SEO software.",
      },
      {
        q: "What image formats does IMGSEO support?",
        a: "You can upload JPG, PNG, WebP, GIF, BMP, TIFF, AVIF, and HEIC. You can output to WebP (recommended), JPEG, or PNG. GPS EXIF embedding always outputs JPEG since that's the only format with native GPS EXIF support.",
      },
    ],
  },
  {
    label: "Image SEO",
    icon: Search,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    items: [
      {
        q: "How does image SEO improve Google ranking?",
        a: "Google reads image file names, ALT text, and page content to understand what an image depicts. When these contain your target keyword and location, Google ranks your page higher for local searches. Fast-loading images (WebP compression) also improve Core Web Vitals — a direct ranking factor.",
      },
      {
        q: "What is image SEO for local business?",
        a: "Image SEO for local business is the practice of optimizing images — file names, ALT text, size, format, and geo metadata — so they rank higher in Google Image Search and local results. Every image on your site is an opportunity to tell Google what service you offer and where.",
      },
      {
        q: "What file format is best for local SEO?",
        a: "WebP is Google's preferred format — up to 50% smaller than JPG with the same visual quality. Use JPG as a fallback for platforms that don't support WebP, such as older CMS versions.",
      },
      {
        q: "How do I reduce image size without losing quality?",
        a: "Use lossy compression at 70–85% quality and convert to WebP. IMGSEO processes images locally in your browser using the Canvas API — no upload required, zero privacy risk. A 2MB JPG typically becomes a 150–200KB WebP at the same perceived quality.",
      },
    ],
  },
  {
    label: "Google Business Profile",
    icon: ImageIcon,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    items: [
      {
        q: "Can I use this for Google Business Profile photos?",
        a: "Yes — IMGSEO is specifically designed for GBP. Before uploading any photo, run it through IMGSEO to compress it, convert to WebP or JPG, and apply an SEO-optimized file name. The file name is the strongest keyword signal for GBP images since Google doesn't display ALT text there.",
      },
      {
        q: "What is geo tagging and how does it help local SEO?",
        a: "Geo tagging adds GPS coordinates to your image EXIF metadata. Google reads this location data as a local relevance signal. IMGSEO's Geo Tag tool embeds real GPS coordinates directly into your image JPEG in the browser — no ExifTool or third-party tools required.",
      },
    ],
  },
];

function FAQItem({ q, a, globalIndex }: { q: string; a: string; globalIndex: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(globalIndex * 0.05, 0.3) }}
      className={`overflow-hidden rounded-xl border bg-background transition-all duration-200 ${open ? "ring-1 ring-primary/20 shadow-md" : "hover:shadow-sm"}`}
      data-testid={`faq-item-${globalIndex}`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between px-5 py-4 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className={`font-semibold text-sm leading-snug transition-colors ${open ? "text-primary" : "group-hover:text-primary"}`}>{q}</span>
        <ChevronDown className={`h-4 w-4 mt-0.5 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180 text-primary" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t pt-3.5 bg-muted/10">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  let globalIndex = 0;

  return (
    <section id="faq" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to know about IMGSEO and image SEO for local business.
          </p>
        </div>

        {/* Two-column grouped layout */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 items-start">

          {/* Left column: first two groups */}
          <div className="space-y-8">
            {groups.slice(0, 2).map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.label}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${group.bg} mb-4`}>
                    <Icon className={`h-3.5 w-3.5 ${group.color}`} />
                    <span className={`text-xs font-bold uppercase tracking-widest ${group.color}`}>{group.label}</span>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const idx = globalIndex++;
                      return <FAQItem key={item.q} q={item.q} a={item.a} globalIndex={idx} />;
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right column: last group + CTA card */}
          <div className="space-y-8">
            {groups.slice(2).map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.label}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${group.bg} mb-4`}>
                    <Icon className={`h-3.5 w-3.5 ${group.color}`} />
                    <span className={`text-xs font-bold uppercase tracking-widest ${group.color}`}>{group.label}</span>
                  </div>
                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const idx = globalIndex++;
                      return <FAQItem key={item.q} q={item.q} a={item.a} globalIndex={idx} />;
                    })}
                  </div>
                </div>
              );
            })}

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-3d rounded-2xl overflow-hidden border"
            >
              <div className="bg-gradient-to-br from-violet-500 to-indigo-600 px-6 py-8 text-white">
                <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">Ready to start?</p>
                <h3 className="text-xl font-extrabold mb-2 leading-snug">Optimize your images for free — right now</h3>
                <p className="text-sm opacity-80 mb-5">No account. No upload. Results in 60 seconds.</p>
                <a
                  href="#tool"
                  className="btn-3d inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-violet-700 text-sm font-bold hover:bg-white/90 transition-colors"
                >
                  Launch Free Tool →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
