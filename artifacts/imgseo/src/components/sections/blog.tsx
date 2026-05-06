import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";

interface Post {
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  slug: string;
  body: {
    h2: string;
    paragraphs: string[];
  }[];
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
          "For businesses in competitive local markets, geo-tagged photos provide an edge. They confirm to Google that the images were taken at your actual business location, reinforcing local relevance.",
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
        h2: "Browser Support in 2025",
        paragraphs: [
          "As of 2025, WebP is supported by 97.3% of all browsers globally, including Safari (since 2020). There is no meaningful reason to use JPEG over WebP for any web-facing image. The only exception is if your CMS or platform explicitly doesn't support WebP uploads — in that case, use JPG as the fallback.",
          "For Google Business Profile, upload JPG. GBP doesn't officially support WebP uploads. Use IMGSEO to create both — WebP for your website, JPG for your GBP uploads.",
        ],
      },
      {
        h2: "Converting Your Existing Images",
        paragraphs: [
          "IMGSEO converts JPG and PNG images to WebP entirely in your browser. Upload your images, select WebP as the output format, set quality to 80%, and download. The file name is preserved with the new .webp extension. For bulk conversions, use the Download All ZIP feature to process your entire image library at once.",
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
          "For local SEO, ALT text is one of the most underutilized ranking tools. Every image on your website is an opportunity to tell Google 'this image is related to [service] in [city]' — and most local businesses either leave it blank or write something useless like 'photo1'.",
        ],
      },
      {
        h2: "The ALT Text Formula for Local SEO",
        paragraphs: [
          "The formula: [Descriptive action] [service keyword] in [city, region] by [business name] for [audience]. Example: 'Emergency plumbing repair in Doha, Qatar by QuickFix Plumbing for residential and commercial clients.'",
          "Keep it under 125 characters. Be descriptive but natural — write for humans first, search engines second. Avoid keyword stuffing ('plumber plumbing plumbers Doha Qatar'). Google penalizes over-optimization.",
          "IMGSEO generates ALT text automatically based on your business name, keyword, and location inputs. The generated text follows the formula above and can be copied with one click.",
        ],
      },
      {
        h2: "ALT Text for Google Business Profile",
        paragraphs: [
          "GBP does not support custom ALT text for uploaded photos. Google generates its own description based on image recognition and surrounding content. This is why the file name matters so much for GBP — it's your primary keyword input when ALT text isn't available.",
          "For your own website, however, always write manual ALT text for every image. Your CMS (WordPress, Squarespace, Wix, etc.) will have an ALT text field for each image upload.",
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
          "Step 1 — Rename the file: Change IMG_4392.jpg to keyword-city-businessname.webp before doing anything else. This takes 10 seconds and is the single highest-impact action you can take for image SEO.",
          "Step 2 — Compress it: Target under 150KB for web images, under 500KB for Google Business Profile photos. Use IMGSEO to compress via the quality slider while previewing the size reduction in real time.",
          "Step 3 — Convert to WebP: Use WebP for all website images. For GBP, use JPG. IMGSEO handles both with a single format toggle.",
          "Step 4 — Write ALT text: Copy IMGSEO's generated ALT text and paste it into your CMS when you upload the image. For GBP, skip this step (it's not supported).",
          "Step 5 — Embed geo coordinates: Use IMGSEO's Geo Tag tool to select your business location and click 'Embed GPS in Images'. The GPS coordinates are written into the image EXIF in your browser — no third-party tools needed.",
        ],
      },
      {
        h2: "How Often to Run This Checklist",
        paragraphs: [
          "Every time you upload a new image to your website or GBP listing, run through all five steps. Set a monthly reminder to add fresh photos to your GBP — aim for 3–5 new photos per month. Google rewards active listings with higher visibility in local search.",
          "For existing images on your website, run them through IMGSEO in bulk using the ZIP download feature. Replace your old JPEGs with optimized WebP versions and update ALT text in your CMS. This is a one-time effort that compounds over time as Google re-indexes your pages.",
        ],
      },
      {
        h2: "Tracking Your Results",
        paragraphs: [
          "After optimizing your images, track your local rankings using Google Search Console (free) and Google Business Profile Insights. Look for improvements in 'Photo views' in GBP Insights — this metric often increases within 30 days of uploading optimized, geo-tagged photos.",
          "Image SEO is a long game. You may not see results in the first week, but businesses that consistently optimize their images over 3–6 months typically see meaningful improvements in local pack rankings and Google Business Profile impressions.",
        ],
      },
    ],
  },
];

const tagColors: Record<string, string> = {
  "Image SEO": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "Google Business": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Performance": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "ALT Text": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "Strategy": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

function BlogCard({ post, index }: { post: Post; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      key={post.slug}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="bg-background border rounded-2xl shadow-sm overflow-hidden"
      data-testid={`blog-card-${post.slug}`}
    >
      {/* Card header — always visible */}
      <div className="p-6 pb-4">
        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${tagColors[post.tag] ?? "bg-muted text-muted-foreground"}`}>
          {post.tag}
        </span>
        <h3 className="font-bold text-lg leading-snug mb-3">{post.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
            <span>{post.date}</span>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            data-testid={`button-expand-${post.slug}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {open ? (
              <><ChevronUp className="h-4 w-4" /> Show less</>
            ) : (
              <><ChevronDown className="h-4 w-4" /> Read article</>
            )}
          </button>
        </div>
      </div>

      {/* Full article — animated reveal */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-7 pt-2 border-t space-y-6">
              {post.body.map((section) => (
                <div key={section.h2}>
                  <h4 className="font-bold text-base mb-3 text-foreground">{section.h2}</h4>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-0">{p}</p>
                  ))}
                </div>
              ))}
              <a
                href="#tool"
                className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-primary hover:underline"
                data-testid={`link-tool-${post.slug}`}
              >
                Try IMGSEO free — optimize your images now
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
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">From the Blog</h2>
          <p className="text-muted-foreground text-lg">Actionable image SEO guides for local businesses. Click any article to read in full.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.slice(0, 3).map((post, idx) => (
            <BlogCard key={post.slug} post={post} index={idx} />
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 mt-5">
          {posts.slice(3).map((post, idx) => (
            <BlogCard key={post.slug} post={post} index={idx + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
