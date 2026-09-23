import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SeoHead } from "@/components/seo/seo-head";
import { TargetSizeCompressor } from "@/components/tool/target-size-compressor";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sliders, ShieldCheck, Zap, FileCheck } from "lucide-react";

const faqItems = [
  {
    question: "How does the target-size compressor reach an exact KB limit (20KB, 50KB, 100KB, 200KB)?",
    answer: "Our tool executes an iterative binary-search optimization algorithm in your browser memory. It automatically calculates the optimal compression ratio and canvas resolution to guarantee your final file is strictly at or below your target KB limit without unnecessary degradation."
  },
  {
    question: "Are my confidential photos or passport scans uploaded to an external server?",
    answer: "No. All compression, analysis, and downloads execute 100% locally inside your browser memory using HTML5 Canvas. Your sensitive identity files, visa scans, and personal documents never leave your computer."
  },
  {
    question: "Which image formats are supported for exact KB compression?",
    answer: "You can upload JPEG, JPG, PNG, and WebP images and export them as either universally accepted JPEG files or lightweight modern WebP files."
  },
  {
    question: "Can I compress multiple images to the same KB target at once and download a ZIP?",
    answer: "Yes. You can drag and drop dozens of images, select your preset target limit (e.g. 50KB or 100KB), and download them individually or as a single batch ZIP archive."
  },
  {
    question: "Why do government job portals and visa applications enforce strict KB limits?",
    answer: "Government portals and application forms handle millions of submissions and strictly cap file sizes (such as 20KB for signatures or 50KB for passport photos) to prevent database overload and ensure fast document validation."
  },
  {
    question: "How does compressing images below 100KB boost SEO and Core Web Vitals?",
    answer: "Serving images under 100KB dramatically reduces mobile data transfer, speeds up Largest Contentful Paint (LCP), and prevents Cumulative Layout Shift (CLS), improving Google search rankings."
  }
];

export default function TargetSizePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Compress Image to KB (20KB, 50KB, 100KB, 200KB)",
    "url": "https://imageseo.cc/compress-image-to-kb",
    "description": "Compress images to exact target file sizes (20KB, 50KB, 100KB, 200KB) online in your browser. 100% private, free batch processing with zero uploads.",
    "applicationCategory": "UtilitiesApplication, SEOApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "USD" }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SeoHead
        title="Compress Image to 20KB, 50KB, 100KB, 200KB Online | IMGSEO"
        description="Compress JPG, PNG, and WebP images to exact target sizes (20KB, 50KB, 100KB, 200KB) in your browser. Free batch compression with zero uploads."
        path="/compress-image-to-kb"
        schema={schema}
      />
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden px-4 pb-24 pt-12 md:pt-16 bg-[linear-gradient(180deg,#F5F7FF,rgba(255,255,255,0.98))] dark:bg-[linear-gradient(180deg,rgba(17,24,39,0.8),rgba(2,6,23,0.98))]">
          <div className="container relative mx-auto max-w-6xl space-y-12">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-300">
                <Sliders className="h-3.5 w-3.5" />
                Target Size Optimizer
              </div>
              <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-6xl">
                Compress Image to Exact KB Online
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-400 md:text-lg">
                Easily reduce photo size to 20KB, 50KB, 100KB, or 200KB for government portals, job applications, visa submissions, and high-speed web publishing.
              </p>
            </div>

            <TargetSizeCompressor />

            {/* Educational / Intent-Rich Section */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center dark:bg-indigo-950/40">
                  <FileCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Strict Size Requirements</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Ideal for government forms, passport portals, and university applications that enforce strict maximum upload limits like 50KB or 100KB.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center dark:bg-indigo-950/40">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">100% Private Processing</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Your ID photos, documents, and personal images stay on your device. All calculations run in your browser sandbox without server uploads.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center dark:bg-indigo-950/40">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Batch & ZIP Downloads</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Compress multiple files simultaneously with individual size tracking and export all results in a single organized ZIP archive.
                </p>
              </div>
            </div>

            {/* FAQ Accordion */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">FAQ</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Questions About Target Size Compression</h2>
              <Accordion type="single" collapsible className="mt-6">
                {faqItems.map((item, index) => (
                  <AccordionItem key={item.question} value={`faq-${index}`} className="border-slate-100 dark:border-slate-900">
                    <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline dark:text-white">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
