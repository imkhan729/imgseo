import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

interface Post {
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  slug: string;
  body: { h2: string; paragraphs: string[] }[];
}

const posts: Post[] = [
  {
    tag: "Image SEO",
    slug: "image-file-names-local-seo",
    title: "Why Image File Names Are the #1 Ignored Local SEO Factor",
    excerpt: "Most local businesses upload photos straight from their camera with names like IMG_4392.jpg. Here's why that's costing them rankings — and how to fix it in 60 seconds.",
    readTime: "4 min read",
    date: "May 2025",
    body: [
      {
        h2: "The Problem With Camera File Names",
        paragraphs: [
          "When your phone takes a photo, it saves it as something like IMG_4392.jpg. These file names mean absolutely nothing to Google. A file named best-plumber-doha-qatar.jpg tells Google exactly who this business is, what they do, and where they operate.",
          "Google's image search algorithm reads the file name as one of the first signals to understand what an image depicts.",
        ],
      },
      {
        h2: "The Right Format for SEO Image File Names",
        paragraphs: [
          "The proven formula: keyword-location-businessname.format — all lowercase, words separated by hyphens. Example: emergency-plumber-doha-qatar-quickfix.jpg. Include your primary service keyword first, then your city, then your business name.",
          "Use WebP format whenever possible. WebP files are 30–50% smaller than equivalent JPEGs, which improves your page speed score — a direct Google ranking factor.",
        ],
      },
      {
        h2: "How to Rename Images Before Uploading",
        paragraphs: [
          "The fastest approach: use IMGSEO. Enter your business name, keyword, and location — the tool instantly generates a perfectly formatted SEO file name and converts your image to WebP. The whole process takes under 60 seconds per image.",
        ],
      },
    ],
  },
  {
    tag: "Google Business",
    slug: "google-business-profile-photo-optimization",
    title: "How to Optimize Google Business Profile Photos for Maximum Local Visibility",
    excerpt: "Your GBP photos influence both rankings and click-through rate. We break down exactly which images to upload, what sizes to use, and how to name them for maximum impact.",
    readTime: "6 min read",
    date: "Apr 2025",
    body: [
      {
        h2: "Why GBP Photos Affect Rankings",
        paragraphs: [
          "Businesses with 10+ high-quality photos get 35% more clicks than those with fewer than 3. Google also uses image recognition AI to understand what your images show.",
        ],
      },
      {
        h2: "File Name and Size Requirements",
        paragraphs: [
          "Before uploading any photo, rename it: service-city-businessname.jpg. Google cannot read ALT text for GBP images — the file name is your only keyword signal.",
          "Google recommends photos at least 720×720px for square images. IMGSEO includes a 'Google Business (720×720)' resize preset that handles this automatically.",
        ],
      },
      {
        h2: "Geo Tagging GBP Photos",
        paragraphs: [
          "Use IMGSEO's Geo Tag tool to select your business location on the map, then click 'Embed GPS in Images' — the coordinates are written directly into the image EXIF in your browser, no upload required.",
        ],
      },
    ],
  },
  {
    tag: "Performance",
    slug: "webp-vs-jpg-local-seo",
    title: "WebP vs JPG for Local Business Websites: Which Format Ranks Better?",
    excerpt: "WebP images load up to 34% faster than JPG. Google's Core Web Vitals score directly affects local ranking. Here's how to switch formats without breaking your site.",
    readTime: "5 min read",
    date: "Mar 2025",
    body: [
      {
        h2: "What Is WebP and Why Does Google Prefer It?",
        paragraphs: [
          "A typical 500KB JPEG can be converted to WebP at equivalent quality and drop to 320–350KB — a 30–40% reduction. Google introduced WebP to speed up the web, and pages using it score better on Core Web Vitals.",
        ],
      },
      {
        h2: "Converting Your Existing Images",
        paragraphs: [
          "IMGSEO converts JPG and PNG images to WebP entirely in your browser. Upload your images, select WebP as the output format, set quality to 80%, and download. For bulk conversions, use the ZIP download feature.",
        ],
      },
    ],
  },
  {
    tag: "ALT Text",
    slug: "alt-text-local-seo-formula",
    title: "Writing ALT Text for Local SEO: The Formula That Actually Works",
    excerpt: "ALT text is free ranking real estate — and almost no local business uses it correctly. The exact formula that drives image search traffic.",
    readTime: "3 min read",
    date: "Feb 2025",
    body: [
      {
        h2: "The ALT Text Formula for Local SEO",
        paragraphs: [
          "The formula: [Descriptive action] [service keyword] in [city, region] by [business name]. Example: 'Emergency plumbing repair in Doha, Qatar by QuickFix Plumbing.'",
          "Keep it under 125 characters. Be descriptive but natural — write for humans first. IMGSEO generates ALT text automatically based on your inputs.",
        ],
      },
    ],
  },
  {
    tag: "Strategy",
    slug: "image-seo-checklist-local-business",
    title: "The 5-Minute Image SEO Checklist Every Local Business Owner Should Use",
    excerpt: "Before uploading any image to your website or Google Business Profile, run through this 5-step checklist. It takes 5 minutes and can dramatically improve your local rankings.",
    readTime: "3 min read",
    date: "Jan 2025",
    body: [
      {
        h2: "The 5-Step Checklist",
        paragraphs: [
          "1 — Rename the file: keyword-city-businessname.webp. 2 — Compress: under 150KB for web, under 500KB for GBP. 3 — Convert to WebP for websites (JPG for GBP). 4 — Copy IMGSEO's ALT text into your CMS. 5 — Embed GPS coordinates using IMGSEO's Geo Tag tool.",
        ],
      },
      {
        h2: "How Often to Run This Checklist",
        paragraphs: [
          "Every time you upload a new image. Set a monthly reminder to add 3–5 fresh photos to your GBP — Google rewards active listings with higher local visibility.",
        ],
      },
    ],
  },
];

const tagConfig: Record<string, { dot: string; label: string }> = {
  "Image SEO":       { dot: "bg-violet-500",  label: "text-violet-700 dark:text-violet-300" },
  "Google Business": { dot: "bg-blue-500",    label: "text-blue-700 dark:text-blue-300" },
  "Performance":     { dot: "bg-emerald-500", label: "text-emerald-700 dark:text-emerald-300" },
  "ALT Text":        { dot: "bg-amber-500",   label: "text-amber-700 dark:text-amber-300" },
  "Strategy":        { dot: "bg-rose-500",    label: "text-rose-700 dark:text-rose-300" },
};

function BlogCard({ post, index, featured = false }: { post: Post; index: number; featured?: boolean }) {
  const [open, setOpen] = useState(false);
  const cfg = tagConfig[post.tag] ?? tagConfig["Image SEO"];

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="card-3d rounded-3xl border border-border/60 bg-background overflow-hidden"
        data-testid={`blog-card-${post.slug}`}
      >
        <div className="md:grid md:grid-cols-5">
          {/* Gradient panel */}
          <div className="md:col-span-2 bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-600 p-8 flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-white/70 mb-3">{post.tag}</span>
              <div className="flex items-center gap-1.5 text-white/60 text-xs">
                <Clock className="h-3 w-3" /> {post.readTime} · {post.date}
              </div>
            </div>
            <div className="text-6xl font-black text-white/10 leading-none select-none" style={{ fontFamily: "var(--app-font-display)" }}>
              01
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3 p-8 flex flex-col">
            <h3 className="font-black text-xl leading-snug mb-3">{post.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5">{post.excerpt}</p>
            <button
              onClick={() => setOpen((v) => !v)}
              data-testid={`button-expand-${post.slug}`}
              className="self-start flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              {open ? <><ChevronUp className="h-4 w-4" /> Collapse</> : <><ChevronDown className="h-4 w-4" /> Read full article</>}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-8 pt-2 border-t space-y-5">
                {post.body.map((section) => (
                  <div key={section.h2}>
                    <h4 className="font-bold text-base mb-2">{section.h2}</h4>
                    {section.paragraphs.map((p, i) => (
                      <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2 last:mb-0">{p}</p>
                    ))}
                  </div>
                ))}
                <a href="#tool" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline" data-testid={`link-tool-${post.slug}`}>
                  Optimize your images free now <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="card-3d rounded-3xl border border-border/60 bg-background overflow-hidden flex flex-col"
      data-testid={`blog-card-${post.slug}`}
    >
      <div className="p-6 flex flex-col flex-1">
        {/* Tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
          <span className={`text-xs font-bold ${cfg.label}`}>{post.tag}</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {post.readTime}
          </span>
        </div>

        <h3 className="font-black text-base leading-snug mb-3">{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{post.excerpt}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <span className="text-xs text-muted-foreground">{post.date}</span>
          <button
            onClick={() => setOpen((v) => !v)}
            data-testid={`button-expand-${post.slug}`}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
          >
            {open ? <><ChevronUp className="h-3.5 w-3.5" /> Less</> : <><ChevronDown className="h-3.5 w-3.5" /> Read</>}
          </button>
        </div>
      </div>

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
            <div className="px-6 pb-6 border-t bg-muted/10 pt-4 space-y-4">
              {post.body.map((section) => (
                <div key={section.h2}>
                  <h4 className="font-bold text-sm mb-1.5">{section.h2}</h4>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-xs text-muted-foreground leading-relaxed mb-1.5 last:mb-0">{p}</p>
                  ))}
                </div>
              ))}
              <a href="#tool" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline" data-testid={`link-tool-${post.slug}`}>
                Try IMGSEO free <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export function Blog() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">

        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <div>
            <p className="eyebrow mb-3">Resources</p>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl lg:text-5xl mb-2">From the Blog</h2>
            <p className="text-muted-foreground text-lg max-w-lg">
              Actionable image SEO guides. Click any card to read the full article.
            </p>
          </div>
          <a
            href="#tool"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors group"
          >
            Start optimizing <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Featured */}
        <div className="mb-5">
          <BlogCard post={posts[0]} index={0} featured />
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {posts.slice(1).map((post, idx) => (
            <BlogCard key={post.slug} post={post} index={idx + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
