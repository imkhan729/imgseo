import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { existsSync } from "node:fs";

const outputDir = existsSync(join(process.cwd(), "artifacts", "imgseo", "dist", "public"))
  ? join(process.cwd(), "artifacts", "imgseo", "dist", "public")
  : join(process.cwd(), "dist", "public");
const origin = "https://imageseo.cc";

const blogPosts = [
  {
    slug: "free-geo-tagger-fast-location-seo",
    title: "How to Use a Free Geo Tagger to Dominate Local SEO Fast",
    metaTitle: "Free Geo Tagger Tool: Fast Geo Tag Images for Local SEO | IMGSEO",
    description: "Learn how to embed GPS coordinates into your photos with a browser-based free geo tag tool to provide verifiable location metadata for your business.",
    dateISO: "2025-05-15",
    body: `
      <article>
        <h1>How to Use a Free Geo Tagger to Dominate Local SEO Fast</h1>
        <p>Adding GPS metadata to your images is a practical local SEO signal. Learn how to use a free geo tagger tool to process images instantly and securely in your browser.</p>
        <section>
          <h2>Why Every Local Business Needs a Fast Geo Tag Workflow</h2>
          <p>When you upload an image to Google Business Profile or your website, Google analyzes available data. One trust signal for local relevance is GPS metadata (EXIF data). If you operate a local service in a specific city, embedding accurate location coordinates provides authentic geographic context.</p>
        </section>
        <section>
          <h2>The Benefits of Using a Free Geo Tagger</h2>
          <p>IMGSEO provides an instant, map-driven interface that embeds accurate location coordinates directly into your photo's EXIF metadata. Because this is a client-side tool, your images are never uploaded to a remote server.</p>
        </section>
        <section>
          <h2>How to Geo Tag Your Images for Maximum SEO Impact</h2>
          <ol>
            <li>Find your exact business location or service area on the interactive map.</li>
            <li>Drop the pin to capture the precise latitude and longitude coordinates.</li>
            <li>Upload your local business photos into the free geo tagger interface.</li>
            <li>Embed GPS coordinates directly into the image EXIF header.</li>
            <li>Download your geo-tagged JPEG files locally.</li>
          </ol>
        </section>
      </article>
    `
  },
  {
    slug: "image-file-names-local-seo",
    title: "Why Image File Names Are the #1 Ignored Local SEO Ranking Factor",
    metaTitle: "Image File Naming for Local SEO: Rank Higher in Google Maps & Image Search | IMGSEO",
    description: "Boost your local search rankings by optimizing image file names. Learn the proven SEO naming formula to outrank local competitors on Google.",
    dateISO: "2025-05-01",
    body: `
      <article>
        <h1>Why Image File Names Are the #1 Ignored Local SEO Ranking Factor</h1>
        <p>Most businesses use generic file names like IMG_4392.jpg. Discover the exact SEO naming structure to increase organic local traffic and Google Maps visibility.</p>
        <section>
          <h2>Why Your Camera's File Names Are Hurting Your Rankings</h2>
          <p>Google's image search algorithm reads the file name as one of the first signals it uses to understand what an image depicts. A file named <code>best-plumber-doha-qatar.jpg</code> tells Google exactly what the image depicts.</p>
        </section>
        <section>
          <h2>The Exact Formula for SEO Image File Names</h2>
          <p>The proven formula for local SEO image file names is: <code>keyword-city-businessname.format</code></p>
          <ul>
            <li>All lowercase letters with hyphens separating words</li>
            <li>Primary service keyword first</li>
            <li>City and location second</li>
            <li>Business name last</li>
          </ul>
        </section>
      </article>
    `
  },
  {
    slug: "google-business-profile-photo-optimization",
    title: "How to Optimize Google Business Profile Photos for High Local Visibility",
    metaTitle: "GBP Photo Optimization Guide: Maximize Local SEO & Google Maps Traffic | IMGSEO",
    description: "Optimize your Google Business Profile (GBP) photos to improve click-through rates and local rankings. Learn the best image sizes, formats, and geo-tagging tips.",
    dateISO: "2025-04-01",
    body: `
      <article>
        <h1>How to Optimize Google Business Profile Photos for High Local Visibility</h1>
        <p>Your GBP photos directly influence Google Maps visibility and customer conversions. Learn the exact sizes, keywords, and metadata to use for maximum visibility.</p>
        <section>
          <h2>Why Google Business Profile Photos Matter</h2>
          <p>Active photo uploads signal that your business listing is verified and operational. Uploading clear photos of storefronts, services, and completed jobs builds relevance in local search.</p>
        </section>
        <section>
          <h2>Recommended Image Sizes for GBP</h2>
          <p>Google recommends minimum dimensions of 720x720px for square images. Compress images to under 1MB for fast loading across mobile connections.</p>
        </section>
      </article>
    `
  },
  {
    slug: "webp-vs-jpg-local-seo",
    title: "WebP vs JPG for SEO: Which Image Format Ranks Better in Google?",
    metaTitle: "WebP vs JPG for SEO: Speed Up Your Site & Improve Core Web Vitals | IMGSEO",
    description: "Switching to WebP improves site speed and Core Web Vitals. Discover why next-gen image formats are critical for local business SEO and search engine rankings.",
    dateISO: "2025-03-01",
    body: `
      <article>
        <h1>WebP vs JPG for SEO: Which Image Format Ranks Better in Google?</h1>
        <p>WebP images load up to 34% faster than JPG, directly improving Core Web Vitals. Find out how faster image loading speeds boost local SEO and mobile rankings.</p>
        <section>
          <h2>What Is WebP?</h2>
          <p>WebP is a modern image format developed by Google that provides superior lossless and lossy compression for images on the web, significantly reducing page weight.</p>
        </section>
        <section>
          <h2>Core Web Vitals Impact</h2>
          <p>Serving WebP images directly improves Largest Contentful Paint (LCP) by minimizing image byte transfer sizes.</p>
        </section>
      </article>
    `
  },
  {
    slug: "alt-text-local-seo-formula",
    title: "Writing Image ALT Text for SEO: The Formula That Actually Works",
    metaTitle: "Image ALT Text Best Practices for Local SEO & Accessibility | IMGSEO",
    description: "Write optimized image ALT text to improve local search visibility and accessibility. Learn the exact keyword formula to drive high-quality organic traffic.",
    dateISO: "2025-02-01",
    body: `
      <article>
        <h1>Writing Image ALT Text for SEO: The Formula That Actually Works</h1>
        <p>ALT text is essential for accessibility and search engine context. Learn the formula to describe images accurately for screen readers and Google.</p>
        <section>
          <h2>The Role of Alt Text</h2>
          <p>Alt text describes the visual content of an image for assistive technologies and search engine crawlers when visual elements cannot be rendered.</p>
        </section>
        <section>
          <h2>Best Practice Formula</h2>
          <p>Keep alt text descriptive, concise (under 125 characters), and naturally integrated with surrounding page context without keyword stuffing.</p>
        </section>
      </article>
    `
  },
  {
    slug: "image-seo-checklist-local-business",
    title: "The Ultimate 5-Minute Image SEO Checklist for Local Businesses",
    metaTitle: "Complete Image SEO Checklist: Optimize Photos for Local Search | IMGSEO",
    description: "Boost your organic visibility with our 5-minute image SEO checklist. Cover file naming, WebP compression, ALT text, and GPS geo-tagging all in one workflow.",
    dateISO: "2025-01-01",
    body: `
      <article>
        <h1>The Ultimate 5-Minute Image SEO Checklist for Local Businesses</h1>
        <p>Follow this comprehensive 5-step image optimization checklist before uploading photos: descriptive filenames, WebP conversion, compression, alt text, and GPS metadata.</p>
        <section>
          <h2>5-Step Workflow</h2>
          <ol>
            <li>Rename file with descriptive keywords and hyphens.</li>
            <li>Compress image to achieve optimal file size.</li>
            <li>Convert to WebP format for web delivery.</li>
            <li>Write accessible, descriptive alt text.</li>
            <li>Embed GPS metadata for location-relevant photos.</li>
          </ol>
        </section>
      </article>
    `
  }
];

const pages = {
  "/": {
    title: "IMGSEO | Free Image Optimizer, Geo Tagger & WebP Converter for SEO",
    description: "Compress, convert, and geotag images in your browser with free client-side tools for lighter files, useful metadata, and privacy-conscious publishing.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>Free Image SEO Tools: Converter, Compressor & Geo Tagger</h1>
        <p>Optimize website images locally in your browser. Convert to WebP, compress JPG and PNG files, embed GPS EXIF metadata, and generate SEO-optimized filenames without server uploads.</p>
        <section>
          <h2>Core Image SEO Utilities</h2>
          <ul>
            <li><a href="/free-webp-converter">Free WebP Converter</a> — Convert JPG and PNG images to WebP format instantly.</li>
            <li><a href="/free-online-image-compressor">Free Image Compressor</a> — Reduce image weight with adjustable quality controls.</li>
            <li><a href="/free-geo-tagger">Free Geo Tagger</a> — Embed GPS coordinates into photo EXIF headers locally.</li>
            <li><a href="/image-seo">Image SEO Guide</a> — Practical best practices for alt text, dimensions, and Core Web Vitals.</li>
          </ul>
        </section>
      </main>
    `
  },
  "/free-webp-converter": {
    title: "Free WebP Converter Online | JPG & PNG to WebP | IMGSEO",
    description: "Convert JPG and PNG images to WebP in your browser. Reduce file size for faster pages without uploading your files.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>Free WebP Converter Online</h1>
        <p>Convert JPG, PNG, and other image formats to WebP directly in your browser. Improve Core Web Vitals (LCP) and reduce page weight without uploading files to remote servers.</p>
        <section>
          <h2>Conversion Paths</h2>
          <ul>
            <li><a href="/jpg-to-webp">JPG to WebP Converter</a> — Dedicated photographic JPEG to WebP conversion.</li>
            <li><a href="/png-to-webp">PNG to WebP Converter</a> — Convert graphic assets while preserving alpha transparency.</li>
          </ul>
        </section>
        <section>
          <h2>Why WebP Matters for SEO</h2>
          <p>WebP delivers 25% to 34% smaller file sizes compared to JPEG at equivalent visual quality, speeding up load times across mobile devices.</p>
        </section>
      </main>
    `
  },
  "/free-geo-tagger": {
    title: "Free Geo Tagger | Add GPS Metadata to Photos | IMGSEO",
    description: "Add GPS coordinates and optional descriptions to image metadata in your browser. Process photos locally with IMGSEO's free geo tagger.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>Free Geo Tagger Tool</h1>
        <p>Embed latitude, longitude, and location metadata into JPEG photo EXIF headers directly in your browser. 100% private with no server file retention.</p>
        <section>
          <h2>How to Geo Tag Images</h2>
          <ol>
            <li>Select location on the interactive map or enter coordinates.</li>
            <li>Upload JPEG images to the client-side tool.</li>
            <li>Embed GPS coordinates and download updated images.</li>
          </ol>
        </section>
      </main>
    `
  },
  "/free-online-image-compressor": {
    title: "Free Online Image Compressor | Compress Images in Browser | IMGSEO",
    description: "Compress JPG, PNG, and WebP images online with quality controls and local browser processing. No image upload required.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>Free Online Image Compressor</h1>
        <p>Compress JPG, PNG, and WebP images in your browser. Balance visual clarity and file size for faster web performance and lower bounce rates.</p>
        <section>
          <h2>Compression Features</h2>
          <ul>
            <li>Batch image compression with instant ZIP download</li>
            <li>Adjustable quality slider for precise byte savings</li>
            <li>100% private browser processing with zero server uploads</li>
          </ul>
        </section>
      </main>
    `
  },
  "/jpg-to-webp": {
    title: "JPG to WebP Converter | Free Online Tool | IMGSEO",
    description: "Convert JPG images to WebP online in your browser. Choose quality, compare file sizes, and download without uploading your files.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>JPG to WebP Converter</h1>
        <p>Convert photographic JPG/JPEG files to lightweight WebP assets. Reduce bandwidth overhead while maintaining crisp visual fidelity.</p>
        <section>
          <h2>When to Convert JPG to WebP</h2>
          <p>WebP provides superior compression for photographic imagery, preventing DCT compression blockiness and accelerating Largest Contentful Paint.</p>
        </section>
      </main>
    `
  },
  "/png-to-webp": {
    title: "PNG to WebP Converter | Free Online Tool | IMGSEO",
    description: "Convert PNG images to WebP online in your browser. Keep transparency where supported and download locally processed files.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>PNG to WebP Converter</h1>
        <p>Convert PNG graphics, screenshots, and logos to WebP while preserving full alpha channel transparency.</p>
        <section>
          <h2>Transparency Preservation</h2>
          <p>WebP supports both lossy and lossless alpha transparency, slashing PNG-24 file sizes by up to 70%.</p>
        </section>
      </main>
    `
  },
  "/compress-jpg": {
    title: "Compress JPG Images Online | Free Browser Tool | IMGSEO",
    description: "Compress JPG images online with adjustable quality and local browser processing. Download smaller JPG files without uploading them.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>Compress JPG Images Online</h1>
        <p>Optimize JPEG images locally. Eliminate unnecessary metadata and tune quantization matrices for optimal web delivery.</p>
      </main>
    `
  },
  "/compress-image-to-kb": {
    title: "Compress Image to 20KB, 50KB, 100KB, 200KB Online | IMGSEO",
    description: "Compress JPG, PNG, and WebP images to exact target sizes (20KB, 50KB, 100KB, 200KB) in your browser. Free batch compression with zero uploads.",
    schemaType: "WebApplication",
    body: `
      <main>
        <h1>Compress Image to Exact KB Online</h1>
        <p>Reduce photo file sizes to exact target limits like 20KB, 50KB, 100KB, or 200KB directly in your browser. 100% private, free batch processing with no server uploads.</p>
        <section>
          <h2>Features</h2>
          <ul>
            <li>Precise target size control (20KB, 50KB, 100KB, 200KB, 500KB presets)</li>
            <li>Client-side iterative binary search compression algorithm</li>
            <li>Batch upload and instant ZIP archive download</li>
            <li>100% private in-browser image processing</li>
          </ul>
        </section>
      </main>
    `
  },
  "/image-seo": {
    title: "Image SEO Guide: Alt Text, File Names & Performance | IMGSEO",
    description: "Learn practical image SEO: descriptive file names, useful alt text, responsive dimensions, WebP, crawlability, and performance.",
    schemaType: "Article",
    body: `
      <main>
        <article>
          <h1>Image SEO: The Practical Guide to Alt Text, Dimensions, and Next-Gen Formats</h1>
          <p>Image SEO is the practice of giving visual assets the right page context, descriptive alt text, crawlable URLs, and efficient modern file formats.</p>
          <section>
            <h2>1. Write Alt Text for Accessibility and Context</h2>
            <p>Describe what matters in the image for users who cannot see it. Avoid keyword stuffing and maintain natural language.</p>
          </section>
          <section>
            <h2>2. Use Descriptive, Hyphenated File Names</h2>
            <p>Replace generic camera filenames with concise, hyphenated keywords that accurately reflect image content.</p>
          </section>
          <section>
            <h2>3. Serve Next-Gen Formats (WebP / AVIF)</h2>
            <p>Convert legacy JPG and PNG assets to WebP to reduce byte transfer and improve Core Web Vitals (LCP).</p>
          </section>
        </article>
      </main>
    `
  },
  "/privacy": {
    title: "Privacy Policy | IMGSEO",
    description: "Learn how IMGSEO processes images locally in your browser and which third-party map and location services the geo tagger uses.",
    schemaType: "WebPage",
    body: `
      <main>
        <h1>Privacy Policy</h1>
        <p>IMGSEO operates client-side image optimization utilities. Your photos and metadata are processed locally in your browser memory and are never transmitted, stored, or logged on our servers.</p>
      </main>
    `
  },
  "/terms": {
    title: "Terms of Use | IMGSEO",
    description: "Review the terms for using IMGSEO's browser-based image conversion, compression, and metadata tools.",
    schemaType: "WebPage",
    body: `
      <main>
        <h1>Terms of Use</h1>
        <p>Review the terms of use for IMGSEO browser-based utilities. All tools are provided free of charge for personal and commercial website optimization.</p>
      </main>
    `
  }
};

// Add blog posts to pages map
for (const post of blogPosts) {
  pages[`/blog/${post.slug}`] = {
    title: post.metaTitle,
    description: post.description,
    schemaType: "Article",
    dateISO: post.dateISO,
    body: `<main>${post.body}</main>`
  };
}

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const template = await readFile(join(outputDir, "index.html"), "utf8");

// Clean base template: extract base shell without hardcoded tags
const cleanTemplate = template
  .replace(/<title>[\s\S]*?<\/title>/i, "{{TITLE}}")
  .replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i, "{{DESCRIPTION}}")
  .replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i, "{{CANONICAL}}")
  .replace(/<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i, "{{OG_URL}}")
  .replace(/<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i, "{{OG_TITLE}}")
  .replace(/<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i, "{{OG_DESC}}")
  .replace(/<meta\s+name=["']twitter:url["']\s+content=["'][^"']*["']\s*\/?>/i, "{{TWITTER_URL}}")
  .replace(/<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i, "{{TWITTER_TITLE}}")
  .replace(/<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i, "{{TWITTER_DESC}}")
  .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i, "{{SCHEMA}}")
  .replace(/<div\s+id=["']root["']>[\s\S]*?<\/div>/i, "{{ROOT_CONTENT}}");

for (const [route, page] of Object.entries(pages)) {
  const canonical = `${origin}${route === "/" ? "/" : route}`;
  const titleTag = `<title>${escapeHtml(page.title)}</title>`;
  const descTag = `<meta name="description" content="${escapeHtml(page.description)}" />`;
  const canonicalTag = `<link rel="canonical" href="${canonical}" />`;
  const ogUrlTag = `<meta property="og:url" content="${canonical}" />`;
  const ogTitleTag = `<meta property="og:title" content="${escapeHtml(page.title)}" />`;
  const ogDescTag = `<meta property="og:description" content="${escapeHtml(page.description)}" />`;
  const twitterUrlTag = `<meta name="twitter:url" content="${canonical}" />`;
  const twitterTitleTag = `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`;
  const twitterDescTag = `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`;

  let schemaObj;
  if (page.schemaType === "Article") {
    schemaObj = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": page.title,
      "description": page.description,
      "url": canonical,
      "datePublished": page.dateISO || "2026-09-23",
      "dateModified": "2026-09-23",
      "author": {
        "@type": "Organization",
        "name": "IMGSEO Team",
        "url": origin
      },
      "publisher": {
        "@type": "Organization",
        "name": "IMGSEO",
        "url": origin,
        "logo": {
          "@type": "ImageObject",
          "url": `${origin}/favicon.svg`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonical
      }
    };
  } else if (page.schemaType === "WebApplication") {
    schemaObj = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": page.title,
      "url": canonical,
      "description": page.description,
      "applicationCategory": "UtilitiesApplication, SEOApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires HTML5 Canvas and JavaScript",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      }
    };
  } else {
    schemaObj = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": page.title,
      "url": canonical,
      "description": page.description
    };
  }

  const schemaTag = `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;
  const rootContent = `<div id="root">${page.body}</div>`;

  const html = cleanTemplate
    .replace("{{TITLE}}", titleTag)
    .replace("{{DESCRIPTION}}", descTag)
    .replace("{{CANONICAL}}", canonicalTag)
    .replace("{{OG_URL}}", ogUrlTag)
    .replace("{{OG_TITLE}}", ogTitleTag)
    .replace("{{OG_DESC}}", ogDescTag)
    .replace("{{TWITTER_URL}}", twitterUrlTag)
    .replace("{{TWITTER_TITLE}}", twitterTitleTag)
    .replace("{{TWITTER_DESC}}", twitterDescTag)
    .replace("{{SCHEMA}}", schemaTag)
    .replace("{{ROOT_CONTENT}}", rootContent);

  const relativeDir = route === "/" ? "" : route.replace(/^\//, "");
  const targetDir = join(outputDir, relativeDir);
  await mkdir(targetDir, { recursive: true });
  await writeFile(join(targetDir, "index.html"), html, "utf8");
}

// Generate 404.html
const notFoundHtml = cleanTemplate
  .replace("{{TITLE}}", "<title>Page Not Found | IMGSEO</title>")
  .replace("{{DESCRIPTION}}", '<meta name="description" content="The requested IMGSEO page could not be found." />')
  .replace("{{CANONICAL}}", `<link rel="canonical" href="${origin}/404.html" />`)
  .replace("{{OG_URL}}", `<meta property="og:url" content="${origin}/404.html" />`)
  .replace("{{OG_TITLE}}", '<meta property="og:title" content="Page Not Found | IMGSEO" />')
  .replace("{{OG_DESC}}", '<meta property="og:description" content="The requested IMGSEO page could not be found." />')
  .replace("{{TWITTER_URL}}", `<meta name="twitter:url" content="${origin}/404.html" />`)
  .replace("{{TWITTER_TITLE}}", '<meta name="twitter:title" content="Page Not Found | IMGSEO" />')
  .replace("{{TWITTER_DESC}}", '<meta name="twitter:description" content="The requested IMGSEO page could not be found." />')
  .replace("{{SCHEMA}}", "")
  .replace("{{ROOT_CONTENT}}", '<div id="root"><main><h1>Page Not Found</h1><p>The requested page could not be found.</p><p><a href="/">Return to IMGSEO Home</a></p></main></div>');

await writeFile(join(outputDir, "404.html"), notFoundHtml, "utf8");

console.log(`Successfully prerendered ${Object.keys(pages).length} routes + 404.html to ${outputDir}`);
