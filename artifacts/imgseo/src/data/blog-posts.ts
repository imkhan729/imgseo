export interface BlogSection {
  h2: string;
  paragraphs?: string[];
  list?: string[];
  tip?: string;
  code?: string;
}

export interface BlogPost {
  slug: string;
  tag: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  readTime: string;
  date: string;
  dateISO: string;
  author: string;
  body: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "image-file-names-local-seo",
    tag: "Image SEO",
    title: "Why Image File Names Are the #1 Ignored Local SEO Factor",
    metaTitle: "Image File Names for Local SEO: The Complete Guide (2025)",
    metaDescription: "Most local businesses upload images with names like IMG_4392.jpg — costing them Google rankings. Learn the exact SEO file naming formula to rank higher in local search.",
    excerpt: "Most local businesses upload photos straight from their camera with names like IMG_4392.jpg. Here's why that's costing them rankings — and how to fix it in 60 seconds.",
    readTime: "4 min read",
    date: "May 2025",
    dateISO: "2025-05-01",
    author: "IMGSEO Team",
    body: [
      {
        h2: "Why Your Camera's File Names Are Hurting Your Rankings",
        paragraphs: [
          "When your phone takes a photo, it saves it as something like IMG_4392.jpg or DCIM_20250502.jpg. These file names mean absolutely nothing to Google. When you upload them to your website or Google Business Profile, you're giving up one of the easiest keyword signals available to you — completely for free.",
          "Google's image search algorithm reads the file name as one of the first signals it uses to understand what an image depicts. Before it even analyses the visual content of the image, it reads the file name. A file named best-plumber-doha-qatar.jpg tells Google exactly who this business is, what they do, and where they operate. IMG_4392.jpg tells Google nothing.",
          "In competitive local markets — where dozens of plumbers, electricians, or restaurants are fighting for the same search results — every signal matters. The businesses ranking at the top of Google Images and Google Maps are almost always the ones who have optimized every available signal, including file names.",
        ],
      },
      {
        h2: "The Exact Formula for SEO Image File Names",
        paragraphs: [
          "The proven formula for local SEO image file names is straightforward:",
        ],
        code: "keyword-city-businessname.format",
        list: [
          "All lowercase letters — uppercase can cause issues with some servers",
          "Words separated by hyphens (not underscores, not spaces)",
          "Primary service keyword first — it carries the most weight",
          "City and country/state second — this is your local signal",
          "Business name last — helps with brand searches",
          "Use .webp format whenever possible for better Core Web Vitals",
        ],
        tip: "Avoid underscores. Google treats them as joining words rather than separating them, so 'best_plumber' reads as 'bestplumber', not 'best plumber'. Always use hyphens.",
      },
      {
        h2: "Real Examples of SEO-Optimised Image File Names",
        paragraphs: [
          "Here are real-world examples of how to rename images for different local business types:",
        ],
        list: [
          "Plumber in Doha: emergency-plumber-doha-qatar-quickfix.webp",
          "Restaurant in London: best-italian-restaurant-london-soho-bella-vista.webp",
          "Dentist in Dubai: affordable-dentist-dubai-marina-smileclinic.webp",
          "Electrician in Manchester: licensed-electrician-manchester-uk-sparksco.webp",
          "Cleaning service in Riyadh: professional-cleaning-service-riyadh-cleanpro.webp",
        ],
      },
      {
        h2: "How to Rename Your Images Before Uploading",
        paragraphs: [
          "The fastest approach: use IMGSEO. Enter your business name, keyword, and location — the tool instantly generates a perfectly formatted SEO file name, converts your image to WebP, compresses it, and lets you download it with the new name applied. The whole process takes under 60 seconds per image, and you can process dozens of images at once using the bulk ZIP download.",
          "For Google Business Profile specifically, the file name is the primary keyword signal because GBP does not display ALT text to users or Google's indexer. Getting the file name right before uploading is the single most impactful step you can take for local image SEO.",
        ],
        tip: "Rename your images BEFORE uploading. Once an image is on your server or GBP, renaming it requires re-uploading — which resets any engagement signals the image has accumulated.",
      },
      {
        h2: "How Often Should You Rename and Re-Upload Images?",
        paragraphs: [
          "For new images: always rename before the first upload. For existing images on your website: if your pages are performing poorly in image search, batch-rename and replace the top 10–20 images on your most important pages. For GBP: each new photo should be renamed and optimised before uploading.",
          "Track your results using Google Search Console's Performance report filtered by 'Image' search type. After 4–6 weeks of consistent optimisation, you should see measurable improvements in image impressions and clicks.",
        ],
      },
    ],
  },
  {
    slug: "google-business-profile-photo-optimization",
    tag: "Google Business",
    title: "How to Optimize Google Business Profile Photos for Maximum Local Visibility",
    metaTitle: "GBP Photo Optimization Guide: Rank Higher in Google Maps (2025)",
    metaDescription: "Your Google Business Profile photos directly influence local rankings and click-through rate. Learn exactly which photos to upload, the right sizes, and how to name them for SEO.",
    excerpt: "Your GBP photos influence both rankings and click-through rate. We break down exactly which images to upload, what sizes to use, and how to name them for maximum impact.",
    readTime: "6 min read",
    date: "Apr 2025",
    dateISO: "2025-04-01",
    author: "IMGSEO Team",
    body: [
      {
        h2: "Why Google Business Profile Photos Directly Affect Your Rankings",
        paragraphs: [
          "Google Business Profile photos influence your local search ranking in two measurable ways. First, they signal to Google that your listing is actively maintained — fresh content gets rewarded with higher visibility. Second, they directly affect the click-through rate of your listing, which is itself a ranking signal. Businesses with 10 or more high-quality photos get 35% more clicks than those with fewer than 3.",
          "Google also uses image content recognition (AI vision) to understand what your images show. A photo of a plumber working on pipes confirms your business type to the algorithm. A blurry storefront photo contributes little. Both quality and relevance matter for your local ranking.",
        ],
      },
      {
        h2: "Which Photos to Upload to Google Business Profile",
        paragraphs: [
          "Upload a minimum set of photos to start, then build from there:",
        ],
        list: [
          "Cover photo (1080×608px minimum) — your most important image, appears first in search",
          "Logo (250×250px minimum) — helps with brand recognition",
          "3–5 interior photos — shows your workspace or store environment",
          "3–5 exterior photos — helps customers find your location",
          "Photos of your products or completed work — the most valuable for service businesses",
          "Team photos — builds trust and humanises your brand",
        ],
        tip: "For service businesses (plumbers, electricians, cleaners), 'work in progress' and 'completed job' photos perform exceptionally well. They demonstrate your expertise and confirm your business type to Google's AI.",
      },
      {
        h2: "The Right Image Sizes for Google Business Profile",
        paragraphs: [
          "Google has specific requirements for GBP photos. Images must be at least 720×720px for square images, or 720×540px for landscape images. The maximum file size is 5MB, but for optimal loading speed, aim for under 1MB.",
          "IMGSEO includes a dedicated 'Google Business (720×720)' resize preset that crops and resizes your image to the exact recommended dimensions in one click, then compresses it for the optimal file size.",
        ],
      },
      {
        h2: "How to Name Your GBP Photos for Maximum SEO Impact",
        paragraphs: [
          "Before uploading any photo to GBP, rename it with your keyword and location. Google cannot read ALT text for GBP images — the file name is your only keyword signal. This single step is the most impactful action you can take.",
        ],
        code: "service-city-businessname.jpg",
        list: [
          "Use JPEG format for GBP (not WebP — GBP doesn't officially support WebP)",
          "Include your primary service keyword in the file name",
          "Include your city and country",
          "Keep the file name under 100 characters",
        ],
        tip: "IMGSEO can generate both a WebP version (for your website) and a JPEG version (for GBP) from the same image. Run the tool twice with different format settings, or use JPEG as your default when processing GBP photos.",
      },
      {
        h2: "How Often to Add New GBP Photos",
        paragraphs: [
          "Add new photos at least once a month. Google's algorithm rewards freshness. Businesses that upload photos regularly rank higher in local packs than dormant listings. Aim for 3–5 new photos per month minimum.",
          "Set a recurring monthly reminder to photograph your work, add seasonal decorations, or capture your team in action. Each photo upload is a signal that your business is active and engaged — exactly what Google wants to show to potential customers.",
        ],
      },
      {
        h2: "Geo Tagging GBP Photos for an Extra Local Relevance Signal",
        paragraphs: [
          "Embed GPS coordinates into your photos before uploading to GBP. Google can read the EXIF GPS data and use it as an additional location relevance signal. Use IMGSEO's Geo Tag tool to select your exact business location on the map, then click 'Embed GPS in Images' — the coordinates are written directly into the image EXIF in your browser, with no upload to any external server required.",
          "For businesses in competitive local markets (multiple similar businesses in the same city), geo-tagged photos provide an edge. They confirm to Google that the images were taken at your actual business location, reinforcing local relevance signals.",
        ],
      },
    ],
  },
  {
    slug: "webp-vs-jpg-local-seo",
    tag: "Performance",
    title: "WebP vs JPG for Local Business Websites: Which Format Ranks Better?",
    metaTitle: "WebP vs JPG for Local SEO: Which Image Format Ranks Higher in 2025?",
    metaDescription: "WebP images load up to 34% faster than JPG and directly improve your Google Core Web Vitals score — a confirmed ranking factor. Here's how to switch without breaking anything.",
    excerpt: "WebP images load up to 34% faster than JPG. Google's Core Web Vitals score directly affects local ranking. Here's how to switch formats without breaking your site.",
    readTime: "5 min read",
    date: "Mar 2025",
    dateISO: "2025-03-01",
    author: "IMGSEO Team",
    body: [
      {
        h2: "What Is WebP and Why Did Google Create It?",
        paragraphs: [
          "WebP is a modern image format developed by Google specifically to make the web faster. It uses advanced compression algorithms that deliver significantly smaller file sizes than JPEG and PNG at equivalent visual quality. A typical 500KB JPEG can be converted to WebP at equivalent quality and drop to 320–350KB — a 30–40% reduction. For a web page with 10 images, that's potentially several megabytes of savings per page load.",
          "Google introduced WebP as part of its broader effort to speed up the web. It's not coincidental that the company that created WebP also controls the world's dominant search engine — faster pages rank higher, and WebP makes pages faster.",
        ],
      },
      {
        h2: "How Core Web Vitals Connect to Local Search Rankings",
        paragraphs: [
          "Google uses Core Web Vitals (CWV) as a confirmed ranking factor for all searches, including local. Your local search ranking depends primarily on relevance, proximity, and prominence — but page experience (which includes CWV) affects your ranking as a tiebreaker in competitive markets.",
          "The most relevant Core Web Vital for images is LCP (Largest Contentful Paint), which measures how quickly the largest visible element loads — usually a hero image or a product photo. If that image is a 2MB JPEG, your LCP will be slow. Converting it to WebP at 80% quality typically gets it under 500KB, making it much easier to achieve an LCP below the 2.5-second 'Good' threshold.",
        ],
        tip: "Test your current LCP score at pagespeed.web.dev. If your score is below 90 on mobile, image format and compression is almost always a contributing factor.",
      },
      {
        h2: "WebP Browser Support in 2025",
        paragraphs: [
          "As of 2025, WebP is supported by 97.3% of all browsers globally, including Safari (which added support in 2020). There is no meaningful reason to use JPEG over WebP for any web-facing image. The only exception is if your CMS or platform explicitly doesn't support WebP uploads.",
        ],
        list: [
          "Chrome: WebP supported since 2010",
          "Firefox: WebP supported since 2019",
          "Safari: WebP supported since Safari 14 (2020)",
          "Edge: WebP supported since 2018",
          "Mobile browsers: WebP supported across all major browsers",
        ],
      },
      {
        h2: "When to Use JPEG Instead of WebP",
        paragraphs: [
          "There are specific situations where JPEG is the better choice:",
        ],
        list: [
          "Google Business Profile photos — GBP doesn't officially support WebP uploads, use JPEG",
          "Email marketing images — some email clients don't render WebP",
          "Social media uploads — most platforms convert images anyway, JPEG is safer",
          "CMS platforms that strip WebP support — check before switching",
        ],
        tip: "Use IMGSEO to create both formats from the same source image. Download WebP for your website, JPEG for GBP and social media. Switch the format selector and run the tool again — takes 10 seconds.",
      },
      {
        h2: "How to Convert Your Existing Images to WebP",
        paragraphs: [
          "IMGSEO converts JPG and PNG images to WebP entirely in your browser using the HTML5 Canvas API. Upload your images, select WebP as the output format, set quality to 80%, and download. The file name is preserved with the new .webp extension.",
          "For bulk conversions, use the Download All ZIP feature to process your entire image library at once. A library of 50 JPEG images can be converted to WebP in under 2 minutes with no quality loss visible to the naked eye.",
        ],
      },
    ],
  },
  {
    slug: "alt-text-local-seo-formula",
    tag: "ALT Text",
    title: "Writing ALT Text for Local SEO: The Formula That Actually Works",
    metaTitle: "ALT Text for Local SEO: The Formula That Drives Rankings (2025)",
    metaDescription: "ALT text is free ranking real estate that most local businesses ignore. Learn the exact formula for writing ALT text that boosts Google image rankings and improves accessibility.",
    excerpt: "ALT text is free ranking real estate — and almost no local business uses it correctly. The exact formula we use to generate ALT text that drives image search traffic.",
    readTime: "3 min read",
    date: "Feb 2025",
    dateISO: "2025-02-01",
    author: "IMGSEO Team",
    body: [
      {
        h2: "What ALT Text Is — and Why It Matters for Local SEO",
        paragraphs: [
          "ALT (alternative) text is an HTML attribute added to image tags that describes what the image shows. It serves three purposes: screen readers read it aloud for visually impaired users (accessibility), Google reads it to understand image content (SEO), and browsers display it if an image fails to load.",
          "For local SEO, ALT text is one of the most underutilized ranking tools available. Every image on your website is an opportunity to tell Google 'this image is related to [service] in [city]' — and most local businesses either leave it blank or write something useless like 'photo1' or 'image'. Both of those are missed opportunities.",
        ],
      },
      {
        h2: "The ALT Text Formula for Local SEO",
        paragraphs: [
          "The formula that consistently performs in local image search is:",
        ],
        code: "[Action] [service keyword] in [city, country] by [business name]",
        list: [
          "Start with a descriptive action word: 'Professional', 'Emergency', 'Certified', 'Licensed'",
          "Include your primary service keyword exactly as people search for it",
          "Add your city and country/state for local relevance",
          "End with your business name for brand association",
          "Keep it under 125 characters total",
          "Write naturally — Google penalises keyword stuffing in ALT text",
        ],
        tip: "Write for humans first, search engines second. If it reads awkwardly when spoken aloud, rewrite it. Screen reader users hear every word of your ALT text.",
      },
      {
        h2: "Real ALT Text Examples for Local Businesses",
        paragraphs: ["Here are industry-specific examples following the formula:"],
        list: [
          "Plumber: 'Emergency plumbing repair in Doha, Qatar by QuickFix Plumbing'",
          "Restaurant: 'Fresh handmade pasta at best Italian restaurant in London Soho by Bella Vista'",
          "Dentist: 'Affordable teeth whitening in Dubai Marina by Smile Clinic dental team'",
          "Electrician: 'Licensed electrician installing EV charger in Manchester UK by SparksCo'",
          "Cleaner: 'Professional end-of-tenancy cleaning in Riyadh Saudi Arabia by CleanPro'",
        ],
      },
      {
        h2: "ALT Text for Google Business Profile — Important Difference",
        paragraphs: [
          "Google Business Profile does not support custom ALT text for uploaded photos. Google generates its own description based on image recognition and surrounding content. This is why the file name matters so much for GBP — it's your primary keyword input when ALT text isn't available.",
          "For your own website, always write manual ALT text for every image. Your CMS (WordPress, Squarespace, Wix, etc.) will have a dedicated ALT text field for each image upload. IMGSEO generates compliant ALT text automatically from your business name, keyword, and location — copy it with one click.",
        ],
      },
      {
        h2: "Common ALT Text Mistakes to Avoid",
        paragraphs: ["These are the most common errors that hurt rankings:"],
        list: [
          "Leaving ALT text blank — Google treats blank ALT as 'decorative', ignores for SEO",
          "Keyword stuffing: 'plumber plumbing pipe repair plumber London UK plumber' — Google penalises this",
          "Writing the file name as ALT: 'IMG_4392.jpg' — provides zero context",
          "Using generic descriptions: 'a photo of a man' — misses the SEO opportunity",
          "Making it too long: over 125 characters may be truncated by some screen readers",
        ],
      },
    ],
  },
  {
    slug: "image-seo-checklist-local-business",
    tag: "Strategy",
    title: "The 5-Minute Image SEO Checklist Every Local Business Owner Should Use",
    metaTitle: "5-Minute Image SEO Checklist for Local Businesses (2025 Edition)",
    metaDescription: "A simple 5-step image SEO checklist every local business should run before uploading any photo to their website or Google Business Profile. Takes 5 minutes, improves rankings.",
    excerpt: "Before uploading any image to your website or GBP, run through this 5-step checklist. It takes 5 minutes and can dramatically improve your local rankings.",
    readTime: "3 min read",
    date: "Jan 2025",
    dateISO: "2025-01-01",
    author: "IMGSEO Team",
    body: [
      {
        h2: "Why You Need an Image SEO Checklist",
        paragraphs: [
          "Most local business owners upload photos without any optimisation. They take a photo on their phone, email it to themselves, and upload it directly with the camera-generated file name, no ALT text, no compression, and no GPS coordinates. Every step they skip is a lost ranking opportunity.",
          "The good news: optimising an image properly takes less than 5 minutes. The five steps below can be done entirely inside IMGSEO, in your browser, with no account or software required.",
        ],
      },
      {
        h2: "The Complete 5-Step Image SEO Checklist",
        list: [
          "Step 1 — Rename the file: Change IMG_4392.jpg to keyword-city-businessname.webp before doing anything else. This single step takes 10 seconds and is the highest-impact action in image SEO. Use IMGSEO's SEO Text tab to generate the perfect file name instantly.",
          "Step 2 — Compress it: Target under 150KB for web page images, under 500KB for Google Business Profile photos. Use IMGSEO's quality slider to find the balance between file size and visual quality. Most images compress well at 75–85% quality.",
          "Step 3 — Convert to WebP: Use WebP for all website images (30–50% smaller than JPEG). For GBP, use JPEG. IMGSEO handles both with a single format toggle — takes 5 seconds.",
          "Step 4 — Write ALT text: Copy IMGSEO's generated ALT text from the SEO Text tab and paste it into your CMS when you upload the image. For WordPress: click the image in the media library and paste in the 'Alt text' field.",
          "Step 5 — Embed GPS coordinates: Switch to the Geo Tag tab in IMGSEO, search for your business location on the map, and click 'Embed GPS in Images'. The GPS coordinates are written into the image EXIF in your browser — no third-party tools, no uploads.",
        ],
      },
      {
        h2: "How to Run This Checklist in Under 5 Minutes",
        paragraphs: [
          "Open IMGSEO in your browser and upload your images. In the SEO Text tab, enter your business name, keyword, and location — all four outputs (file name, ALT text, title, caption) are generated instantly. Switch to the Geo Tag tab and pin your business location on the map. Click 'Embed GPS in Images' to get your geo-tagged JPEG. Download the ZIP for all images at once.",
          "The entire process for a batch of 10 images takes 3–4 minutes. Compare that to the manual alternative (separate tools for compression, format conversion, file renaming, and EXIF editing) which would take 30–45 minutes for the same set of images.",
        ],
        tip: "Save IMGSEO as a browser bookmark called 'Image SEO' and run every photo through it before uploading anywhere — your website, GBP, social media, or anywhere else online.",
      },
      {
        h2: "How Often Should You Run This Checklist?",
        paragraphs: [
          "Every single time you upload a new image — no exceptions. Set a recurring monthly reminder to add 3–5 new optimised photos to your Google Business Profile. Google rewards active listings with higher visibility in local search. Businesses that add photos monthly consistently outperform dormant listings in the same category.",
          "For existing images already on your website: run your top 5 pages through Google PageSpeed Insights and identify the images with the worst load times. Batch these through IMGSEO, replace them on your site, and update the ALT text in your CMS. This is a one-time effort with lasting ranking benefits.",
        ],
      },
      {
        h2: "Tracking Results After Image SEO Optimisation",
        paragraphs: [
          "Track your results using Google Search Console (free). In the Performance report, change the Search type filter to 'Image'. Look for increases in impressions and clicks for your target keywords over the following 4–8 weeks.",
          "For GBP specifically, check 'Photo views' in Google Business Profile Insights. This metric often shows improvement within 30 days of uploading optimised, geo-tagged photos. Businesses that consistently optimise their images over 3–6 months typically see meaningful improvements in local pack rankings and map impressions.",
        ],
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
