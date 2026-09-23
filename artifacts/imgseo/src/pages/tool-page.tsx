import { useState, useRef } from "react";
import { ArrowRight, CheckCircle2, Compass, FileArchive, MapPinned, Sparkles, type LucideIcon } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SeoHead } from "@/components/seo/seo-head";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SimpleGeoTagger } from "@/components/tool/simple-geo-tagger";
import { SimpleImageCompressor } from "@/components/tool/simple-image-compressor";
import { SimpleFormatConverter, type OutputFormat, type SimpleFormatConverterRef } from "@/components/tool/simple-format-converter";
import { ToolSection } from "@/components/tool/tool-section";
import { type ToolPageConfig } from "@/lib/tool-pages";

const webpSourceFormats = ["AVIF", "BMP", "GIF", "HEIC", "ICO", "JPEG", "JPG", "PNG", "SVG", "TIFF"];
const webpTargetFormats = ["JPG", "PNG"];

function PageShell({
  title,
  description,
  path,
  accent,
  schema,
  children,
}: {
  title: string;
  description: string;
  path: string;
  accent: string;
  schema?: Record<string, any> | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SeoHead title={title} description={description} path={path} schema={schema} />
      <Navbar />
      <main className="flex-1">
        <section className={`relative overflow-hidden px-4 pb-24 pt-12 md:pt-16 ${accent}`}>
          <div className="container relative mx-auto max-w-6xl">
            <div className="space-y-8">{children}</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function HeroIntro({
  icon: Icon,
  badge,
  title,
  body,
  badgeClass,
}: {
  icon?: LucideIcon;
  badge: string;
  title: string;
  body: string;
  badgeClass?: string;
}) {
  const IconComponent = Icon || Sparkles;
  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${badgeClass || "border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"}`}>
        <IconComponent className="h-4 w-4" />
        {badge}
      </div>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white md:text-6xl">{title}</h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">{body}</p>
    </div>
  );
}

function RichCard({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string | React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-10">
      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">{title}</h2>
      <div className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">{body}</div>
      {children ? <div className="mt-8">{children}</div> : null}
    </article>
  );
}

function BulletRows({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-900 dark:text-white" />
          <p className="text-slate-700 dark:text-slate-300">{item}</p>
        </div>
      ))}
    </div>
  );
}

function StatsRow({ stats }: { stats?: { label: string; value: string }[] }) {
  if (!stats || stats.length === 0) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-1 border-l-2 border-slate-200 pl-4 dark:border-slate-800">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function HowToCards({ steps }: { steps?: { title: string; body: string }[] }) {
  if (!steps || steps.length === 0) return null;
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-10">
      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Guide</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">Step-by-Step Instructions</h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((step, idx) => (
          <div key={step.title} className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white mb-3">
              {idx + 1}
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{step.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.body}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function SectionCards({ config }: { config: ToolPageConfig }) {
  if (!config.sections || config.sections.length === 0) return null;
  return (
    <div className="space-y-6" id="tool-guide">
      {config.sections.map((section) => {
        const SectionIcon = section.icon || Sparkles;
        return (
          <article key={section.id} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-10">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900">
              <SectionIcon className="h-6 w-6 text-slate-900 dark:text-white" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{section.title}</h3>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">{section.body}</p>
            <div className="mt-6 space-y-3">
              {(section.points || []).map((point) => (
                <div key={point} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  {point}
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function FAQCard({
  title,
  items,
  rawFaqs,
}: {
  title: string;
  items?: { question: string; answer: string }[];
  rawFaqs?: { q: string; a: string }[];
}) {
  const normalizedItems = (items || []).map((i) => ({ q: i.question, a: i.answer })).concat(rawFaqs || []);
  if (normalizedItems.length === 0) return null;
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:p-10">
      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">FAQ</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">{title}</h2>
      <Accordion type="single" collapsible className="mt-8">
        {normalizedItems.map((item, index) => (
          <AccordionItem key={item.q} value={`faq-${index}`} className="border-slate-200 dark:border-slate-800">
            <AccordionTrigger className="text-left text-lg font-medium hover:no-underline">{item.q}</AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed text-slate-600 dark:text-slate-400">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </article>
  );
}

function CTAAnchor({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-foreground">
      {label}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

function FileBadgeIcon({ text, exportArrow, importArrow }: { text: string; exportArrow?: boolean; importArrow?: boolean }) {
  return (
    <div className="relative shrink-0 flex items-center justify-center">
      <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.5 2H4.5C3.11929 2 2 3.11929 2 4.5V23.5C2 24.8807 3.11929 26 4.5 26H19.5C20.8807 26 22 24.8807 22 23.5V8.5L15.5 2Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 2V8.5H21.5" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="absolute top-[14px] left-1/2 -translate-x-1/2 bg-slate-500 rounded border border-white px-[3px] py-[1px] text-[7px] font-black text-white uppercase tracking-wider shadow-sm z-10">
        {text}
      </div>
      {exportArrow && (
        <svg className="absolute -top-1 -right-2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H10M17 7V14" />
        </svg>
      )}
      {importArrow && (
        <svg className="absolute top-1 -left-2 w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 7L7 17M7 17H14M7 17V10" />
        </svg>
      )}
    </div>
  );
}

function FormatChip({
  label,
  active = false,
  onClick,
  sourceExt,
  targetExt,
  isExport = false
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  sourceExt: string;
  targetExt?: string;
  isExport?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all bg-white shadow-sm hover:border-blue-400 hover:shadow-md w-full dark:bg-slate-900 ${
        active
          ? "border-blue-500 bg-blue-50/90 text-blue-950 ring-2 ring-blue-500/30 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-400"
          : "border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40"
      }`}
    >
      {isExport ? (
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-2.5">
            <FileBadgeIcon text={sourceExt} exportArrow />
            <span className="text-[14px] font-bold">{label}</span>
          </div>
          <FileBadgeIcon text={targetExt!} />
        </div>
      ) : (
        <div className="flex items-center gap-2.5 w-full">
          <FileBadgeIcon text={sourceExt} />
          <span className="text-[14px] font-bold">{label}</span>
        </div>
      )}
    </button>
  );
}

function WebpConverterPage({ config }: { config: ToolPageConfig }) {
  const converterRef = useRef<SimpleFormatConverterRef>(null);
  const [selectedSource, setSelectedSource] = useState<string>("JPG");
  const [selectedTarget, setSelectedTarget] = useState<string>("WEBP");
  const [selectedTargetFormat, setSelectedTargetFormat] = useState<OutputFormat>("image/webp");

  const handleSelectConversion = (source: string, target: string, format: OutputFormat) => {
    setSelectedSource(source);
    setSelectedTarget(target);
    setSelectedTargetFormat(format);
    
    // Update the hero converter mode
    converterRef.current?.setMode(source, target, format);
    
    // Smoothly scroll to tool section
    const el = document.getElementById("tool");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    
    // Promptly open the file picker so user can pick files immediately
    setTimeout(() => {
      converterRef.current?.openFilePicker();
    }, 300);
  };

  const desc = config.metaDescription || config.description || "Free WebP converter tool.";
  const title = config.h1 || config.heroTitle || config.title || "WebP Converter for Modern Web";
  const body = config.heroBody || config.heroDescription || "Convert your images to WebP format instantly. Designed for developers and SEO professionals who care about page speed, Core Web Vitals, and clean user experiences.";
  const eyebrow = config.heroEyebrow || "WEBP Converter";
  const isLocalized = Boolean(config.howToSteps?.length || config.faqs?.length);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": config.title || config.h1 || "Free WebP Converter",
    "url": "https://imageseo.cc" + config.path,
    "description": desc,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <PageShell
      title={config.metaTitle}
      description={desc}
      path={config.path}
      accent={config.accent || "bg-slate-50 dark:bg-[#0a0a0a]"}
      schema={schema}
    >
      <HeroIntro
        icon={config.icon || FileArchive}
        badge={eyebrow}
        title={title}
        body={body}
        badgeClass={config.badgeClass || "border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"}
      />

      <div id="tool">
        <SimpleFormatConverter
          ref={converterRef}
          initialTargetFormat={selectedTargetFormat}
          activeSourceExt={selectedSource}
          activeTargetExt={selectedTarget}
          onModeChange={(src, tgt, fmt) => {
            setSelectedSource(src);
            setSelectedTarget(tgt);
            setSelectedTargetFormat(fmt);
          }}
        />
      </div>

      {config.howToSteps ? <HowToCards steps={config.howToSteps} /> : null}

      {!isLocalized ? (
        <>
          <RichCard
            eyebrow="WEBP SEO"
            title="Why a WebP converter matters for image SEO"
            body="A fast WebP converter is useful because image SEO is not only about file names or alt text. Search engines and users both benefit when image files are lighter, pages load faster on mobile, and image-heavy templates avoid unnecessary weight. WebP is one of the easiest ways to reduce image size while keeping images visually clean for local SEO landing pages and content marketing pages."
          >
            <BulletRows items={config.featureBullets} />
          </RichCard>

          <RichCard
            eyebrow="CONVERSION TYPES"
            title="Use the exact WebP conversion you need"
            body="These conversion paths are designed to match common publishing workflows. Click a conversion type below to select the mode and immediately choose your images."
          >
            <div className="grid gap-6 md:grid-cols-2 mt-6">
              <div className="rounded-xl border border-slate-200 bg-slate-100/50 p-6 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] dark:border-slate-800 dark:bg-slate-900/30">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileBadgeIcon text="WEBP" exportArrow />
                    <span className="ml-1">Convert from WebP</span>
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-slate-700 dark:text-slate-300 pr-4">
                    Export a WebP file into another format when a platform, editor, or client workflow still needs a JPG or PNG image.
                  </p>
                </div>
                <div className="space-y-3">
                  {webpTargetFormats.map((format) => {
                    const targetFmt: OutputFormat = format === "JPG" ? "image/jpeg" : "image/png";
                    const isSelected = selectedSource === "WEBP" && selectedTarget === format;
                    return (
                      <FormatChip
                        key={format}
                        label={`WEBP to ${format}`}
                        onClick={() => handleSelectConversion("WEBP", format, targetFmt)}
                        sourceExt="WEBP"
                        targetExt={format}
                        isExport
                        active={isSelected}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-100/50 p-6 shadow-[inset_0_1px_4px_rgba(0,0,0,0.02)] dark:border-slate-800 dark:bg-slate-900/30">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileBadgeIcon text="WEBP" importArrow />
                    <span className="ml-1">Convert to WebP</span>
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-slate-700 dark:text-slate-300">
                    Convert source images into WebP before uploading them to your website so pages stay faster and image assets stay leaner.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {webpSourceFormats.map((format) => {
                    const isSelected = selectedSource === format && selectedTarget === "WEBP";
                    return (
                      <FormatChip
                        key={format}
                        label={`${format} to WEBP`}
                        onClick={() => handleSelectConversion(format, "WEBP", "image/webp")}
                        sourceExt={format}
                        active={isSelected}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <CTAAnchor href="/jpg-to-webp" label="Convert JPG to WebP" />
              <CTAAnchor href="/png-to-webp" label="Convert PNG to WebP" />
            </div>
          </RichCard>

          <RichCard
            eyebrow="SEO CONTENT"
            title="How to use a WebP converter on local SEO pages"
            body="The best place to use a WebP converter is on pages that carry both commercial intent and heavy image usage. Homepages, location pages, before-and-after galleries, and blog posts often include the largest images on the site. Converting those assets to WebP can support faster rendering, a better mobile experience, and stronger image SEO performance without rebuilding the page design."
          >
            <StatsRow stats={config.stats} />
          </RichCard>

          <SectionCards config={config} />

          <RichCard
            eyebrow="PUBLISHING WORKFLOW"
            title="A better WebP workflow for SEO teams and local businesses"
            body="A clean image publishing process usually starts with descriptive file names, then conversion to WebP, and then placement on the right page with useful alt text. That combination makes the image easier for search engines to interpret and easier for real users to load. This is why a dedicated WebP converter page can target search phrases like free WebP converter, convert JPG to WebP, and convert PNG to WebP while still serving a practical site-speed workflow."
          >
            <CTAAnchor href="#tool" label="Back to WebP converter" />
          </RichCard>
        </>
      ) : null}

      <FAQCard
        title={isLocalized ? "FAQ" : "Questions people ask about WebP conversion"}
        items={config.faq}
        rawFaqs={config.faqs}
      />
    </PageShell>
  );
}

function ImageCompressorPage({ config }: { config: ToolPageConfig }) {
  const desc = config.metaDescription || config.description || "Reduce image file size in your browser.";
  const title = config.h1 || config.heroTitle || config.title || "Free Online Image Compressor";
  const body = config.heroBody || config.heroDescription || "Reduce image file size in your browser with quality controls designed for practical web publishing.";
  const eyebrow = config.heroEyebrow || "Image Compressor";
  const isLocalized = Boolean(config.howToSteps?.length || config.faqs?.length);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": config.title || config.h1 || "Free Online Image Compressor",
    "url": "https://imageseo.cc" + config.path,
    "description": desc,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <PageShell
      title={config.metaTitle}
      description={desc}
      path={config.path}
      accent={config.accent || "bg-[linear-gradient(180deg,#F0F4FF,rgba(255,255,255,0.98))] dark:bg-[linear-gradient(180deg,rgba(17,24,39,0.8),rgba(2,6,23,0.98))]"}
      schema={schema}
    >
      <HeroIntro
        icon={config.icon || Compass}
        badge={eyebrow}
        title={title}
        body={body}
        badgeClass={config.badgeClass || "border-[#6B53FF]/20 bg-[#6B53FF]/10 text-[#6B53FF] dark:border-[#6B53FF]/50 dark:bg-[#6B53FF]/20 dark:text-[#A36BFF]"}
      />

      <div id="tool">
        <SimpleImageCompressor />
      </div>

      {config.howToSteps ? <HowToCards steps={config.howToSteps} /> : null}

      {!isLocalized ? (
        <>
          <RichCard
            eyebrow="IMAGE COMPRESSION"
            title="Why compress images before publishing"
            body="Image compression is one of the simplest ways to improve page speed without changing your design. Large photos add unnecessary weight to templates, especially on mobile. A good online image compressor helps reduce that weight while keeping the image visually usable for hero sections, content blocks, local landing pages, and article headers."
          >
            <BulletRows items={config.featureBullets} />
          </RichCard>

          <RichCard
            eyebrow="QUALITY SETTINGS"
            title="How to compress images without much quality loss"
            body="The safest approach is to keep dimensions intact and use a moderate compression range. For most websites, WebP output with quality between 80 and 90 percent is strong enough to create a meaningful file-size drop while preserving clarity. This page is built around that workflow so users looking for compress images online, reduce image size, and image compressor for SEO get a practical result instead of aggressive over-compression."
          >
            <StatsRow stats={config.stats} />
          </RichCard>

          <RichCard
            eyebrow="SEO CONTENT"
            title="Where an image compressor helps the most"
            body="An image compressor usually delivers the most value on image-heavy pages with commercial intent. Homepage banners, service-page hero images, testimonial sections, staff photos, and featured blog images can quietly become some of the heaviest assets on a site. Compressing those images before upload keeps templates faster and makes image SEO easier to maintain over time."
          >
            <div className="space-y-3">
              <div className="rounded-2xl bg-muted/25 px-4 py-3 text-sm leading-6 text-foreground/88">
                Compress hero images before they slow down homepage and city page performance.
              </div>
              <div className="rounded-2xl bg-muted/25 px-4 py-3 text-sm leading-6 text-foreground/88">
                Reduce blog and gallery image weight so editors can publish visuals without bloating templates.
              </div>
              <div className="rounded-2xl bg-muted/25 px-4 py-3 text-sm leading-6 text-foreground/88">
                Build a repeatable image SEO workflow where every image is compressed before upload.
              </div>
            </div>
          </RichCard>

          <SectionCards config={config} />

          <RichCard
            eyebrow="PUBLISHING WORKFLOW"
            title="A cleaner image compression workflow for SEO"
            body="The strongest compression workflow happens before the file reaches your CMS. When teams compress images at upload time instead of after pages are already bloated, they preserve page speed, reduce cumulative layout and performance issues, and keep their visual content easier to scale. That is the practical benefit behind search phrases like image compressor, compress images online, and reduce image size for web."
          >
            <CTAAnchor href="#tool" label="Back to image compressor" />
            <div className="mt-4"><CTAAnchor href="/compress-jpg" label="Open the JPG compression workflow" /></div>
          </RichCard>
        </>
      ) : null}

      <FAQCard
        title={isLocalized ? "FAQ" : "Questions people ask about image compression"}
        items={config.faq}
        rawFaqs={config.faqs}
      />
    </PageShell>
  );
}

function GeoTaggerPage({ config }: { config: ToolPageConfig }) {
  const desc = config.metaDescription || config.description || "Free Geo Tagger tool for local SEO images.";
  const title = config.h1 || config.heroTitle || config.title || "Free Geo Tagger for Local SEO Images";
  const body = config.heroBody || config.heroDescription || "Use this geo tagger to add GPS metadata to images directly in the browser. Pin the exact location, embed latitude and longitude, and export geo-tagged photos for local SEO workflows, Google Business Profile assets, and location-specific content.";
  const eyebrow = config.heroEyebrow || "Geo Tagger";
  const isLocalized = Boolean(config.howToSteps?.length || config.faqs?.length);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": config.title || config.h1 || "Free Geo Tagger",
    "url": "https://imageseo.cc" + config.path,
    "description": desc,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <PageShell
      title={config.metaTitle}
      description={desc}
      path={config.path}
      accent={config.accent || "bg-[linear-gradient(180deg,rgba(255,247,237,0.84),rgba(255,255,255,0.98))] dark:bg-[linear-gradient(180deg,rgba(124,45,18,0.20),rgba(2,6,23,0.98))]"}
      schema={schema}
    >
      <HeroIntro
        icon={config.icon || MapPinned}
        badge={eyebrow}
        title={title}
        body={body}
        badgeClass={config.badgeClass || "border-amber-300/60 bg-amber-50/80 text-amber-700 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-300"}
      />

      <div id="tool">
        <SimpleGeoTagger />
      </div>

      {config.howToSteps ? <HowToCards steps={config.howToSteps} /> : null}

      {!isLocalized ? (
        <>
          <RichCard
            eyebrow="GEO TAGGING"
            title="Why a geo tagger is useful for local SEO"
            body={
              <>
                <p className="mb-4">
                  A geo tagger helps tie an image to a real place by embedding GPS coordinates directly into the file metadata. On its own that is not a complete ranking strategy, but it becomes much more useful when combined with descriptive file names, location-relevant landing pages, accurate business information, and local content. For businesses targeting city searches, service-area pages, or Google Business Profile visibility, geo-tagged images add another layer of location context.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <em>All metadata injection occurs 100% locally in your browser sandbox using HTML5 and client-side EXIF libraries. Your original photos are never uploaded or stored on any server.</em>
                </p>
              </>
            }
          >
            <BulletRows items={config.featureBullets} />
          </RichCard>

          <RichCard
            eyebrow="LOCAL SEO"
            title="How to add GPS metadata to images properly"
            body="The best geo tagging workflow is straightforward: choose the correct location, confirm the latitude and longitude, optionally add a short title and description, and export the image in the format you actually plan to publish. The coordinates are written into the downloaded file's metadata; they are not visible text stamped onto the image."
          >
            <StatsRow stats={config.stats} />
          </RichCard>

          <RichCard
            eyebrow="PRIVACY AND LIMITS"
            title="Check location metadata before sharing"
            body="GPS coordinates can reveal a home, client site, or other sensitive location. Use the tool only when the location is appropriate to share, and remember that some platforms may strip or rewrite metadata after upload. Processing and downloads happen in the browser in this workflow; the site does not need an image upload to create the result."
          >
            <CTAAnchor href="#tool" label="Open the GPS metadata tool" />
          </RichCard>

          <RichCard
            eyebrow="SEO CONTENT"
            title="Where geo-tagged images fit into a location strategy"
            body="Geo-tagged images are especially useful for storefront photos, completed-job photos, team-on-site photos, and branch-specific galleries. When those images are placed on matching city pages or business listing assets, they support a more coherent local SEO signal stack. The strongest results come when image metadata, page topic, and location intent all point in the same direction."
          >
            <div className="space-y-3">
              <div className="rounded-2xl bg-muted/25 px-4 py-3 text-sm leading-6 text-foreground/88">
                Tag storefront photos before publishing them on a location page or business profile.
              </div>
              <div className="rounded-2xl bg-muted/25 px-4 py-3 text-sm leading-6 text-foreground/88">
                Use branch-specific coordinates for multi-location businesses so image libraries stay organized.
              </div>
              <div className="rounded-2xl bg-muted/25 px-4 py-3 text-sm leading-6 text-foreground/88">
                Pair geo-tagged images with local SEO copy, titles, and file names for a stronger combined signal.
              </div>
            </div>
          </RichCard>

          <SectionCards config={config} />

          <RichCard
            eyebrow="PUBLISHING WORKFLOW"
            title="A dedicated geo tag page is easier to use and easier to rank"
            body="A standalone geo tagger page can target clear search intent around geo tagging, GPS metadata, and local SEO images more effectively than a generic homepage tab. It also gives users a simpler workflow: search a place, upload images, add GPS metadata to the files, and download the finished assets. That clarity is useful both for usability and for organic search targeting."
          >
            <CTAAnchor href="#tool" label="Back to geo tagger" />
          </RichCard>
        </>
      ) : null}

      <FAQCard
        title={isLocalized ? "FAQ" : "Questions people ask about geo tagging"}
        items={config.faq}
        rawFaqs={config.faqs}
      />
    </PageShell>
  );
}

const formatPairFaqs = (sourceFormat: string) => [
  {
    question: `Why should I convert ${sourceFormat} to WebP for my website?`,
    answer: `WebP delivers up to 30-35% smaller file sizes than ${sourceFormat} while preserving crisp visual clarity. Smaller image assets load much faster on mobile networks and directly improve Google Core Web Vitals (LCP).`
  },
  {
    question: `Does converting ${sourceFormat} to WebP preserve transparency?`,
    answer: sourceFormat === "PNG"
      ? "Yes! WebP fully supports 24-bit alpha transparency while slashing file sizes by up to 60-70% compared to heavy PNG-24 files."
      : "JPG does not have transparency. When converting JPG to WebP, the photo retains full color depth and luminance while eliminating redundant compression artifacts."
  },
  {
    question: "Is WebP supported by all modern web browsers?",
    answer: "Yes. WebP is supported by Google Chrome, Safari, Firefox, Edge, Opera, and mobile browsers on iOS and Android, covering over 97% of global web users."
  },
  {
    question: `Are my ${sourceFormat} images uploaded to an external server?`,
    answer: "No. All conversion operations run locally inside your browser memory using HTML5 Canvas. Your files remain 100% private on your device."
  },
  {
    question: `Can I convert multiple ${sourceFormat} files to WebP in bulk?`,
    answer: "Yes. You can drag and drop multiple files at once, convert them simultaneously, and download all WebP assets as a convenient ZIP package."
  }
];

const jpgCompressionFaqs = [
  {
    question: "How do I compress JPG images without losing quality?",
    answer: "Our tool utilizes smart quantization matrix compression in your browser. Setting the quality between 75% and 85% typically reduces file size by 60% to 80% without noticeable visual artifacts."
  },
  {
    question: "What is the recommended JPG file size for website hero images?",
    answer: "For fast page loads and strong SEO, keep hero banners under 150KB–200KB, blog images under 100KB, and thumbnails under 30KB."
  },
  {
    question: "Does compressing JPG images help Google search rankings?",
    answer: "Yes. Compressing JPGs directly improves Largest Contentful Paint (LCP) and reduces page load times, which are proven Google ranking factors and decrease bounce rates."
  },
  {
    question: "Can I compress multiple JPG files at once and download a ZIP?",
    answer: "Yes. You can select dozens of JPG images, apply quality settings in bulk, and download individual files or a single consolidated ZIP archive."
  },
  {
    question: "Are my photos uploaded or stored on your servers?",
    answer: "No. All processing happens 100% locally in your browser sandbox using HTML5 Canvas. Your photos are never uploaded, stored, or viewed by anyone."
  }
];

export function FormatPairPage({ sourceFormat }: { sourceFormat: "JPG" | "PNG" }) {
  const title = `${sourceFormat} to WebP Converter`;
  const path = sourceFormat === "JPG" ? "/jpg-to-webp" : "/png-to-webp";
  const description = `Convert ${sourceFormat} images to WebP in your browser. Choose WebP output, adjust quality, compare the result, and download files without uploading them.`;
  const sourceGuidance = sourceFormat === "JPG"
    ? "JPG is a practical source for photographs. WebP output can reduce delivery weight while retaining a quality setting you can adjust for the page where the image will be used."
    : "PNG is useful for graphics and transparency. Check the converted preview before downloading because photographic PNGs and transparent graphics can need different output choices.";
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": title,
    "url": `https://imageseo.cc${path}`,
    "description": description,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  };

  return (
    <PageShell title={`${title} | IMGSEO`} description={description} path={path} accent="bg-slate-50 dark:bg-[#0a0a0a]" schema={schema}>
      <HeroIntro icon={FileArchive} badge={`${sourceFormat} → WEBP`} title={title} body={`Convert ${sourceFormat} files to WebP locally. Upload your images, select WebP output, tune quality when needed, and download the converted files from the same browser session.`} badgeClass="border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white" />
      <div id="tool">
        <SimpleFormatConverter initialTargetFormat="image/webp" activeSourceExt={sourceFormat} activeTargetExt="WEBP" />
      </div>
      <RichCard eyebrow="FORMAT-SPECIFIC GUIDANCE" title={`When to convert ${sourceFormat} to WebP`} body={sourceGuidance}>
        <BulletRows items={[`Select ${sourceFormat} files from your device and confirm the preview before converting.`, "Use WebP when your publishing stack supports it and keep the original if you need an archival source.", "Write descriptive filenames and alt text in the page or CMS where the image is published."]} />
      </RichCard>
      <RichCard eyebrow="PRIVACY AND LIMITS" title="What this conversion does" body="The converter uses browser image APIs to create a new WebP file. It does not promise a fixed percentage reduction: the result depends on dimensions, image content, source encoding, and selected quality. Review the output before publishing, especially for transparency or fine text.">
        <CTAAnchor href="#tool" label={`Start ${sourceFormat} to WebP conversion`} />
      </RichCard>
      <FAQCard title={`Questions people ask about ${sourceFormat} to WebP conversion`} items={formatPairFaqs(sourceFormat)} />
    </PageShell>
  );
}

export function JpgCompressionPage() {
  const path = "/compress-jpg";
  const description = "Compress JPG images in your browser with adjustable quality, optional format conversion, previews, and local downloads.";
  return (
    <PageShell title="Compress JPG Images Online | IMGSEO" description={description} path={path} accent="bg-[linear-gradient(180deg,#F0F4FF,rgba(255,255,255,0.98))]">
      <HeroIntro icon={Compass} badge="JPG COMPRESSION" title="Compress JPG Images Online" body="Reduce JPG file size locally before publishing to a website, blog, gallery, or business page. Review the result and choose whether to keep JPG or export another supported format." badgeClass="border-[#6B53FF]/20 bg-[#6B53FF]/10 text-[#6B53FF]" />
      <div id="tool"><SimpleImageCompressor /></div>
      <RichCard eyebrow="JPG WORKFLOW" title="How to compress a JPG without guessing" body="Upload JPG files, choose a quality level, and compare the original and compressed byte sizes after processing. There is no fixed savings promise because output depends on the source dimensions, image detail, original encoding, and selected format.">
        <BulletRows items={["Use moderate quality for photographs and inspect text or fine detail before publishing.", "Keep JPG when compatibility matters; choose WebP when your publishing stack supports it.", "Batch processing and ZIP download help prepare multiple images in one browser session."]} />
      </RichCard>
      <FAQCard title="Questions people ask about JPG compression" items={jpgCompressionFaqs} />
    </PageShell>
  );
}

function DefaultToolPage({ config }: { config: ToolPageConfig }) {
  const desc = config.metaDescription || config.description || "";
  const title = config.h1 || config.heroTitle || config.title || "";
  const body = config.heroBody || config.heroDescription || "";
  const eyebrow = config.heroEyebrow || "";
  const IconComponent = config.icon || Sparkles;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SeoHead title={config.metaTitle} description={desc} path={config.path} />
      <Navbar />
      <main className="flex-1">
        <section className={`relative overflow-hidden px-4 pb-16 pt-12 md:pt-20 ${config.accent || ""}`}>
          <div className="container relative mx-auto">
            <div className="space-y-8">
              <div className="max-w-3xl">
                <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] ${config.accentClass || config.badgeClass || "border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"}`}>
                  <IconComponent className="h-3.5 w-3.5" />
                  {eyebrow}
                </span>
                <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight md:text-5xl lg:text-6xl">{title}</h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">{body}</p>
              </div>

              <div id="tool">
                <ToolSection forcedMode={config.mode as any} routeMode />
              </div>

              {config.howToSteps ? <HowToCards steps={config.howToSteps} /> : null}

              <BulletRows items={config.featureBullets} />
              <SectionCards config={config} />
              <FAQCard
                title={config.shortLabel ? `Questions people ask about ${config.shortLabel.toLowerCase()}` : "FAQ"}
                items={config.faq}
                rawFaqs={config.faqs}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export function ToolPage({ config }: { config: ToolPageConfig }) {
  if (config.mode === "webp-converter" || config.mode === "format-converter") return <WebpConverterPage config={config} />;
  if (config.mode === "online-image-compressor" || config.mode === "compressor") return <ImageCompressorPage config={config} />;
  if (config.mode === "geo-tagger") return <GeoTaggerPage config={config} />;
  return <DefaultToolPage config={config} />;
}
