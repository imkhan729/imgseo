import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown, ChevronUp, ArrowRight, BookOpen } from "lucide-react";

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
          "When your phone takes a photo, it saves it as something like IMG_4392.jpg or DCIM_20250502.jpg. These file names mean absolutely nothing to Google. When you upload them to your website or Google Business Profile, you're giving up one of the easiest keyword signals available to you — completely for free.",
          "Google's image search algorithm reads the file name as one of the first signals to understand what an image depicts. A file named best-plumber-doha-qatar.jpg tells Google exactly who this business is, what they do, and where they operate. IMG_4392.jpg tells Google nothing.",
        ],
      },
      {
        h2: "The Right Format for SEO Image File Names",
        paragraphs: [
          "The proven formula is: keyword-location-businessname.format — all lowercase, words separated by hyphens (not underscores or spaces). Example: emergency-plumber-doha-qatar-quickfix.jpg. Include your primary service keyword first (it carries the most weight), then your city and country, then your business name.",
          "Avoid using underscores — Google treats them as joining words rather than separating them, so 'best_plumber' reads as 'bestplumber', not 'best plumber'. Always use hyphens.",
          "Use WebP format whenever possible. WebP files are 30–50% smaller than equivalent JPEGs, which improves your page speed score — a direct Google ranking factor. IMGSEO converts your images to WebP automatically with the original dimensions preserved.",
        ],
      },
      {
        h2: "How to Rename Images Before Uploading",
        paragraphs: [
          "The fastest approach: use IMGSEO. Enter your business name, keyword, and location — the tool instantly generates a perfectly formatted SEO file name, converts your image to WebP, and lets you download it with the new name applied. The whole process takes under 60 seconds per image.",
          "For Google Business Profile specifically, the file name is the primary keyword signal because GBP doesn't display ALT text. Getting the file name right before uploading is non-negotiable for local image SEO.",
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
          "Google Business Profile photos influence your local search ranking in two measurable ways: they signal to Google that your listing is actively maintained (fresh content gets rewarded), and they directly affect the click-through rate of your listing — which is itself a ranking signal. Businesses with 10+ high-quality photos get 35% more clicks than those with fewer than 3.",
          "Google also uses image content recognition (AI) to understand what your images show. A photo of a plumber working on pipes confirms your business type. A blurry storefront photo contributes little. Quality and relevance both matter.",
        ],
      },
      {
        h2: "What Photos to Upload — and When",
        paragraphs: [
          "Upload at minimum: a cover photo (1080×608px minimum), a logo (250×250px), at least 3 interior photos, at least 3 exterior photos, and photos of your products or work. For service businesses (plumbers, electricians, cleaners), 'work in progress' and 'completed job' photos perform exceptionally well.",
          "Add new photos at least once a month. Google's algorithm rewards freshness. Businesses that upload photos regularly rank higher in local packs than dormant listings.",
        ],
      },
      {
        h2: "File Name and Size Requirements",
        paragraphs: [
          "Before uploading any photo, rename it with your keyword and location. The format should be: service-city-businessname.jpg. Google cannot read ALT text for GBP images — the file name is your only keyword signal. This one step alone can move you up in local results.",
          "Google recommends photos at least 720×720px for square images. IMGSEO includes a 'Google Business (720×720)' resize preset that handles this automatically. Compress to 80–90% quality for a good balance of visual quality and file size.",
        ],
      },
      {
        h2: "Geo Tagging GBP Photos",
        paragraphs: [
          "Add GPS coordinates to your images before uploading. Google can read the EXIF GPS data and use it as a location relevance signal. Use IMGSEO's Geo Tag tool to select your business location on the map, then click 'Embed GPS in Images' — the coordinates are written directly into the image EXIF in your browser, with no upload required.",
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
          "WebP is a modern image format developed by Google that delivers superior compression compared to JPEG and PNG. A typical 500KB JPEG can be converted to WebP at equivalent quality and drop to 320–350KB — a 30–40% reduction. For a page with 10 images, that's potentially several megabytes of savings.",
          "Google introduced WebP as part of its effort to speed up the web. Naturally, pages that use WebP images load faster, score better on Core Web Vitals (specifically LCP — Largest Contentful Paint), and rank higher in Google search results.",
        ],
      },
      {
        h2: "How Core Web Vitals Connect to Local Rankings",
        paragraphs: [
          "Google uses Core Web Vitals as a ranking factor for all searches, including local. Your local search ranking depends on relevance, proximity, and prominence — but page experience (which includes CWV) affects your organic ranking as a tiebreaker. In a competitive local market, faster-loading pages edge out slower competitors.",
          "LCP (Largest Contentful Paint) measures how quickly the largest visible element loads — usually a hero image or a product photo. If that image is a 2MB JPEG, your LCP will be slow. Convert it to WebP and you can easily get below the 2.5s 'Good' threshold.",
        ],
      },
      {
        h2: "Browser Support and Converting Your Images",
        paragraphs: [
          "As of 2025, WebP is supported by 97.3% of all browsers globally, including Safari (since 2020). There is no meaningful reason to use JPEG over WebP for any web-facing image.",
          "IMGSEO converts JPG and PNG images to WebP entirely in your browser. Upload your images, select WebP as the output format, set quality to 80%, and download. For bulk conversions, use the Download All ZIP feature to process your entire library at once.",
        ],
      },
    ],
  },
  {
    tag: "ALT Text",
    slug: "alt-text-local-seo-formula",
    title: "Writing ALT Text for Local SEO: The Formula That Actually Works",
    excerpt: "ALT text is free ranking real estate — and almost no local business uses it correctly. We share the exact formula we use to generate ALT text that drives image search traffic.",
    readTime: "3 min read",
    date: "Feb 2025",
    body: [
      {
        h2: "What ALT Text Actually Does",
        paragraphs: [
          "ALT (alternative) text is an HTML attribute added to image tags that describes what the image shows. It serves three purposes: screen readers read it aloud for visually impaired users (accessibility), Google reads it to understand image content (SEO), and browsers display it if an image fails to load.",
          "For local SEO, ALT text is one of the most underutilized ranking tools. Every image on your website is an opportunity to tell Google 'this image is related to [service] in [city]'.",
        ],
      },
      {
        h2: "The ALT Text Formula for Local SEO",
        paragraphs: [
          "The formula: [Descriptive action] [service keyword] in [city, region] by [business name] for [audience]. Example: 'Emergency plumbing repair in Doha, Qatar by QuickFix Plumbing for residential and commercial clients.'",
          "Keep it under 125 characters. Be descriptive but natural — write for humans first, search engines second. Avoid keyword stuffing. IMGSEO generates ALT text automatically based on your inputs and can be copied with one click.",
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
          "Step 1 — Rename the file: Change IMG_4392.jpg to keyword-city-businessname.webp. This takes 10 seconds and is the single highest-impact action for image SEO.",
          "Step 2 — Compress it: Target under 150KB for web images, under 500KB for GBP photos.",
          "Step 3 — Convert to WebP: Use WebP for all website images. For GBP, use JPG. IMGSEO handles both with a single format toggle.",
          "Step 4 — Write ALT text: Copy IMGSEO's generated ALT text and paste it into your CMS when you upload the image.",
          "Step 5 — Embed geo coordinates: Use IMGSEO's Geo Tag tool and click 'Embed GPS in Images'. GPS coordinates are written into the image EXIF in your browser — no third-party tools needed.",
        ],
      },
      {
        h2: "How Often to Run This Checklist",
        paragraphs: [
          "Every time you upload a new image to your website or GBP listing, run through all five steps. Set a monthly reminder to add fresh photos to your GBP — aim for 3–5 new photos per month.",
          "Image SEO is a long game. Businesses that consistently optimize their images over 3–6 months typically see meaningful improvements in local pack rankings and Google Business Profile impressions.",
        ],
      },
    ],
  },
];

/* ── tag configuration ── */
const tagConfig: Record<string, { gradient: string; pill: string; dot: string }> = {
  "Image SEO":       { gradient: "from-violet-500 via-violet-600 to-indigo-700", pill: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300", dot: "bg-violet-500" },
  "Google Business": { gradient: "from-blue-500 via-blue-600 to-cyan-700",       pill: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",         dot: "bg-blue-500" },
  "Performance":     { gradient: "from-emerald-500 via-teal-500 to-cyan-600",    pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", dot: "bg-emerald-500" },
  "ALT Text":        { gradient: "from-amber-500 via-orange-500 to-rose-500",    pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",      dot: "bg-amber-500" },
  "Strategy":        { gradient: "from-rose-500 via-pink-500 to-fuchsia-600",    pill: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",          dot: "bg-rose-500" },
};

/* ── Featured card (first post) ── */
function FeaturedCard({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const cfg = tagConfig[post.tag] ?? tagConfig["Image SEO"];

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="card-3d rounded-3xl border bg-background overflow-hidden"
      data-testid={`blog-card-${post.slug}`}
    >
      {/* Gradient hero banner */}
      <div className={`relative bg-gradient-to-br ${cfg.gradient} px-8 py-10 text-white overflow-hidden`}>
        {/* Decorative blobs */}
        <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-1/2 h-24 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold tracking-wide">
              <BookOpen className="h-3 w-3" /> Featured
            </span>
            <span className="text-xs text-white/70 font-medium">{post.tag}</span>
          </div>
          <h3 className="text-2xl font-extrabold leading-tight mb-3 max-w-lg">{post.title}</h3>
          <p className="text-sm text-white/80 leading-relaxed max-w-lg">{post.excerpt}</p>
          <div className="flex items-center gap-4 mt-5 text-xs text-white/70 font-medium">
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
            <span>{post.date}</span>
          </div>
        </div>
      </div>

      {/* Expand button */}
      <div className="px-8 py-4 flex items-center justify-between border-b bg-muted/10">
        <span className="text-xs text-muted-foreground">Full article below</span>
        <button
          onClick={() => setOpen((v) => !v)}
          data-testid={`button-expand-${post.slug}`}
          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
        >
          {open ? <><ChevronUp className="h-4 w-4" /> Collapse</> : <><ChevronDown className="h-4 w-4" /> Read full article</>}
        </button>
      </div>

      {/* Article body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-8 py-6 space-y-5">
              {post.body.map((section) => (
                <div key={section.h2}>
                  <h4 className="font-bold text-base mb-2.5">{section.h2}</h4>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-2.5 last:mb-0">{p}</p>
                  ))}
                </div>
              ))}
              <a href="#tool" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline" data-testid={`link-tool-${post.slug}`}>
                Optimize your images free now <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* ── Regular card ── */
function BlogCard({ post, index }: { post: Post; index: number }) {
  const [open, setOpen] = useState(false);
  const cfg = tagConfig[post.tag] ?? tagConfig["Image SEO"];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="card-3d rounded-2xl border bg-background overflow-hidden flex flex-col"
      data-testid={`blog-card-${post.slug}`}
    >
      {/* Compact gradient banner */}
      <div className={`relative h-2 bg-gradient-to-r ${cfg.gradient}`} />

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Tag + meta */}
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.pill}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {post.tag}
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />{post.readTime}
          </div>
        </div>

        <h3 className="font-bold text-base leading-snug mb-2.5">{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{post.excerpt}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t">
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

      {/* Article expand */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 pt-1 border-t bg-muted/10 space-y-4">
              {post.body.map((section) => (
                <div key={section.h2}>
                  <h4 className="font-bold text-sm mb-2 text-foreground">{section.h2}</h4>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-xs text-muted-foreground leading-relaxed mb-2 last:mb-0">{p}</p>
                  ))}
                </div>
              ))}
              <a href="#tool" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline" data-testid={`link-tool-${post.slug}`}>
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
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Resources</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">From the Blog</h2>
            <p className="text-muted-foreground text-lg max-w-lg">Actionable image SEO guides for local businesses. Click any card to read the full article.</p>
          </div>
          <a
            href="#tool"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors group"
          >
            Start optimizing now
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Featured card */}
        <div className="mb-6">
          <FeaturedCard post={posts[0]} />
        </div>

        {/* 2-col grid for next two */}
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {posts.slice(1, 3).map((post, idx) => (
            <BlogCard key={post.slug} post={post} index={idx} />
          ))}
        </div>

        {/* 2-col grid for last two */}
        <div className="grid md:grid-cols-2 gap-5">
          {posts.slice(3).map((post, idx) => (
            <BlogCard key={post.slug} post={post} index={idx + 2} />
          ))}
        </div>

      </div>
    </section>
  );
}
