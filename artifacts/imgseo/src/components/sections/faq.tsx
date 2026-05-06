import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Does this tool upload my images?",
    a: "No. Your images are processed entirely inside your browser using the HTML5 Canvas API. They are never sent to any server, stored anywhere, or visible to anyone but you. When you close the tab, all data is gone.",
  },
  {
    q: "Is this tool free?",
    a: "Yes — completely free, forever. No account required, no credit card, no hidden limits. IMGSEO is a public tool built to help local businesses compete on Google without paying for expensive SEO software.",
  },
  {
    q: "How does image SEO help Google ranking?",
    a: "Google reads your image file names, ALT text, and surrounding page copy to understand what an image depicts. When those contain your target keyword and location, Google ranks your page higher for relevant local searches. Fast-loading images (achieved through compression) also improve Core Web Vitals, a direct ranking factor.",
  },
  {
    q: "What is geo tagging and how does it help?",
    a: "Geo tagging adds GPS coordinates to your image metadata (EXIF data). Google can read this location data and use it as a relevance signal for local searches. Since browsers cannot write EXIF data directly, IMGSEO provides a geo tag helper that generates the metadata text you can add using tools like ExifTool or your CMS before uploading to Google Business Profile.",
  },
  {
    q: "Can I use this for Google Business Profile?",
    a: "Yes — IMGSEO is specifically designed with Google Business Profile in mind. Before uploading any photo to GBP, run it through IMGSEO to compress it, convert to WebP or JPG, and apply an SEO-optimized file name. The file name is the strongest keyword signal for GBP images since Google doesn't display ALT text there.",
  },
  {
    q: "What image formats does IMGSEO support?",
    a: "You can upload JPG, PNG, and WebP images. You can convert them to WebP (recommended for best compression), JPG (widest compatibility), or PNG (for images that need transparency).",
  },
];

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

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="border rounded-xl px-5 shadow-sm bg-muted/20"
                data-testid={`faq-item-${idx}`}
              >
                <AccordionTrigger className="text-left font-semibold py-5 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
