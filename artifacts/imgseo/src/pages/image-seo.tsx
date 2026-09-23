import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SeoHead } from "@/components/seo/seo-head";

const sourceLinks = [
  ["Google Search Central: Image SEO best practices", "https://developers.google.com/search/docs/appearance/google-images"],
  ["web.dev: Optimize images", "https://web.dev/learn/performance/image-performance"],
  ["MDN: img element", "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img"],
];

export default function ImageSeoPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Image SEO: A Practical Guide to Alt Text, File Size, and Formats",
    "description": "A practical, source-based guide to making website images easier to understand, crawl, and load.",
    "url": "https://imageseo.cc/image-seo",
    "author": { "@type": "Organization", "name": "IMGSEO" },
    "publisher": { "@type": "Organization", "name": "IMGSEO" },
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SeoHead title="Image SEO Guide: Alt Text, File Names & Performance | IMGSEO" description="Learn practical image SEO: write useful alt text, use descriptive filenames, serve efficient formats, and keep images crawlable and fast." path="/image-seo" schema={schema} />
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">Image SEO guide</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">Make images useful to people and search engines</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">Image SEO is the practice of giving images the right page context, descriptive alternative text, crawlable URLs, and an appropriate file size and format. The goal is useful, accessible content and a fast experience—not a collection of keyword-stuffed attributes.</p>

          <div className="mt-12 space-y-10">
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
              <h2 className="text-2xl font-black text-slate-900">1. Write alt text for the image’s purpose</h2>
              <p className="mt-4 leading-7 text-slate-600">Describe what matters in the image for someone who cannot see it. If an image is purely decorative, an empty alt attribute can be more appropriate than a forced description. Avoid repeating a target keyword when it does not describe the image.</p>
              <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"><strong>Example:</strong> <code>&lt;img src="doha-roof-repair.webp" alt="Technician repairing a flat roof in Doha" /&gt;</code></p>
            </section>
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
              <h2 className="text-2xl font-black text-slate-900">2. Use descriptive filenames and surrounding text</h2>
              <p className="mt-4 leading-7 text-slate-600">A filename such as <code>IMG_4821.jpg</code> provides little context. Use a short, descriptive filename that matches the real subject, then place the image near relevant page copy and a useful caption when a caption adds information.</p>
            </section>
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
              <h2 className="text-2xl font-black text-slate-900">3. Choose an efficient format and dimensions</h2>
              <p className="mt-4 leading-7 text-slate-600">Resize images to the largest display size you actually need, compress them with a quality setting appropriate to the content, and use a modern format when your browser and publishing stack support it. Keep transparency and fine text in mind when choosing between formats.</p>
              <div className="mt-5 flex flex-wrap gap-4">
                <a href="/free-online-image-compressor" className="font-bold text-violet-700 hover:underline">Compress images before publishing →</a>
                <a href="/free-webp-converter" className="font-bold text-violet-700 hover:underline">Convert images to WebP →</a>
              </div>
            </section>
            <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-10">
              <h2 className="text-2xl font-black text-slate-900">4. Keep important images discoverable</h2>
              <p className="mt-4 leading-7 text-slate-600">Use normal HTML image elements where an image carries meaning, make the page and image URL accessible to crawlers, and avoid relying on CSS backgrounds for index-worthy content. Add explicit dimensions or an appropriate aspect-ratio box to reduce layout movement.</p>
            </section>
          </div>

          <section className="mt-12 rounded-3xl border border-violet-200 bg-violet-50 p-7 md:p-10">
            <h2 className="text-2xl font-black text-slate-900">A simple publishing checklist</h2>
            <ul className="mt-5 grid gap-3 text-slate-700 md:grid-cols-2">
              {['The image has a clear purpose', 'Alt text is useful or intentionally empty', 'Filename describes the subject', 'Dimensions match the display need', 'Format and quality suit the content', 'The image sits near relevant copy'].map((item) => <li key={item} className="rounded-xl bg-white/70 p-3">✓ {item}</li>)}
            </ul>
          </section>

          <p className="mt-8 text-sm text-slate-600">Need location metadata? <a className="font-bold text-violet-700 hover:underline" href="/free-geo-tagger">Use the browser-based geo tagger →</a></p>

          <section className="mt-12">
            <h2 className="text-2xl font-black text-slate-900">Sources</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {sourceLinks.map(([label, href]) => <li key={href}><a className="text-violet-700 hover:underline" href={href} target="_blank" rel="noopener noreferrer">{label}</a></li>)}
            </ul>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
