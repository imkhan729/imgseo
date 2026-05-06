import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Does this tool upload my images anywhere?",
    a: "No. Every image is processed entirely inside your browser using the HTML5 Canvas API. They are never sent to any server, stored, or visible to anyone but you. When you close the tab, all data is gone.",
  },
  {
    q: "Is IMGSEO completely free?",
    a: "Yes — 100% free, forever. No account, no credit card, no hidden limits. IMGSEO is a public tool built to help local businesses compete on Google without paying for expensive SEO software.",
  },
  {
    q: "How does image SEO improve Google ranking?",
    a: "Google reads image file names, ALT text, and page content to understand what an image depicts. When these contain your target keyword and location, Google ranks your page higher for local searches. Fast-loading images (WebP compression) also improve Core Web Vitals — a direct ranking factor.",
  },
  {
    q: "What is geo tagging and how does it help local SEO?",
    a: "Geo tagging adds GPS coordinates to your image EXIF metadata. Google reads this location data as a local relevance signal. IMGSEO's Geo Tag tool embeds real GPS coordinates directly into your image JPEG in the browser — no ExifTool or third-party uploads required.",
  },
  {
    q: "Can I use this for Google Business Profile photos?",
    a: "Yes — IMGSEO is specifically designed for GBP. Rename your image with an SEO file name (keyword + city), compress to under 500KB, geo-tag with your business coordinates, and upload. The file name is the strongest keyword signal for GBP images since Google doesn't show ALT text there.",
  },
  {
    q: "What image formats does IMGSEO support?",
    a: "You can upload JPG, PNG, WebP, GIF, BMP, TIFF, AVIF, and HEIC. You can output to WebP (recommended), JPEG, or PNG. GPS EXIF embedding always outputs JPEG since that's the only format with native GPS EXIF support.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className={`card-3d rounded-2xl border bg-background overflow-hidden ${open ? "ring-1 ring-primary/20" : ""}`}
      data-testid={`faq-item-${index}`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">{q}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180 text-primary" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t pt-4 bg-muted/10">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to know about IMGSEO and image SEO.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} index={i} />)}
        </div>
      </div>
    </section>
  );
}
