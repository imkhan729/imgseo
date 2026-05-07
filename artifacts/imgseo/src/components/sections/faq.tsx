import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const groups = [
  {
    label: "About IMGSEO",
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
    items: [
      {
        q: "How does image SEO improve Google ranking?",
        a: "Google reads image file names, ALT text, and page content to understand what an image depicts. When these contain your target keyword and location, Google ranks your page higher for local searches. Fast-loading images (WebP) also improve Core Web Vitals — a direct ranking factor.",
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
        a: "Use lossy compression at 70–85% quality and convert to WebP. IMGSEO processes images locally using the Canvas API — no upload required, zero privacy risk. A 2MB JPG typically becomes a 150–200KB WebP at the same perceived quality.",
      },
    ],
  },
  {
    label: "Google Business Profile",
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

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.04, 0.25) }}
      className="border-b border-border/60 last:border-0"
      data-testid={`faq-item-${index}`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className={`font-bold text-base leading-snug transition-colors duration-150 ${open ? "text-primary" : "group-hover:text-primary"}`}>
          {q}
        </span>
        <span className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-200 ${
          open
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        }`}>
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 pl-4 border-l-2 border-primary/30 ml-0.5">
              <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  let globalIndex = 0;

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">

        <div className="text-center mb-16">
          <p className="eyebrow mb-3">Got questions?</p>
          <h2 className="text-3xl font-black tracking-tight mb-4 md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to know about IMGSEO and image SEO for local business.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-x-16 gap-y-0 items-start">

          {/* Left column */}
          <div>
            {groups.slice(0, 2).map((group) => (
              <div key={group.label} className="mb-10">
                <p className="eyebrow mb-4 pb-3 border-b border-border/40">{group.label}</p>
                {group.items.map((item) => {
                  const idx = globalIndex++;
                  return <FAQItem key={item.q} q={item.q} a={item.a} index={idx} />;
                })}
              </div>
            ))}
          </div>

          {/* Right column */}
          <div>
            {groups.slice(2).map((group) => (
              <div key={group.label} className="mb-10">
                <p className="eyebrow mb-4 pb-3 border-b border-border/40">{group.label}</p>
                {group.items.map((item) => {
                  const idx = globalIndex++;
                  return <FAQItem key={item.q} q={item.q} a={item.a} index={idx} />;
                })}
              </div>
            ))}

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 rounded-3xl overflow-hidden bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-600 p-8 text-white"
            >
              <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Ready?</p>
              <h3 className="text-xl font-extrabold mb-2 leading-snug">Optimize your images for free — right now</h3>
              <p className="text-sm opacity-75 mb-6">No account needed. Results in 60 seconds.</p>
              <a
                href="#tool"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-violet-700 text-sm font-bold hover:bg-white/90 transition-colors shadow-lg"
              >
                Launch Free Tool →
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
