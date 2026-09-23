import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const faqs = [
  {
    category: "About IMGSEO",
    q: "Does this tool upload my images anywhere?",
    a: "No. Every image is processed entirely inside your browser using the HTML5 Canvas API. They are never sent to any server, stored, or visible to anyone but you. When you close the tab, all data is gone.",
  },
  {
    category: "About IMGSEO",
    q: "Is IMGSEO completely free?",
    a: "Yes — 100% free, forever. No account, no credit card, no hidden limits. IMGSEO is a public tool built to help local businesses compete on Google without paying for expensive SEO software.",
  },
  {
    category: "About IMGSEO",
    q: "What image formats does IMGSEO support?",
    a: "You can upload JPG, PNG, WebP, GIF, BMP, TIFF, AVIF, and HEIC. Output formats are WebP (recommended), JPEG, or PNG. GPS EXIF embedding always outputs JPEG since that's the only format with native GPS EXIF support.",
  },
  {
    category: "Image SEO",
    q: "How does image SEO improve Google ranking?",
    a: "Google reads image file names, ALT text, and page content to understand what an image depicts. When these contain your target keyword and location, Google ranks your page higher for local searches. Fast-loading images (WebP) also improve Core Web Vitals — a direct ranking factor.",
  },
  {
    category: "Image SEO",
    q: "What is image SEO for local business?",
    a: "Image SEO for local business is the practice of optimising images — file names, ALT text, size, format, and geo metadata — so they rank higher in Google Image Search and local results. Every image on your site is an opportunity to tell Google what service you offer and where.",
  },
  {
    category: "Image SEO",
    q: "What file format is best for local SEO?",
    a: "WebP is Google's preferred format — up to 50% smaller than JPG with the same visual quality. Use JPG as a fallback for platforms that don't support WebP, such as Google Business Profile.",
  },
  {
    category: "Image SEO",
    q: "How do I reduce image size without losing quality?",
    a: "Use lossy compression at 70–85% quality and convert to WebP. IMGSEO processes images locally using the Canvas API — no upload required, zero privacy risk. A 2MB JPG typically becomes a 150–200KB WebP at the same perceived quality.",
  },
  {
    category: "Google Business Profile",
    q: "Can I use this for Google Business Profile photos?",
    a: "Yes — IMGSEO is specifically designed for GBP. Before uploading any photo, run it through IMGSEO to compress it, convert to JPEG, and apply an SEO-optimised file name. The file name is the strongest keyword signal for GBP images since Google doesn't display ALT text there.",
  },
  {
    category: "Google Business Profile",
    q: "What is geo tagging and how does it help local SEO?",
    a: "Geo tagging adds GPS coordinates to your image EXIF metadata. Google reads this location data as a local relevance signal. IMGSEO's Geo Tag tool embeds real GPS coordinates directly into your image JPEG in the browser — no ExifTool or third-party tools required.",
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/50 last:border-0" data-testid={`faq-item-${index}`}>
      <button
        onClick={() => setOpen((value) => !value)}
        className="group flex w-full items-center justify-between gap-5 py-5 text-left"
        aria-expanded={open}
      >
        <span className={`text-base font-bold leading-snug transition-colors duration-150 ${open ? "text-primary" : "group-hover:text-primary"}`}>
          {q}
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
            open
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          }`}
        >
          {open ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </span>
      </button>
      {open && (
        <div className="overflow-hidden">
          <div className="border-l-2 border-primary/30 pb-5 pl-4">
            <p className="text-sm leading-relaxed text-muted-foreground">{a}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <p className="eyebrow mb-3">Got questions?</p>
          <h2 className="mb-4 text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Everything you need to know about IMGSEO and image SEO for local business.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          {faqs.map((faq, index) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} index={index} />
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-xl overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-600 p-8 text-center text-white">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest opacity-70">Ready to start?</p>
          <h3 className="mb-2 text-2xl font-extrabold">Optimize your images for free</h3>
          <p className="mb-6 text-sm opacity-75">No account. No upload. 60 seconds.</p>
          <a
            href="#tool"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-violet-700 shadow-lg transition-colors hover:bg-white/90"
          >
            Launch Free Tool →
          </a>
        </div>
      </div>
    </section>
  );
}
