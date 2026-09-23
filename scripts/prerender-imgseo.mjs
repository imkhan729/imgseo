import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { existsSync } from "node:fs";

const outputDir = existsSync(join(process.cwd(), "artifacts", "imgseo", "dist", "public"))
  ? join(process.cwd(), "artifacts", "imgseo", "dist", "public")
  : join(process.cwd(), "dist", "public");
const origin = "https://imageseo.cc";

const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

// Dynamically load blogPosts from TypeScript data file
const blogPostsPath = existsSync(join(process.cwd(), "artifacts", "imgseo", "src", "data", "blog-posts.ts"))
  ? join(process.cwd(), "artifacts", "imgseo", "src", "data", "blog-posts.ts")
  : join(process.cwd(), "src", "data", "blog-posts.ts");

const rawTs = await readFile(blogPostsPath, "utf8");
const cleanedJs = rawTs
  .replace(/export\s+interface\s+[\s\S]*?\n\}/g, "")
  .replace(/:\s*BlogPost\[\]/g, "")
  .replace(/export\s+function\s+[\s\S]*$/g, "")
  .replace(/export\s+const\s+blogPosts/, "const blogPosts");

const loadBlogPosts = new Function(cleanedJs + "; return blogPosts;");
const blogPosts = loadBlogPosts();

function renderBlogPostHtml(post) {
  let html = `<article class="max-w-4xl mx-auto px-4 py-8">`;
  html += `<h1>${escapeHtml(post.title)}</h1>`;
  html += `<p class="lead">${escapeHtml(post.excerpt)}</p>`;
  
  if (post.keyTakeaways && post.keyTakeaways.length > 0) {
    html += `<section class="key-takeaways"><h2>Key Takeaways & Executive Summary</h2><ul>`;
    for (const item of post.keyTakeaways) {
      html += `<li>${escapeHtml(item)}</li>`;
    }
    html += `</ul></section>`;
  }

  if (post.body) {
    for (const section of post.body) {
      html += `<section><h2>${escapeHtml(section.h2)}</h2>`;
      if (section.paragraphs) {
        for (const p of section.paragraphs) {
          html += `<p>${escapeHtml(p)}</p>`;
        }
      }
      if (section.htmlParagraphs) {
        for (const p of section.htmlParagraphs) {
          html += `<p>${p}</p>`;
        }
      }
      if (section.table) {
        html += `<div class="table-container">`;
        if (section.table.caption) {
          html += `<caption>${escapeHtml(section.table.caption)}</caption>`;
        }
        html += `<table><thead><tr>`;
        for (const h of section.table.headers) {
          html += `<th>${escapeHtml(h)}</th>`;
        }
        html += `</tr></thead><tbody>`;
        for (const row of section.table.rows) {
          html += `<tr>`;
          for (const cell of row) {
            html += `<td>${escapeHtml(cell)}</td>`;
          }
          html += `</tr>`;
        }
        html += `</tbody></table></div>`;
      }
      if (section.code) {
        html += `<pre><code>${escapeHtml(section.code)}</code></pre>`;
      }
      if (section.list) {
        html += `<ul>`;
        for (const item of section.list) {
          html += `<li>${escapeHtml(item)}</li>`;
        }
        html += `</ul>`;
      }
      if (section.tip) {
        html += `<blockquote><strong>Pro Tip:</strong> ${escapeHtml(section.tip)}</blockquote>`;
      }
      html += `</section>`;
    }
  }

  if (post.faqs && post.faqs.length > 0) {
    html += `<section class="faqs"><h2>Frequently Asked Questions</h2><dl>`;
    for (const faq of post.faqs) {
      html += `<dt><strong>${escapeHtml(faq.q)}</strong></dt><dd>${escapeHtml(faq.a)}</dd>`;
    }
    html += `</dl></section>`;
  }

  html += `</article>`;
  return html;
}

function renderBlogIndexHtml(posts) {
  let html = `<main class="max-w-6xl mx-auto px-4 py-12">`;
  html += `<h1>Image SEO & Web Performance Blog</h1>`;
  html += `<p class="lead">Technical guides, empirical benchmarks, and actionable frameworks to help you optimize visual assets, master Core Web Vitals, and dominate organic search.</p>`;
  html += `<section class="grid gap-8 my-8">`;
  for (const post of posts) {
    html += `<article class="border p-6 rounded-2xl">`;
    html += `<h2><a href="/blog/${post.slug}">${escapeHtml(post.title)}</a></h2>`;
    html += `<p class="text-sm text-gray-500">${escapeHtml(post.date)} · ${escapeHtml(post.readTime)} · ${escapeHtml(post.tag)}</p>`;
    html += `<p>${escapeHtml(post.excerpt)}</p>`;
    html += `<p><a href="/blog/${post.slug}">Read Article &rarr;</a></p>`;
    html += `</article>`;
  }
  html += `</section></main>`;
  return html;
}

const pages = {
  // ─── English (en) Core Pages ───
  "/": {
    title: "IMGSEO | Free Image Optimizer, Geo Tagger & WebP Converter for SEO",
    description: "Compress, convert, and geotag images in your browser with free client-side tools for lighter files, useful metadata, and privacy-conscious publishing.",
    schemaType: "WebApplication",
    lang: "en",
    faqs: [
      { q: "What is IMGSEO and how does it help web rankings?", a: "IMGSEO is a client-side suite of image optimization tools that helps you convert files to next-gen WebP, compress JPG/PNG without quality loss, inject GPS EXIF coordinates for local SEO, and optimize Core Web Vitals (LCP)." },
      { q: "Are my uploaded photos safe and private?", a: "Yes, 100% private. All processing is performed locally in your browser memory via HTML5 Canvas and WebAssembly. No images or metadata ever leave your computer or touch our servers." },
      { q: "Does WebP conversion really improve page load speed?", a: "Yes. WebP images are 25% to 35% lighter than comparable JPEGs and up to 70% smaller than PNGs, slashing bandwidth consumption and boosting Largest Contentful Paint (LCP) scores." },
      { q: "How does image geotagging help local businesses rank on Google Maps?", a: "Embedding authentic latitude and longitude GPS coordinates into JPEG EXIF headers provides physical proof of your service area to Google algorithms and Google Business Profile." },
      { q: "Is IMGSEO completely free to use?", a: "Yes, IMGSEO is free with unlimited batch conversions, zero watermarks, and no registration required." }
    ],
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
            <li><a href="/jpg-to-webp">JPG to WebP Converter</a> — Dedicated photographic JPEG to WebP conversion.</li>
            <li><a href="/png-to-webp">PNG to WebP Converter</a> — Preserve transparency with 70% smaller file sizes.</li>
            <li><a href="/compress-jpg">Compress JPG</a> — Target precise byte savings for faster loading.</li>
            <li><a href="/compress-image-to-kb">Compress Image to KB</a> — Shrink images to exact target limits (20KB, 50KB, 100KB, 200KB).</li>
            <li><a href="/image-seo">Image SEO Guide</a> — Comprehensive blueprint for alt text, dimensions, and Core Web Vitals.</li>
          </ul>
        </section>
        <section>
          <h2>Performance Benchmark: WebP vs Legacy Formats</h2>
          <table>
            <thead><tr><th>Format</th><th>Average Size</th><th>Compression Gain</th><th>Transparency</th><th>SEO Recommendation</th></tr></thead>
            <tbody>
              <tr><td>JPEG / JPG</td><td>240 KB</td><td>Baseline</td><td>No</td><td>Legacy format, slower mobile LCP</td></tr>
              <tr><td>PNG-24</td><td>680 KB</td><td>-65% vs JPG</td><td>Yes (Alpha)</td><td>Heavy, slow for web delivery</td></tr>
              <tr><td>WebP (Lossy)</td><td>65 KB</td><td>-73% vs JPEG</td><td>Yes</td><td>Google Recommended (LCP &lt; 2.5s)</td></tr>
              <tr><td>WebP (Lossless)</td><td>190 KB</td><td>-72% vs PNG</td><td>Yes (Full Alpha)</td><td>Recommended for logos & illustrations</td></tr>
            </tbody>
          </table>
        </section>
        <section class="faqs">
          <h2>Frequently Asked Questions</h2>
          <dl>
            <dt><strong>What is IMGSEO and how does it help web rankings?</strong></dt>
            <dd>IMGSEO is a client-side suite of image optimization tools that helps you convert files to next-gen WebP, compress JPG/PNG without quality loss, inject GPS EXIF coordinates for local SEO, and optimize Core Web Vitals (LCP).</dd>
            <dt><strong>Are my uploaded photos safe and private?</strong></dt>
            <dd>Yes, 100% private. All processing is performed locally in your browser memory via HTML5 Canvas and WebAssembly. No images or metadata ever leave your computer or touch our servers.</dd>
            <dt><strong>Does WebP conversion really improve page load speed?</strong></dt>
            <dd>Yes. WebP images are 25% to 35% lighter than comparable JPEGs and up to 70% smaller than PNGs, slashing bandwidth consumption and boosting Largest Contentful Paint (LCP) scores.</dd>
            <dt><strong>How does image geotagging help local businesses rank on Google Maps?</strong></dt>
            <dd>Embedding authentic latitude and longitude GPS coordinates into JPEG EXIF headers provides physical proof of your service area to Google algorithms and Google Business Profile.</dd>
            <dt><strong>Is IMGSEO completely free to use?</strong></dt>
            <dd>Yes, IMGSEO is free with unlimited batch conversions, zero watermarks, and no registration required.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/free-webp-converter": {
    title: "Free WebP Converter Online | JPG & PNG to WebP | IMGSEO",
    description: "Convert JPG and PNG images to WebP in your browser. Reduce file size for faster pages without uploading your files.",
    schemaType: "WebApplication",
    lang: "en",
    faqs: [
      { q: "Why should I convert images to WebP for SEO?", a: "WebP files are up to 35% smaller than JPEG and 70% smaller than PNG with identical visual fidelity, dramatically accelerating Largest Contentful Paint (LCP)." },
      { q: "Does WebP conversion reduce image quality?", a: "No perceptible loss occurs. WebP uses modern predictive entropy coding to preserve edge acuity and color gradients while discarding invisible data." },
      { q: "Is WebP supported across all modern web browsers?", a: "Yes. Google Chrome, Safari, Firefox, Microsoft Edge, and mobile operating systems (iOS and Android) have over 97% global market support for WebP." },
      { q: "Are my images sent to any cloud server?", a: "No. All conversions happen entirely in your browser sandbox via Canvas API. Zero remote data retention." },
      { q: "Can I batch convert multiple files at once?", a: "Yes. You can drag and drop dozens of photos and download them packaged in a single ZIP file." }
    ],
    body: `
      <main>
        <h1>Free WebP Converter Online</h1>
        <p>Convert JPG, PNG, and other image formats to WebP directly in your browser. Improve Core Web Vitals (LCP) and reduce page weight without uploading files to remote servers.</p>
        <section>
          <h2>How to Convert Images to WebP</h2>
          <ol>
            <li>Select or drag-and-drop your JPG, PNG, or AVIF images.</li>
            <li>Adjust the quality slider (80-85% recommended for optimal balance).</li>
            <li>Download your lightweight WebP files instantly or as a ZIP package.</li>
          </ol>
        </section>
        <section>
          <h2>Why WebP Matters for SEO & Core Web Vitals</h2>
          <p>Google officially recommends next-gen image formats like WebP. Uncompressed visual assets represent over 65% of an average website's byte weight. Converting to WebP achieves sub-second rendering and keeps Largest Contentful Paint (LCP) below Google's 2.5s threshold.</p>
          <ul>
            <li>Save up to 80% bandwidth on mobile 3G and 4G connections.</li>
            <li>Retain full alpha channel transparency with 70% smaller file footprint than PNG.</li>
            <li>Boost organic search rankings with faster Google PageSpeed scores.</li>
          </ul>
        </section>
        <section class="faqs">
          <h2>Frequently Asked Questions</h2>
          <dl>
            <dt><strong>Why should I convert images to WebP for SEO?</strong></dt>
            <dd>WebP files are up to 35% smaller than JPEG and 70% smaller than PNG with identical visual fidelity, dramatically accelerating Largest Contentful Paint (LCP).</dd>
            <dt><strong>Does WebP conversion reduce image quality?</strong></dt>
            <dd>No perceptible loss occurs. WebP uses modern predictive entropy coding to preserve edge acuity and color gradients while discarding invisible data.</dd>
            <dt><strong>Is WebP supported across all modern web browsers?</strong></dt>
            <dd>Yes. Google Chrome, Safari, Firefox, Microsoft Edge, and mobile operating systems (iOS and Android) have over 97% global market support for WebP.</dd>
            <dt><strong>Are my images sent to any cloud server?</strong></dt>
            <dd>No. All conversions happen entirely in your browser sandbox via Canvas API. Zero remote data retention.</dd>
            <dt><strong>Can I batch convert multiple files at once?</strong></dt>
            <dd>Yes. You can drag and drop dozens of photos and download them packaged in a single ZIP file.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/free-geo-tagger": {
    title: "Free Geo Tagger | Add GPS Metadata to Photos | IMGSEO",
    description: "Add GPS coordinates and optional descriptions to image metadata in your browser. Process photos locally with IMGSEO's free geo tagger.",
    schemaType: "WebApplication",
    lang: "en",
    faqs: [
      { q: "How does image geotagging help local SEO?", a: "Embedding GPS coordinates into photo EXIF headers provides search engines with verified geographic signals confirming your business location and service territory." },
      { q: "Does Google read EXIF metadata for Google Business Profile and Maps?", a: "Yes. Google indexes EXIF metadata as a localized trust signal, especially when matched with city landing pages and keyword-rich filenames." },
      { q: "What is the best workflow for geotagging local business photos?", a: "Select your exact business or job site address on our interactive map, upload your project photos, embed coordinates, and upload the output JPEGs directly to Google Business Profile." },
      { q: "Which file formats support EXIF GPS tags?", a: "JPEG/JPG is the universal standard for EXIF GPS metadata. Our tool automatically exports fully compliant JPEG files." },
      { q: "Is my location data and photo content kept private?", a: "Yes, 100% private. All metadata operations run client-side in your browser. No files or coordinates are stored on remote servers." }
    ],
    body: `
      <main>
        <h1>Free Geo Tagger Tool for Local SEO</h1>
        <p>Embed latitude, longitude, and location metadata into JPEG photo EXIF headers directly in your browser. 100% private with no server file retention.</p>
        <section>
          <h2>How to Geo Tag Images for Local SEO</h2>
          <ol>
            <li>Search your business address or pin the exact location on the interactive map.</li>
            <li>Upload JPEG project photos or storefront images.</li>
            <li>Click Embed GPS Metadata and download your geo-tagged JPEG files.</li>
          </ol>
        </section>
        <section>
          <h2>Why Photo Geotagging Powers Google Local 3-Pack Rankings</h2>
          <p>Local SEO algorithms favor businesses that provide verifiable location proof. When you publish photos with embedded GPS coordinates to Google Business Profile and local landing pages, you establish a strong localized entity cluster.</p>
          <ul>
            <li>Strengthen local relevance signals for plumbers, electricians, roofers, and contractors.</li>
            <li>Verify multi-location service areas across distinct suburban neighborhoods.</li>
            <li>Protect sensitive customer privacy: all coordinates are processed locally without cloud tracking.</li>
          </ul>
        </section>
        <section class="faqs">
          <h2>Frequently Asked Questions</h2>
          <dl>
            <dt><strong>How does image geotagging help local SEO?</strong></dt>
            <dd>Embedding GPS coordinates into photo EXIF headers provides search engines with verified geographic signals confirming your business location and service territory.</dd>
            <dt><strong>Does Google read EXIF metadata for Google Business Profile and Maps?</strong></dt>
            <dd>Yes. Google indexes EXIF metadata as a localized trust signal, especially when matched with city landing pages and keyword-rich filenames.</dd>
            <dt><strong>What is the best workflow for geotagging local business photos?</strong></dt>
            <dd>Select your exact business or job site address on our interactive map, upload your project photos, embed coordinates, and upload the output JPEGs directly to Google Business Profile.</dd>
            <dt><strong>Which file formats support EXIF GPS tags?</strong></dt>
            <dd>JPEG/JPG is the universal standard for EXIF GPS metadata. Our tool automatically exports fully compliant JPEG files.</dd>
            <dt><strong>Is my location data and photo content kept private?</strong></dt>
            <dd>Yes, 100% private. All metadata operations run client-side in your browser. No files or coordinates are stored on remote servers.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/free-online-image-compressor": {
    title: "Free Online Image Compressor | Compress Images in Browser | IMGSEO",
    description: "Compress JPG, PNG, and WebP images online with quality controls and local browser processing. No image upload required.",
    schemaType: "WebApplication",
    lang: "en",
    faqs: [
      { q: "How does this compressor reduce file size without losing quality?", a: "It uses intelligent quantization and chroma subsampling in Canvas to strip imperceptible high-frequency noise, slashing bytes while preserving visual sharpness." },
      { q: "What is the recommended file size for web images?", a: "Hero banners should be kept under 150KB-200KB; article and catalog images under 70KB-90KB; and icons/thumbnails under 25KB." },
      { q: "Does image compression improve Google PageSpeed Insights?", a: "Yes. Heavy images are the #1 cause of poor LCP scores. Compressing images by 70-80% can improve your PageSpeed score by 20-40 points." },
      { q: "Is there any limit to the number of images I can compress?", a: "No. You can compress hundreds of photos batch-wise utilizing your device's local hardware with zero throttles." },
      { q: "Are commercial and client photos secure?", a: "Yes, completely secure. Files never leave your local browser sandbox." }
    ],
    body: `
      <main>
        <h1>Free Online Image Compressor</h1>
        <p>Compress JPG, PNG, and WebP images in your browser. Balance visual clarity and file size for faster web performance and lower bounce rates.</p>
        <section>
          <h2>How to Compress Images Online</h2>
          <ol>
            <li>Drag and drop your images into the compression tool.</li>
            <li>Use the quality slider to dial in the perfect file size to clarity ratio.</li>
            <li>Download individual compressed files or a consolidated ZIP archive.</li>
          </ol>
        </section>
        <section>
          <h2>Recommended Image Size Guidelines for High Performance</h2>
          <table>
            <thead><tr><th>Image Type</th><th>Target Dimensions</th><th>Target KB</th><th>Format</th></tr></thead>
            <tbody>
              <tr><td>Hero / Banner</td><td>1920 &times; 1080 px</td><td>&lt; 150 KB</td><td>WebP</td></tr>
              <tr><td>E-commerce Product</td><td>1200 &times; 1200 px</td><td>&lt; 80 KB</td><td>WebP / JPG</td></tr>
              <tr><td>Blog Featured Image</td><td>1200 &times; 675 px</td><td>&lt; 70 KB</td><td>WebP</td></tr>
              <tr><td>Logo / Icon</td><td>400 &times; 400 px</td><td>&lt; 20 KB</td><td>WebP / SVG</td></tr>
            </tbody>
          </table>
        </section>
        <section class="faqs">
          <h2>Frequently Asked Questions</h2>
          <dl>
            <dt><strong>How does this compressor reduce file size without losing quality?</strong></dt>
            <dd>It uses intelligent quantization and chroma subsampling in Canvas to strip imperceptible high-frequency noise, slashing bytes while preserving visual sharpness.</dd>
            <dt><strong>What is the recommended file size for web images?</strong></dt>
            <dd>Hero banners should be kept under 150KB-200KB; article and catalog images under 70KB-90KB; and icons/thumbnails under 25KB.</dd>
            <dt><strong>Does image compression improve Google PageSpeed Insights?</strong></dt>
            <dd>Yes. Heavy images are the #1 cause of poor LCP scores. Compressing images by 70-80% can improve your PageSpeed score by 20-40 points.</dd>
            <dt><strong>Is there any limit to the number of images I can compress?</strong></dt>
            <dd>No. You can compress hundreds of photos batch-wise utilizing your device's local hardware with zero throttles.</dd>
            <dt><strong>Are commercial and client photos secure?</strong></dt>
            <dd>Yes, completely secure. Files never leave your local browser sandbox.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/jpg-to-webp": {
    title: "JPG to WebP Converter | Free Online Tool | IMGSEO",
    description: "Convert JPG images to WebP online in your browser. Choose quality, compare file sizes, and download without uploading your files.",
    schemaType: "WebApplication",
    lang: "en",
    faqs: [
      { q: "Why convert JPG to WebP?", a: "WebP provides superior compression for photographic imagery, preventing DCT compression blockiness and accelerating Largest Contentful Paint." },
      { q: "What is the typical byte savings converting JPG to WebP?", a: "You can expect a 30% to 50% reduction in file size at identical perceived visual quality." },
      { q: "Will WebP images display on iPhones and Safari?", a: "Yes. iOS 14+ and Safari 14+ support WebP natively across all Apple devices." },
      { q: "Can I convert high-resolution DSLR photos to WebP?", a: "Yes. The browser's Canvas engine processes multi-megapixel photos smoothly without upload limitations." },
      { q: "Is the JPG to WebP conversion private?", a: "100% private. Files never leave your browser." }
    ],
    body: `
      <main>
        <h1>JPG to WebP Converter</h1>
        <p>Convert photographic JPG/JPEG files to lightweight WebP assets. Reduce bandwidth overhead while maintaining crisp visual fidelity.</p>
        <section>
          <h2>How to Convert JPG to WebP</h2>
          <ol>
            <li>Upload one or more JPG/JPEG files.</li>
            <li>Set your preferred WebP quality level (80-85% is ideal).</li>
            <li>Download the converted WebP assets individually or in a ZIP file.</li>
          </ol>
        </section>
        <section class="faqs">
          <h2>Frequently Asked Questions</h2>
          <dl>
            <dt><strong>Why convert JPG to WebP?</strong></dt>
            <dd>WebP provides superior compression for photographic imagery, preventing DCT compression blockiness and accelerating Largest Contentful Paint.</dd>
            <dt><strong>What is the typical byte savings converting JPG to WebP?</strong></dt>
            <dd>You can expect a 30% to 50% reduction in file size at identical perceived visual quality.</dd>
            <dt><strong>Will WebP images display on iPhones and Safari?</strong></dt>
            <dd>Yes. iOS 14+ and Safari 14+ support WebP natively across all Apple devices.</dd>
            <dt><strong>Can I convert high-resolution DSLR photos to WebP?</strong></dt>
            <dd>Yes. The browser's Canvas engine processes multi-megapixel photos smoothly without upload limitations.</dd>
            <dt><strong>Is the JPG to WebP conversion private?</strong></dt>
            <dd>100% private. Files never leave your browser.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/png-to-webp": {
    title: "PNG to WebP Converter | Free Online Tool | IMGSEO",
    description: "Convert PNG images to WebP online in your browser. Keep transparency where supported and download locally processed files.",
    schemaType: "WebApplication",
    lang: "en",
    faqs: [
      { q: "Does WebP support transparent backgrounds like PNG?", a: "Yes. WebP includes full alpha channel transparency support while producing files up to 70% smaller than PNG-24." },
      { q: "When should I convert PNG to WebP?", a: "For website logos, UI icons, screenshots, product cutouts with transparent backgrounds, and digital illustrations." },
      { q: "Will transparent PNGs become opaque during conversion?", a: "No. Our converter retains 24-bit transparent alpha channels cleanly in WebP format." },
      { q: "How much smaller is a WebP compared to PNG-24?", a: "Typically 60% to 80% smaller, providing huge speed improvements on mobile." },
      { q: "Is batch PNG conversion supported?", a: "Yes, you can drop multiple PNG files and batch export them into WebP." }
    ],
    body: `
      <main>
        <h1>PNG to WebP Converter</h1>
        <p>Convert PNG graphics, screenshots, and logos to WebP while preserving full alpha channel transparency.</p>
        <section>
          <h2>How to Convert PNG to WebP</h2>
          <ol>
            <li>Select PNG files with or without transparent backgrounds.</li>
            <li>Configure quality settings (lossless or high-quality lossy).</li>
            <li>Download ultra-lightweight WebP files with full transparency intact.</li>
          </ol>
        </section>
        <section class="faqs">
          <h2>Frequently Asked Questions</h2>
          <dl>
            <dt><strong>Does WebP support transparent backgrounds like PNG?</strong></dt>
            <dd>Yes. WebP includes full alpha channel transparency support while producing files up to 70% smaller than PNG-24.</dd>
            <dt><strong>When should I convert PNG to WebP?</strong></dt>
            <dd>For website logos, UI icons, screenshots, product cutouts with transparent backgrounds, and digital illustrations.</dd>
            <dt><strong>Will transparent PNGs become opaque during conversion?</strong></dt>
            <dd>No. Our converter retains 24-bit transparent alpha channels cleanly in WebP format.</dd>
            <dt><strong>How much smaller is a WebP compared to PNG-24?</strong></dt>
            <dd>Typically 60% to 80% smaller, providing huge speed improvements on mobile.</dd>
            <dt><strong>Is batch PNG conversion supported?</strong></dt>
            <dd>Yes, you can drop multiple PNG files and batch export them into WebP.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/compress-jpg": {
    title: "Compress JPG Images Online | Free Browser Tool | IMGSEO",
    description: "Compress JPG images online with adjustable quality and local browser processing. Download smaller JPG files without uploading them.",
    schemaType: "WebApplication",
    lang: "en",
    faqs: [
      { q: "How does JPG compression work?", a: "It optimizes discrete cosine transform (DCT) quantization tables, removing redundant chromatic data that human vision cannot differentiate." },
      { q: "What is the best JPG compression ratio for web publishing?", a: "A quality setting of 75% to 82% offers the optimal trade-off, reducing file size by 60-75% without visible pixelation." },
      { q: "Can I compress JPG images without changing dimensions?", a: "Yes. The compressor adjusts pixel quantization without altering your image width and height in pixels." },
      { q: "Is batch JPG compression free?", a: "Yes, 100% free with unlimited batch files." },
      { q: "Are EXIF tags preserved during JPG compression?", a: "You can choose to preserve EXIF metadata or strip it for maximum file size savings." }
    ],
    body: `
      <main>
        <h1>Compress JPG Images Online</h1>
        <p>Optimize JPEG images locally. Eliminate unnecessary metadata and tune quantization matrices for optimal web delivery.</p>
        <section>
          <h2>How to Compress JPG Files</h2>
          <ol>
            <li>Upload JPG/JPEG images.</li>
            <li>Fine-tune the compression level.</li>
            <li>Download compressed JPEGs ready for web deployment.</li>
          </ol>
        </section>
        <section class="faqs">
          <h2>Frequently Asked Questions</h2>
          <dl>
            <dt><strong>How does JPG compression work?</strong></dt>
            <dd>It optimizes discrete cosine transform (DCT) quantization tables, removing redundant chromatic data that human vision cannot differentiate.</dd>
            <dt><strong>What is the best JPG compression ratio for web publishing?</strong></dt>
            <dd>A quality setting of 75% to 82% offers the optimal trade-off, reducing file size by 60-75% without visible pixelation.</dd>
            <dt><strong>Can I compress JPG images without changing dimensions?</strong></dt>
            <dd>Yes. The compressor adjusts pixel quantization without altering your image width and height in pixels.</dd>
            <dt><strong>Is batch JPG compression free?</strong></dt>
            <dd>Yes, 100% free with unlimited batch files.</dd>
            <dt><strong>Are EXIF tags preserved during JPG compression?</strong></dt>
            <dd>You can choose to preserve EXIF metadata or strip it for maximum file size savings.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/compress-image-to-kb": {
    title: "Compress Image to 20KB, 50KB, 100KB, 200KB Online | IMGSEO",
    description: "Compress JPG, PNG, and WebP images to exact target sizes (20KB, 50KB, 100KB, 200KB) in your browser. Free batch compression with zero uploads.",
    schemaType: "WebApplication",
    lang: "en",
    faqs: [
      { q: "How does the exact target KB compression work?", a: "It uses an iterative binary search algorithm in client-side Canvas memory to converge on your chosen target file size (e.g. 20KB, 50KB, 100KB) with precision." },
      { q: "Can I compress photos for passport, visa, and government portals?", a: "Yes. Portals with strict limits like 20KB, 50KB, or 100KB are fully supported." },
      { q: "What formats can be compressed to exact KB?", a: "JPG, PNG, and WebP formats can all be compressed to strict target size limits." },
      { q: "Will the image blur if I compress it to 20KB?", a: "Our algorithm balances quantization and dimension scaling to retain readable text and clear facial features even at tight KB constraints." },
      { q: "Is there any cost or limit for batch target KB compression?", a: "No, it is completely free and operates unlimited in your browser." }
    ],
    body: `
      <main>
        <h1>Compress Image to Exact KB Online (20KB, 50KB, 100KB, 200KB)</h1>
        <p>Reduce photo file sizes to exact target limits like 20KB, 50KB, 100KB, or 200KB directly in your browser. 100% private, free batch processing with no server uploads.</p>
        <section>
          <h2>How to Compress Images to Exact KB</h2>
          <ol>
            <li>Select your target preset (20KB, 50KB, 100KB, 200KB, or custom value).</li>
            <li>Upload your photos or passport scans.</li>
            <li>Download the precisely compressed files guaranteed to be under your target size limit.</li>
          </ol>
        </section>
        <section class="faqs">
          <h2>Frequently Asked Questions</h2>
          <dl>
            <dt><strong>How does the exact target KB compression work?</strong></dt>
            <dd>It uses an iterative binary search algorithm in client-side Canvas memory to converge on your chosen target file size (e.g. 20KB, 50KB, 100KB) with precision.</dd>
            <dt><strong>Can I compress photos for passport, visa, and government portals?</strong></dt>
            <dd>Yes. Portals with strict limits like 20KB, 50KB, or 100KB are fully supported.</dd>
            <dt><strong>What formats can be compressed to exact KB?</strong></dt>
            <dd>JPG, PNG, and WebP formats can all be compressed to strict target size limits.</dd>
            <dt><strong>Will the image blur if I compress it to 20KB?</strong></dt>
            <dd>Our algorithm balances quantization and dimension scaling to retain readable text and clear facial features even at tight KB constraints.</dd>
            <dt><strong>Is there any cost or limit for batch target KB compression?</strong></dt>
            <dd>No, it is completely free and operates unlimited in your browser.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/image-seo": {
    title: "Image SEO Guide: Alt Text, File Names & Performance | IMGSEO",
    description: "Learn practical image SEO: descriptive file names, useful alt text, responsive dimensions, WebP, crawlability, and performance.",
    schemaType: "Article",
    lang: "en",
    faqs: [
      { q: "What is Image SEO and why does it matter?", a: "Image SEO is the practice of optimizing image assets (filenames, alt text, dimensions, formats, and metadata) to rank in Google Images, drive organic traffic, and accelerate page load speed." },
      { q: "How do I write SEO-optimized alt text?", a: "Describe the subject matter accurately in 10-15 words including primary contextual keywords naturally, avoiding keyword stuffing." },
      { q: "What is the best naming convention for image files?", a: "Use lowercase, hyphen-separated descriptive words matching the search intent (e.g. 'emergency-plumber-austin-tx.webp')." },
      { q: "How do image dimensions affect Core Web Vitals (CLS)?", a: "Always declare explicit width and height attributes in HTML/CSS to prevent Cumulative Layout Shift (CLS) as images load." },
      { q: "Does Google Image Search rank WebP files as well as JPEGs?", a: "Yes. Google indexes WebP images seamlessly and often ranks them higher due to superior page speed metrics." }
    ],
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
          <section class="faqs">
            <h2>Frequently Asked Questions</h2>
            <dl>
              <dt><strong>What is Image SEO and why does it matter?</strong></dt>
              <dd>Image SEO is the practice of optimizing image assets (filenames, alt text, dimensions, formats, and metadata) to rank in Google Images, drive organic traffic, and accelerate page load speed.</dd>
              <dt><strong>How do I write SEO-optimized alt text?</strong></dt>
              <dd>Describe the subject matter accurately in 10-15 words including primary contextual keywords naturally, avoiding keyword stuffing.</dd>
              <dt><strong>What is the best naming convention for image files?</strong></dt>
              <dd>Use lowercase, hyphen-separated descriptive words matching the search intent (e.g. 'emergency-plumber-austin-tx.webp').</dd>
              <dt><strong>How do image dimensions affect Core Web Vitals (CLS)?</strong></dt>
              <dd>Always declare explicit width and height attributes in HTML/CSS to prevent Cumulative Layout Shift (CLS) as images load.</dd>
              <dt><strong>Does Google Image Search rank WebP files as well as JPEGs?</strong></dt>
              <dd>Yes. Google indexes WebP images seamlessly and often ranks them higher due to superior page speed metrics.</dd>
            </dl>
          </section>
        </article>
      </main>
    `
  },
  "/privacy": {
    title: "Privacy Policy | Client-Side Security | IMGSEO",
    description: "Learn how IMGSEO processes images locally in your browser and which third-party map and location services the geo tagger uses.",
    schemaType: "WebPage",
    lang: "en",
    body: `<main><h1>Privacy Policy</h1><p>IMGSEO operates client-side image optimization utilities. Your photos and metadata are processed locally in your browser memory and are never transmitted, stored, or logged on our servers.</p></main>`
  },
  "/terms": {
    title: "Terms of Use | Free Browser Image Utilities | IMGSEO",
    description: "Review the official terms of use for IMGSEO's free browser-based image conversion, compression, and metadata optimization tools.",
    schemaType: "WebPage",
    lang: "en",
    body: `<main><h1>Terms of Use</h1><p>Review the terms of use for IMGSEO browser-based utilities. All tools are provided free of charge for personal and commercial website optimization.</p></main>`
  },
  "/blog": {
    title: "Image SEO & Web Performance Blog — Guides & Tutorials | IMGSEO",
    description: "In-depth guides, research studies, and actionable tutorials on image SEO, WebP conversion, GPS geotagging, Core Web Vitals (LCP), and Google rankings.",
    schemaType: "Blog",
    lang: "en",
    body: renderBlogIndexHtml(blogPosts)
  },

  // ─── Spanish (es) Pages (9 routes) ───
  "/es": {
    title: "Herramientas SEO para Imágenes Gratis y Privadas | ImageSEO",
    description: "Optimiza, comprime, convierte a WebP y geolocaliza imágenes directamente en tu navegador. 100% privado, rápido y sin límites de subida en ImageSEO.cc.",
    schemaType: "WebApplication",
    lang: "es",
    faqs: [
      { q: "¿Qué es ImageSEO y cómo ayuda al posicionamiento web?", a: "ImageSEO es una suite completa de optimización de imágenes en el navegador que convierte a WebP, comprime fotos JPG/PNG sin pérdida perceptible e inyecta coordenadas GPS para SEO local." },
      { q: "¿Se guardan mis fotos en algún servidor?", a: "No, nunca. Todo el procesamiento se realiza en la memoria local de tu navegador. Máxima privacidad garantizada." },
      { q: "¿Por qué WebP mejora la velocidad de mi sitio web?", a: "WebP reduce el peso de las imágenes hasta un 80% comparado con formatos tradicionales, mejorando directamente el LCP (Largest Contentful Paint) en Google PageSpeed." },
      { q: "¿Cómo ayuda la geolocalización de fotos a Google Business Profile?", a: "Añadir coordenadas GPS en las cabeceras EXIF confirma ante los algoritmos de Google Maps la ubicación real de tus trabajos y servicios locales." },
      { q: "¿Es gratis usar ImageSEO en español?", a: "Sí, 100% gratuito, sin límites de cantidad ni marcas de agua." }
    ],
    body: `
      <main>
        <h1>Herramientas SEO para Imágenes Gratuitas y 100% Privadas</h1>
        <p>Optimiza imágenes para tu sitio web directamente en tu navegador. Convierte a WebP, comprime fotos JPG y PNG, incrusta metadatos EXIF GPS y genera nombres de archivo para SEO sin subir archivos a servidores.</p>
        <section>
          <h2>Herramientas Principales de ImageSEO</h2>
          <ul>
            <li><a href="/es/free-webp-converter">Convertidor WebP Gratis</a> — Transforma fotos JPG y PNG a WebP al instante.</li>
            <li><a href="/es/free-online-image-compressor">Compresor de Imágenes Online</a> — Reduce el peso en KB conservando nitidez.</li>
            <li><a href="/es/free-geo-tagger">Geolocalizador GPS de Fotos</a> — Añade coordenadas GPS en cabeceras EXIF de forma privada.</li>
            <li><a href="/es/jpg-to-webp">Convertir JPG a WebP</a> — Optimización fotográfica de alta fidelidad.</li>
            <li><a href="/es/png-to-webp">Convertir PNG a WebP</a> — Mantén transparencia reduciendo el peso hasta un 80%.</li>
            <li><a href="/es/compress-jpg">Comprimir JPG</a> — Reduce el peso de fotografías JPEG.</li>
            <li><a href="/es/compress-image-to-kb">Comprimir Fotos a KB Exactos</a> — Ajusta a 20KB, 50KB, 100KB o 200KB.</li>
            <li><a href="/es/image-seo">Guía Completa de SEO para Imágenes</a> — Manual práctico de optimización y Core Web Vitals.</li>
          </ul>
        </section>
        <section class="faqs">
          <h2>Preguntas Frecuentes</h2>
          <dl>
            <dt><strong>¿Qué es ImageSEO y cómo ayuda al posicionamiento web?</strong></dt>
            <dd>ImageSEO es una suite completa de optimización de imágenes en el navegador que convierte a WebP, comprime fotos JPG/PNG sin pérdida perceptible e inyecta coordenadas GPS para SEO local.</dd>
            <dt><strong>¿Se guardan mis fotos en algún servidor?</strong></dt>
            <dd>No, nunca. Todo el procesamiento se realiza en la memoria local de tu navegador. Máxima privacidad garantizada.</dd>
            <dt><strong>¿Por qué WebP mejora la velocidad de mi sitio web?</strong></dt>
            <dd>WebP reduce el peso de las imágenes hasta un 80% comparado con formatos tradicionales, mejorando directamente el LCP (Largest Contentful Paint) en Google PageSpeed.</dd>
            <dt><strong>¿Cómo ayuda la geolocalización de fotos a Google Business Profile?</strong></dt>
            <dd>Añadir coordenadas GPS en las cabeceras EXIF confirma ante los algoritmos de Google Maps la ubicación real de tus trabajos y servicios locales.</dd>
            <dt><strong>¿Es gratis usar ImageSEO en español?</strong></dt>
            <dd>Sí, 100% gratuito, sin límites de cantidad ni marcas de agua.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/es/free-webp-converter": {
    title: "Convertidor WebP Gratis Online — Sin Límites | ImageSEO",
    description: "Convierte imágenes a formato WebP moderno al instante en tu navegador. Reduce el peso de tus fotos conservando máxima calidad visual sin subir archivos a servidores.",
    schemaType: "WebApplication",
    lang: "es",
    faqs: [
      { q: "¿Por qué utilizar el formato WebP en lugar de JPG o PNG para SEO?", a: "WebP ofrece una compresión hasta un 35% más eficiente que JPEG manteniendo una fidelidad visual idéntica, lo que acelera el Largest Contentful Paint (LCP) y reduce drásticamente el tiempo de carga móvil." },
      { q: "¿Se reduce la calidad de la foto al convertirla a WebP?", a: "No perceptiblemente. WebP utiliza algoritmos avanzados de codificación predictiva que conservan los detalles finos y degradados mientras eliminan datos innecesarios." },
      { q: "¿Es compatible el formato WebP con todos los navegadores modernos y Google?", a: "Sí. WebP cuenta con compatibilidad total en Google Chrome, Safari, Firefox, Edge y dispositivos móviles Android e iOS (más del 97% del tráfico web mundial)." },
      { q: "¿Se suben mis fotos a algún servidor durante la conversión?", a: "No. Toda la transformación se realiza mediante la memoria local de tu navegador y Canvas API. Máxima privacidad garantizada sin retención externa." },
      { q: "¿Puedo convertir varias imágenes a WebP en lote a la vez?", a: "Sí. Puedes arrastrar decenas de imágenes simultáneamente y descargarlas todas juntas en un archivo comprimido ZIP." }
    ],
    body: `
      <main>
        <h1>Convertidor WebP Gratis y Rápido en el Navegador</h1>
        <p>Convierte fotos JPG, PNG y AVIF al formato WebP de Google sin enviarlas a la nube. Acelera tu tienda o blog conservando total nitidez.</p>
        <section>
          <h2>Cómo convertir imágenes a WebP paso a paso</h2>
          <ol>
            <li>Arrastra o selecciona tus imágenes en formato JPG, PNG o AVIF.</li>
            <li>Ajusta la calidad WebP deseada con el control deslizante (80-85% recomendado).</li>
            <li>Descarga tus fotos en formato WebP individualmente o en un paquete ZIP.</li>
          </ol>
        </section>
        <section>
          <h2>Beneficios del formato WebP para SEO</h2>
          <ul>
            <li>Archivos hasta un 35% más ligeros que JPEG con idéntica fidelidad visual.</li>
            <li>Soporte nativo para fondos transparentes (canal alfa) con un 70% menos de peso que los archivos PNG-24.</li>
            <li>Mejora directa de las puntuaciones de velocidad en Google PageSpeed Insights y reducción del porcentaje de rebote.</li>
          </ul>
        </section>
        <section class="faqs">
          <h2>Preguntas Frecuentes sobre el Convertidor WebP</h2>
          <dl>
            <dt><strong>¿Por qué utilizar el formato WebP en lugar de JPG o PNG para SEO?</strong></dt>
            <dd>WebP ofrece una compresión hasta un 35% más eficiente que JPEG manteniendo una fidelidad visual idéntica, lo que acelera el Largest Contentful Paint (LCP) y reduce drásticamente el tiempo de carga móvil.</dd>
            <dt><strong>¿Se reduce la calidad de la foto al convertirla a WebP?</strong></dt>
            <dd>No perceptiblemente. WebP utiliza algoritmos avanzados de codificación predictiva que conservan los detalles finos y degradados mientras eliminan datos innecesarios.</dd>
            <dt><strong>¿Es compatible el formato WebP con todos los navegadores modernos y Google?</strong></dt>
            <dd>Sí. WebP cuenta con compatibilidad total en Google Chrome, Safari, Firefox, Edge y dispositivos móviles Android e iOS (más del 97% del tráfico web mundial).</dd>
            <dt><strong>¿Se suben mis fotos a algún servidor durante la conversión?</strong></dt>
            <dd>No. Toda la transformación se realiza mediante la memoria local de tu navegador y Canvas API. Máxima privacidad garantizada sin retención externa.</dd>
            <dt><strong>¿Puedo convertir varias imágenes a WebP en lote a la vez?</strong></dt>
            <dd>Sí. Puedes arrastrar decenas de imágenes simultáneamente y descargarlas todas juntas en un archivo comprimido ZIP.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/es/jpg-to-webp": {
    title: "Convertir JPG a WebP Online Gratis — Rápido y Privado | ImageSEO",
    description: "Convierte fotos JPG a formato WebP ligero al instante. Acelera tu sitio web con compresión de última generación 100% procesada en tu navegador.",
    schemaType: "WebApplication",
    lang: "es",
    faqs: [
      { q: "¿Por qué convertir fotos JPG a WebP?", a: "WebP ofrece una reducción de tamaño de hasta un 40% frente a JPG manteniendo la misma nitidez fotográfica." },
      { q: "¿Funciona en teléfonos móviles iPhone y Android?", a: "Sí, todos los navegadores modernos en iOS y Android soportan WebP de forma nativa." },
      { q: "¿Cómo beneficia el cambio de JPG a WebP en Core Web Vitals?", a: "Al reducir los kilobytes de las imágenes principales, el Largest Contentful Paint (LCP) baja por debajo de los 2.5 segundos recomendados por Google." },
      { q: "¿Puedo convertir fotos de alta resolución tomadas con cámara réflex?", a: "Sí, el convertidor maneja fotos de alta resolución directamente en tu navegador sin límite de tamaño." },
      { q: "¿Se guardan mis fotos en algún servidor?", a: "No, la conversión es 100% local en tu dispositivo." }
    ],
    body: `
      <main>
        <h1>Convertir JPG a WebP Gratis Online</h1>
        <p>Transforma archivos JPEG a WebP sin esperas. Reduce los tiempos de carga móvil y mejora tus métricas de Google PageSpeed.</p>
        <section>
          <h2>Instrucciones para convertir JPG a WebP</h2>
          <ol>
            <li>Sube tus imágenes JPG arrastrándolas al convertidor.</li>
            <li>Elige el nivel de calidad fotográfica deseado.</li>
            <li>Descarga las imágenes WebP optimizadas al instante.</li>
          </ol>
        </section>
        <section class="faqs">
          <h2>Preguntas Frecuentes</h2>
          <dl>
            <dt><strong>¿Por qué convertir fotos JPG a WebP?</strong></dt>
            <dd>WebP ofrece una reducción de tamaño de hasta un 40% frente a JPG manteniendo la misma nitidez fotográfica.</dd>
            <dt><strong>¿Funciona en teléfonos móviles iPhone y Android?</strong></dt>
            <dd>Sí, todos los navegadores modernos en iOS y Android soportan WebP de forma nativa.</dd>
            <dt><strong>¿Cómo beneficia el cambio de JPG a WebP en Core Web Vitals?</strong></dt>
            <dd>Al reducir los kilobytes de las imágenes principales, el Largest Contentful Paint (LCP) baja por debajo de los 2.5 segundos recomendados por Google.</dd>
            <dt><strong>¿Puedo convertir fotos de alta resolución tomadas con cámara réflex?</strong></dt>
            <dd>Sí, el convertidor maneja fotos de alta resolución directamente en tu navegador sin límite de tamaño.</dd>
            <dt><strong>¿Se guardan mis fotos en algún servidor?</strong></dt>
            <dd>No, la conversión es 100% local en tu dispositivo.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/es/png-to-webp": {
    title: "Convertir PNG a WebP Online Gratis — Conserva Transparencia | ImageSEO",
    description: "Convierte archivos PNG a WebP conservando fondos transparentes y reduciendo el tamaño del archivo hasta un 80% sin pérdida perceptible.",
    schemaType: "WebApplication",
    lang: "es",
    faqs: [
      { q: "¿Conserva WebP los fondos transparentes de los archivos PNG?", a: "Sí, WebP soporta canal alfa de transparencia completo con un peso hasta un 70% menor que PNG-24." },
      { q: "¿Dónde es ideal utilizar PNG convertidos a WebP?", a: "Para logotipos, iconos web, capturas de pantalla con texto e ilustraciones vectoriales transparentes." },
      { q: "¿Se pixelan los bordes de los logotipos al pasar de PNG a WebP?", a: "No, la codificación WebP conserva los bordes nítidos y las sombras suaves de transparencia." },
      { q: "¿Puedo convertir varios PNG en lote?", a: "Sí, puedes subir decenas de archivos PNG y descargarlos todos convertidos a WebP en un ZIP." },
      { q: "¿Es seguro convertir logotipos de clientes?", a: "Totalmente seguro, ningún archivo sale de la memoria de tu navegador." }
    ],
    body: `
      <main>
        <h1>Convertir PNG a WebP con Transparencia</h1>
        <p>Optimiza gráficos, ilustraciones y logotipos transparentes convirtiéndolos a WebP con canal alfa intacto.</p>
        <section>
          <h2>Cómo convertir PNG a WebP manteniendo transparencia</h2>
          <ol>
            <li>Arrastra tus archivos PNG con fondo transparente al conversor.</li>
            <li>Ajusta la compresión según necesites máxima calidad o mínimo peso.</li>
            <li>Descarga las imágenes WebP ultraligeras con su transparencia impecable.</li>
          </ol>
        </section>
        <section class="faqs">
          <h2>Preguntas Frecuentes</h2>
          <dl>
            <dt><strong>¿Conserva WebP los fondos transparentes de los archivos PNG?</strong></dt>
            <dd>Sí, WebP soporta canal alfa de transparencia completo con un peso hasta un 70% menor que PNG-24.</dd>
            <dt><strong>¿Dónde es ideal utilizar PNG convertidos a WebP?</strong></dt>
            <dd>Para logotipos, iconos web, capturas de pantalla con texto e ilustraciones vectoriales transparentes.</dd>
            <dt><strong>¿Se pixelan los bordes de los logotipos al pasar de PNG a WebP?</strong></dt>
            <dd>No, la codificación WebP conserva los bordes nítidos y las sombras suaves de transparencia.</dd>
            <dt><strong>¿Puedo convertir varios PNG en lote?</strong></dt>
            <dd>Sí, puedes subir decenas de archivos PNG y descargarlos todos convertidos a WebP en un ZIP.</dd>
            <dt><strong>¿Es seguro convertir logotipos de clientes?</strong></dt>
            <dd>Totalmente seguro, ningún archivo sale de la memoria de tu navegador.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/es/free-geo-tagger": {
    title: "Geolocalizar Fotos Online Gratis — Editor EXIF GPS | ImageSEO",
    description: "Añade coordenadas GPS y metadatos EXIF a tus fotos para potenciar el SEO local y Google Business Profile. Mapa interactivo 100% privado en el navegador.",
    schemaType: "WebApplication",
    lang: "es",
    faqs: [
      { q: "¿Cómo ayuda la geolocalización de fotos (geotagging) al SEO local?", a: "Los metadatos GPS incrustados en la cabecera EXIF proporcionan a Google y a los algoritmos de mapas una confirmación verificable de la ubicación física donde opera tu negocio o servicio." },
      { q: "¿Lee Google las coordenadas GPS EXIF para posicionar en Google Maps y GBP?", a: "Sí. Google extrae metadatos EXIF en Google Business Profile y búsquedas locales. Al combinarse con nombres de archivo optimizados y páginas de destino locales, refuerza la relevancia geográfica." },
      { q: "¿Cómo añadir coordenadas GPS a fotos para Google Business Profile?", a: "Selecciona tu ubicación en nuestro mapa, sube tus fotos de trabajos o local comercial, genera las etiquetas GPS y descarga el archivo JPEG listo para subir a tu ficha de negocio." },
      { q: "¿Qué formatos de imagen admiten metadatos GPS EXIF?", a: "El formato estándar universal para metadatos EXIF GPS es JPEG/JPG. Nuestra herramienta convierte y optimiza automáticamente las fotos en JPEG con compatibilidad EXIF total." },
      { q: "¿Son privadas y seguras mis fotos y datos de localización?", a: "100% privadas. El procesamiento se ejecuta en el entorno seguro de tu navegador. Ninguna imagen o coordenada se envía a servidores de terceros." }
    ],
    body: `
      <main>
        <h1>Geolocalizador de Fotos y Editor EXIF GPS Gratis</h1>
        <p>Incrusta latitud y longitud en fotos JPEG para verificar la relevancia geográfica de tu negocio local ante Google.</p>
        <section>
          <h2>Cómo añadir coordenadas GPS a tus fotos</h2>
          <ol>
            <li>Busca la dirección de tu negocio o área de servicio en el mapa interactivo.</li>
            <li>Sube las fotografías de tus proyectos, tienda o instalaciones.</li>
            <li>Genera y descarga las fotos JPEG con los metadatos GPS incrustados en EXIF.</li>
          </ol>
        </section>
        <section>
          <h2>Impacto del Geoetiquetado en el Local 3-Pack de Google</h2>
          <p>Para negocios locales como fontaneros, cerrajeros, electricistas y reformas, subir fotos geoetiquetadas con frecuencia refuerza la autoridad local ante Google Maps y aumenta las llamadas directas de clientes cercanos.</p>
        </section>
        <section class="faqs">
          <h2>Preguntas Frecuentes sobre Geotagging de Fotos</h2>
          <dl>
            <dt><strong>¿Cómo ayuda la geolocalización de fotos (geotagging) al SEO local?</strong></dt>
            <dd>Los metadatos GPS incrustados en la cabecera EXIF proporcionan a Google y a los algoritmos de mapas una confirmación verificable de la ubicación física donde opera tu negocio o servicio.</dd>
            <dt><strong>¿Lee Google las coordenadas GPS EXIF para posicionar en Google Maps y GBP?</strong></dt>
            <dd>Sí. Google extrae metadatos EXIF en Google Business Profile y búsquedas locales. Al combinarse con nombres de archivo optimizados y páginas de destino locales, refuerza la relevancia geográfica.</dd>
            <dt><strong>¿Cómo añadir coordenadas GPS a fotos para Google Business Profile?</strong></dt>
            <dd>Selecciona tu ubicación en nuestro mapa, sube tus fotos de trabajos o local comercial, genera las etiquetas GPS y descarga el archivo JPEG listo para subir a tu ficha de negocio.</dd>
            <dt><strong>¿Qué formatos de imagen admiten metadatos GPS EXIF?</strong></dt>
            <dd>El formato estándar universal para metadatos EXIF GPS es JPEG/JPG. Nuestra herramienta convierte y optimiza automáticamente las fotos en JPEG con compatibilidad EXIF total.</dd>
            <dt><strong>¿Son privadas y seguras mis fotos y datos de localización?</strong></dt>
            <dd>100% privadas. El procesamiento se ejecuta en el entorno seguro de tu navegador. Ninguna imagen o coordenada se envía a servidores de terceros.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/es/free-online-image-compressor": {
    title: "Compresor de Imágenes Online Gratis — Rápido y Seguro | ImageSEO",
    description: "Comprime fotos JPG, PNG y WebP por lotes sin perder calidad visual. Optimización 100% local en tu navegador sin registro ni almacenamiento en servidores.",
    schemaType: "WebApplication",
    lang: "es",
    faqs: [
      { q: "¿Cómo reduce este compresor el tamaño en KB sin perder calidad visual?", a: "Utiliza algoritmos inteligentes de compresión en Canvas que eliminan información redundante de píxeles imperceptible para el ojo humano, reduciendo drásticamente el peso del archivo." },
      { q: "¿Cuál es el peso recomendado en KB para imágenes de un sitio web?", a: "Para banners y cabeceras principales, se recomienda mantener el peso por debajo de 150KB–200KB; para fotos de artículos y galerías, entre 50KB y 100KB; y para miniaturas, menos de 30KB." },
      { q: "¿Mejora la compresión de imágenes la puntuación en Google PageSpeed Insights?", a: "Sí. Las imágenes pesadas son la principal causa de retraso en la métrica Largest Contentful Paint (LCP). Comprimir tus fotos puede reducir el peso total de la página hasta un 80%." },
      { q: "¿Existe límite en la cantidad de fotos o tamaño que puedo comprimir?", a: "No hay límites. La compresión corre localmente con el hardware de tu propio dispositivo, sin suscripciones, marcas de agua ni colas de espera." },
      { q: "¿Es seguro comprimir fotos confidenciales de clientes?", a: "Totalmente seguro. Tus fotos nunca salen de tu ordenador ni se transfieren por internet." }
    ],
    body: `
      <main>
        <h1>Compresor de Imágenes Online Gratis y Sin Límites</h1>
        <p>Comprime lotes enteros de fotos JPG, PNG y WebP sin colas ni límites de archivo. Procesamiento local instantáneo.</p>
        <section>
          <h2>Cómo comprimir fotos online fácilmente</h2>
          <ol>
            <li>Arrastra tantas fotos como quieras al compresor.</li>
            <li>Ajusta el nivel de calidad visual según tus necesidades de KB.</li>
            <li>Descarga las imágenes optimizadas de una sola vez en un archivo ZIP.</li>
          </ol>
        </section>
        <section class="faqs">
          <h2>Preguntas Frecuentes sobre Compresión de Fotos</h2>
          <dl>
            <dt><strong>¿Cómo reduce este compresor el tamaño en KB sin perder calidad visual?</strong></dt>
            <dd>Utiliza algoritmos inteligentes de compresión en Canvas que eliminan información redundante de píxeles imperceptible para el ojo humano, reduciendo drásticamente el peso del archivo.</dd>
            <dt><strong>¿Cuál es el peso recomendado en KB para imágenes de un sitio web?</strong></dt>
            <dd>Para banners y cabeceras principales, se recomienda mantener el peso por debajo de 150KB–200KB; para fotos de artículos y galerías, entre 50KB y 100KB; y para miniaturas, menos de 30KB.</dd>
            <dt><strong>¿Mejora la compresión de imágenes la puntuación en Google PageSpeed Insights?</strong></dt>
            <dd>Sí. Las imágenes pesadas son la principal causa de retraso en la métrica Largest Contentful Paint (LCP). Comprimir tus fotos puede reducir el peso total de la página hasta un 80%.</dd>
            <dt><strong>¿Existe límite en la cantidad de fotos o tamaño que puedo comprimir?</strong></dt>
            <dd>No hay límites. La compresión corre localmente con el hardware de tu propio dispositivo, sin suscripciones, marcas de agua ni colas de espera.</dd>
            <dt><strong>¿Es seguro comprimir fotos confidenciales de clientes?</strong></dt>
            <dd>Totalmente seguro. Tus fotos nunca salen de tu ordenador ni se transfieren por internet.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/es/compress-jpg": {
    title: "Comprimir JPG Online Gratis — Reduce Tamaño en KB | ImageSEO",
    description: "Reduce el peso en KB de tus imágenes JPG manteniendo una nitidez impecable. Procesamiento por lotes instantáneo y totalmente seguro.",
    schemaType: "WebApplication",
    lang: "es",
    faqs: [
      { q: "¿Cómo comprimir fotos JPG sin que se vean borrosas?", a: "Nuestro algoritmo ajusta las tablas de cuantización para eliminar datos invisibles manteniendo nítidos los bordes y colores." },
      { q: "¿Cuál es el nivel de compresión recomendado para fotos JPG en blogs?", a: "Entre 75% y 80% suele reducir el peso un 70% sin ninguna pérdida de calidad apreciable." },
      { q: "¿Se pueden comprimir fotos JPG pesadas de más de 10 MB?", a: "Sí, se procesan fluidamente gracias al motor de renderizado local del navegador." },
      { q: "¿Es gratis comprimir fotos JPG por lotes?", a: "Sí, completamente gratuito y sin registro." },
      { q: "¿Están seguras mis fotografías personales?", a: "100% seguras, ninguna foto se envía a internet." }
    ],
    body: `
      <main>
        <h1>Comprimir Fotos JPG Gratis Online</h1>
        <p>Optimiza fotografías JPG reduciendo el espacio en disco sin degradar los colores ni los detalles visuales.</p>
        <section>
          <h2>Guía rápida de compresión JPG</h2>
          <ol>
            <li>Selecciona tus imágenes JPG o JPEG.</li>
            <li>Ajusta el porcentaje de compresión para obtener el peso ideal.</li>
            <li>Descarga las imágenes listas para publicar.</li>
          </ol>
        </section>
        <section class="faqs">
          <h2>Preguntas Frecuentes</h2>
          <dl>
            <dt><strong>¿Cómo comprimir fotos JPG sin que se vean borrosas?</strong></dt>
            <dd>Nuestro algoritmo ajusta las tablas de cuantización para eliminar datos invisibles manteniendo nítidos los bordes y colores.</dd>
            <dt><strong>¿Cuál es el nivel de compresión recomendado para fotos JPG en blogs?</strong></dt>
            <dd>Entre 75% y 80% suele reducir el peso un 70% sin ninguna pérdida de calidad apreciable.</dd>
            <dt><strong>¿Se pueden comprimir fotos JPG pesadas de más de 10 MB?</strong></dt>
            <dd>Sí, se procesan fluidamente gracias al motor de renderizado local del navegador.</dd>
            <dt><strong>¿Es gratis comprimir fotos JPG por lotes?</strong></dt>
            <dd>Sí, completamente gratuito y sin registro.</dd>
            <dt><strong>¿Están seguras mis fotografías personales?</strong></dt>
            <dd>100% seguras, ninguna foto se envía a internet.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/es/compress-image-to-kb": {
    title: "Comprimir Fotos a 20KB, 50KB, 100KB, 200KB Online | ImageSEO",
    description: "Comprime fotos JPG, PNG y WebP a límites exactos en KB directamente en tu navegador. 100% privado, gratis y sin subir archivos.",
    schemaType: "WebApplication",
    lang: "es",
    faqs: [
      { q: "¿Cómo funciona la compresión a un tamaño exacto en KB?", a: "Utiliza un algoritmo de búsqueda binaria inteligente en Canvas para ajustar iterativamente la compresión hasta alcanzar el límite exacto fijado (ej. 20KB, 50KB, 100KB o 200KB)." },
      { q: "¿Sirve para trámites públicos, pasaportes y oposiciones?", a: "Sí, es ideal para convocatorias de empleo público, visados y plataformas oficiales con límites estrictos de tamaño." },
      { q: "¿Qué formatos puedo comprimir a un tamaño exacto de KB?", a: "JPG, PNG y WebP son totalmente compatibles con la compresión a KB objetivo." },
      { q: "¿Se pierde legibilidad al reducir una foto a 20KB o 50KB?", a: "El algoritmo preserva los rasgos faciales y la legibilidad de documentos y firmas." },
      { q: "¿Es gratis y sin límites de archivos?", a: "Sí, puedes procesar tantas fotos como necesites sin coste alguno." }
    ],
    body: `
      <main>
        <h1>Comprimir Fotos a KB Exactos Online (20KB, 50KB, 100KB, 200KB)</h1>
        <p>Reduce el tamaño de tus fotos a límites estrictos como 20KB, 50KB, 100KB o 200KB para portales de empleo, trámites públicos y tiendas online.</p>
        <section>
          <h2>Cómo reducir fotos a un tamaño exacto en KB</h2>
          <ol>
            <li>Elige el límite objetivo en KB (ej. 20KB, 50KB, 100KB o 200KB).</li>
            <li>Sube la fotografía de tu carnet, firma o documento.</li>
            <li>Descarga la imagen ajustada con precisión por debajo del límite exigido.</li>
          </ol>
        </section>
        <section class="faqs">
          <h2>Preguntas Frecuentes</h2>
          <dl>
            <dt><strong>¿Cómo funciona la compresión a un tamaño exacto en KB?</strong></dt>
            <dd>Utiliza un algoritmo de búsqueda binaria inteligente en Canvas para ajustar iterativamente la compresión hasta alcanzar el límite exacto fijado (ej. 20KB, 50KB, 100KB o 200KB).</dd>
            <dt><strong>¿Sirve para trámites públicos, pasaportes y oposiciones?</strong></dt>
            <dd>Sí, es ideal para convocatorias de empleo público, visados y plataformas oficiales con límites estrictos de tamaño.</dd>
            <dt><strong>¿Qué formatos puedo comprimir a un tamaño exacto de KB?</strong></dt>
            <dd>JPG, PNG y WebP son totalmente compatibles con la compresión a KB objetivo.</dd>
            <dt><strong>¿Se pierde legibilidad al reducir una foto a 20KB o 50KB?</strong></dt>
            <dd>El algoritmo preserva los rasgos faciales y la legibilidad de documentos y firmas.</dd>
            <dt><strong>¿Es gratis y sin límites de archivos?</strong></dt>
            <dd>Sí, puedes procesar tantas fotos como necesites sin coste alguno.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/es/image-seo": {
    title: "Guía Completa de SEO para Imágenes (2025) | ImageSEO",
    description: "Aprende a optimizar imágenes para Google: formatos WebP, compresión sin pérdida, etiquetas alt, nombres de archivo descriptivos y geolocalización EXIF.",
    schemaType: "Article",
    lang: "es",
    faqs: [
      { q: "¿Qué es el SEO para imágenes y por qué es vital?", a: "Es la disciplina de optimizar el texto alternativo, nombres de archivo, dimensiones, formatos modernos y metadatos para posicionar en Google Imágenes y acelerar la web." },
      { q: "¿Cómo redactar un texto alternativo (Alt Text) perfecto?", a: "Describe la imagen en 10-15 palabras de manera natural e incluye la palabra clave principal sólo si es relevante para el contexto." },
      { q: "¿Cómo deben nombrarse los archivos de imagen para SEO?", a: "Usa minúsculas separadas con guiones descriptivos (ej. 'reparacion-calderas-madrid.webp')." },
      { q: "¿Cómo influyen las dimensiones de la imagen en Core Web Vitals (CLS)?", a: "Declara siempre atributos width y height explícitos en HTML para evitar saltos de diseño (CLS)." },
      { q: "¿Indexa Google las imágenes WebP igual de bien que las JPG?", a: "Sí, Google indexa WebP perfectamente y suele premiarlas con mejores rankings debido a la mayor velocidad de carga." }
    ],
    body: `
      <main>
        <article>
          <h1>Guía Completa de SEO para Imágenes y Optimización Web</h1>
          <p>El SEO para imágenes consiste en proporcionar el contexto adecuado a los motores de búsqueda mediante texto alternativo descriptivo, nombres de archivo estructurados y formatos ligeros de nueva generación.</p>
          <section>
            <h2>1. Escribe texto alternativo útil (Alt Text)</h2>
            <p>Describe el contenido relevante de la imagen con naturalidad, evitando la acumulación de palabras clave forzadas.</p>
          </section>
          <section>
            <h2>2. Nombres de archivo descriptivos</h2>
            <p>Reemplaza nombres genéricos por términos descriptivos separados con guiones (por ejemplo: reparacion-tejados-madrid.webp).</p>
          </section>
          <section>
            <h2>3. Utiliza WebP para mayor velocidad</h2>
            <p>WebP acelera la carga de tus páginas en dispositivos móviles, optimizando la métrica Core Web Vitals (LCP).</p>
          </section>
          <section class="faqs">
            <h2>Preguntas Frecuentes sobre SEO de Imágenes</h2>
            <dl>
              <dt><strong>¿Qué es el SEO para imágenes y por qué es vital?</strong></dt>
              <dd>Es la disciplina de optimizar el texto alternativo, nombres de archivo, dimensiones, formatos modernos y metadatos para posicionar en Google Imágenes y acelerar la web.</dd>
              <dt><strong>¿Cómo redactar un texto alternativo (Alt Text) perfecto?</strong></dt>
              <dd>Describe la imagen en 10-15 palabras de manera natural e incluye la palabra clave principal sólo si es relevante para el contexto.</dd>
              <dt><strong>¿Cómo deben nombrarse los archivos de imagen para SEO?</strong></dt>
              <dd>Usa minúsculas separadas con guiones descriptivos (ej. 'reparacion-calderas-madrid.webp').</dd>
              <dt><strong>¿Cómo influyen las dimensiones de la imagen en Core Web Vitals (CLS)?</strong></dt>
              <dd>Declara siempre atributos width y height explícitos en HTML para evitar saltos de diseño (CLS).</dd>
              <dt><strong>¿Indexa Google las imágenes WebP igual de bien que las JPG?</strong></dt>
              <dd>Sí, Google indexa WebP perfectamente y suele premiarlas con mejores rankings debido a la mayor velocidad de carga.</dd>
            </dl>
          </section>
        </article>
      </main>
    `
  },

  // ─── Portuguese (pt) Pages (9 routes) ───
  "/pt": {
    title: "Ferramentas de SEO para Imagens Grátis e Rápidas | ImageSEO",
    description: "Otimize, comprima, converta para WebP e adicione geotags às suas fotos direto no navegador. 100% privado, ilimitado e sem enviar arquivos a servidores.",
    schemaType: "WebApplication",
    lang: "pt",
    faqs: [
      { q: "O que é o ImageSEO e como ele melhora o ranqueamento no Google?", a: "O ImageSEO é um conjunto de ferramentas de otimização de fotos que converte para WebP, comprime imagens e injeta coordenadas GPS para impulsionar o SEO local e o Core Web Vitals." },
      { q: "As minhas fotos são salvas em algum servidor?", a: "Não. Todas as conversões e compressões ocorrem 100% na memória local do seu navegador." },
      { q: "Qual a vantagem de converter fotos para WebP?", a: "O formato WebP reduz o peso das imagens em até 80% sem perda visual, acelerando drasticamente o carregamento no celular." },
      { q: "Como o geotagging de fotos ajuda no Google Meu Negócio?", a: "A inclusão de coordenadas GPS no EXIF fornece prova geográfica aos algoritmos do Google Maps sobre o local de atuação da sua empresa." },
      { q: "O ImageSEO é gratuito para uso comercial?", a: "Sim, 100% gratuito, sem marcas d'água e sem limites de quantidade." }
    ],
    body: `
      <main>
        <h1>Ferramentas de SEO para Imagens Grátis e 100% Privadas</h1>
        <p>Otimize fotos para a web no seu navegador. Converta para WebP, diminua o tamanho em KB de JPG e PNG e adicione coordenadas EXIF GPS.</p>
        <section>
          <h2>Ferramentas Principais</h2>
          <ul>
            <li><a href="/pt/free-webp-converter">Conversor WebP Grátis</a> — Converta imagens para o formato WebP moderno.</li>
            <li><a href="/pt/free-online-image-compressor">Compressor de Imagens Online</a> — Diminua o peso em KB mantendo alta nitidez.</li>
            <li><a href="/pt/free-geo-tagger">Geotag de Fotos GPS</a> — Insira coordenadas GPS EXIF com total privacidade.</li>
            <li><a href="/pt/jpg-to-webp">Converter JPG em WebP</a> — Otimização de fotos para velocidade web.</li>
            <li><a href="/pt/png-to-webp">Converter PNG em WebP</a> — Preserve transparência com arquivos 70% menores.</li>
            <li><a href="/pt/compress-jpg">Comprimir JPG</a> — Reduza o tamanho de fotos JPEG.</li>
            <li><a href="/pt/compress-image-to-kb">Comprimir Fotos para KB Exato</a> — Diminua para 20KB, 50KB ou 100KB.</li>
            <li><a href="/pt/image-seo">Guia Completo de SEO para Imagens</a> — Boas práticas de alt text, nomes de arquivo e LCP.</li>
          </ul>
        </section>
        <section class="faqs">
          <h2>Perguntas Frequentes</h2>
          <dl>
            <dt><strong>O que é o ImageSEO e como ele melhora o ranqueamento no Google?</strong></dt>
            <dd>O ImageSEO é um conjunto de ferramentas de otimização de fotos que converte para WebP, comprime imagens e injeta coordenadas GPS para impulsionar o SEO local e o Core Web Vitals.</dd>
            <dt><strong>As minhas fotos são salvas em algum servidor?</strong></dt>
            <dd>Não. Todas as conversões e compressões ocorrem 100% na memória local do seu navegador.</dd>
            <dt><strong>Qual a vantagem de converter fotos para WebP?</strong></dt>
            <dd>O formato WebP reduz o peso das imagens em até 80% sem perda visual, acelerando drasticamente o carregamento no celular.</dd>
            <dt><strong>Como o geotagging de fotos ajuda no Google Meu Negócio?</strong></dt>
            <dd>A inclusão de coordenadas GPS no EXIF fornece prova geográfica aos algoritmos do Google Maps sobre o local de atuação da sua empresa.</dd>
            <dt><strong>O ImageSEO é gratuito para uso comercial?</strong></dt>
            <dd>Sim, 100% gratuito, sem marcas d'água e sem limites de quantidade.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/pt/free-webp-converter": {
    title: "Conversor WebP Grátis Online — Rápido e Sem Limites | ImageSEO",
    description: "Converta fotos para o formato WebP moderno instantaneamente. Reduza o peso do seu site mantendo excelente qualidade visual com processamento local seguro.",
    schemaType: "WebApplication",
    lang: "pt",
    faqs: [
      { q: "Por que converter imagens para WebP no SEO?", a: "O formato WebP gera arquivos até 35% menores que o JPEG com a mesma fidelidade visual, melhorando o Largest Contentful Paint (LCP) e a velocidade mobile." },
      { q: "A qualidade da imagem diminui ao converter para WebP?", a: "Não perceptivelmente. O WebP utiliza algoritmos preditivos avançados que preservam bordas e gradientes removendo dados redundantes." },
      { q: "O formato WebP é compatível com todos os navegadores modernos?", a: "Sim. Google Chrome, Safari, Firefox, Edge e navegadores mobile no Android e iOS oferecem suporte completo ao WebP (mais de 97% dos usuários globais)." },
      { q: "As minhas fotos são enviadas para algum servidor durante a conversão?", a: "Não. Toda a conversão ocorre localmente na memória do seu navegador via HTML5 Canvas. Total privacidade e segurança." },
      { q: "Posso converter várias imagens para WebP em lote de uma só vez?", a: "Sim. Você pode arrastar dezenas de fotos simultaneamente e baixá-las em um único arquivo ZIP consolidado." }
    ],
    body: `
      <main>
        <h1>Conversor WebP Grátis Online no Navegador</h1>
        <p>Transforme fotos JPG e PNG em WebP com velocidade instantânea sem subir arquivos a servidores.</p>
        <section>
          <h2>Como converter fotos para WebP passo a passo</h2>
          <ol>
            <li>Selecione ou arraste imagens JPG, PNG ou AVIF.</li>
            <li>Ajuste a qualidade desejada no controle deslizante.</li>
            <li>Baixe seus arquivos WebP individualmente ou em um arquivo ZIP.</li>
          </ol>
        </section>
        <section class="faqs">
          <h2>Perguntas Frequentes sobre Conversão WebP</h2>
          <dl>
            <dt><strong>Por que converter imagens para WebP no SEO?</strong></dt>
            <dd>O formato WebP gera arquivos até 35% menores que o JPEG com a mesma fidelidade visual, melhorando o Largest Contentful Paint (LCP) e a velocidade mobile.</dd>
            <dt><strong>A qualidade da imagem diminui ao converter para WebP?</strong></dt>
            <dd>Não perceptivelmente. O WebP utiliza algoritmos preditivos avançados que preservam bordas e gradientes removendo dados redundantes.</dd>
            <dt><strong>O formato WebP é compatível com todos os navegadores modernos?</strong></dt>
            <dd>Sim. Google Chrome, Safari, Firefox, Edge e navegadores mobile no Android e iOS oferecem suporte completo ao WebP (mais de 97% dos usuários globais).</dd>
            <dt><strong>As minhas fotos são enviadas para algum servidor durante a conversão?</strong></dt>
            <dd>Não. Toda a conversão ocorre localmente na memória do seu navegador via HTML5 Canvas. Total privacidade e segurança.</dd>
            <dt><strong>Posso converter várias imagens para WebP em lote de uma só vez?</strong></dt>
            <dd>Sim. Você pode arrastar dezenas de fotos simultaneamente e baixá-las em um único arquivo ZIP consolidado.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/pt/jpg-to-webp": {
    title: "Converter JPG em WebP Online Grátis — Rápido e Seguro | ImageSEO",
    description: "Transforme imagens JPG em WebP super leves. Melhore o Core Web Vitals e o tempo de carregamento da sua loja ou blog com processamento 100% no navegador.",
    schemaType: "WebApplication",
    lang: "pt",
    faqs: [
      { q: "Qual a economia média ao converter JPG para WebP?", a: "Em média, as fotos ficam entre 35% e 50% menores em KB mantendo nitidez fotográfica idêntica." },
      { q: "Funciona em iPhones e Android?", a: "Sim, WebP é suportado nativamente em todos os dispositivos modernos iOS e Android." },
      { q: "Acelera lojas virtuais como Shopify e Nuvemshop?", a: "Sim, reduz o tempo de carregamento de páginas de produtos, aumentando a taxa de conversão de vendas." },
      { q: "Posso converter fotos de alta resolução?", a: "Sim, sem limites de tamanho ou resolução." },
      { q: "É seguro e confidencial?", a: "Totalmente seguro, todo o processamento ocorre no seu aparelho." }
    ],
    body: `
      <main>
        <h1>Converter JPG em WebP Grátis Online</h1>
        <p>Conversão fotográfica rápida de JPEG para WebP para acelerar seu site e melhorar o LCP no Google.</p>
        <section class="faqs">
          <h2>Perguntas Frequentes</h2>
          <dl>
            <dt><strong>Qual a economia média ao converter JPG para WebP?</strong></dt>
            <dd>Em média, as fotos ficam entre 35% e 50% menores em KB mantendo nitidez fotográfica idêntica.</dd>
            <dt><strong>Funciona em iPhones e Android?</strong></dt>
            <dd>Sim, WebP é suportado nativamente em todos os dispositivos modernos iOS e Android.</dd>
            <dt><strong>Acelera lojas virtuais como Shopify e Nuvemshop?</strong></dt>
            <dd>Sim, reduz o tempo de carregamento de páginas de produtos, aumentando a taxa de conversão de vendas.</dd>
            <dt><strong>Posso converter fotos de alta resolução?</strong></dt>
            <dd>Sim, sem limites de tamanho ou resolução.</dd>
            <dt><strong>É seguro e confidencial?</strong></dt>
            <dd>Totalmente seguro, todo o processamento ocorre no seu aparelho.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/pt/png-to-webp": {
    title: "Converter PNG em WebP Online Grátis — Com Transparência | ImageSEO",
    description: "Converta arquivos PNG para WebP mantendo fundo transparente com até 80% de redução no tamanho do arquivo. Rápido, seguro e sem limites.",
    schemaType: "WebApplication",
    lang: "pt",
    faqs: [
      { q: "O WebP mantém o fundo transparente de arquivos PNG?", a: "Sim, suporta transparência total (canal alfa) com arquivos até 70% mais leves que o PNG-24." },
      { q: "Ideal para logotipos e ícones?", a: "Sim, reduz o peso de gráficos do site sem serrilhar bordas." },
      { q: "Posso converter PNG em lote?", a: "Sim, arraste múltiplos arquivos e baixe em ZIP." },
      { q: "Como afeta a velocidade do site?", a: "Diminui significativamente o peso das páginas com muitos gráficos." },
      { q: "É gratuito?", a: "100% gratuito e sem cadastro." }
    ],
    body: `
      <main>
        <h1>Converter PNG em WebP com Fundo Transparente</h1>
        <p>Converta imagens PNG para WebP preservando transparência alfa com arquivos muito menores.</p>
        <section class="faqs">
          <h2>Perguntas Frequentes</h2>
          <dl>
            <dt><strong>O WebP mantém o fundo transparente de arquivos PNG?</strong></dt>
            <dd>Sim, suporta transparência total (canal alfa) com arquivos até 70% mais leves que o PNG-24.</dd>
            <dt><strong>Ideal para logotipos e ícones?</strong></dt>
            <dd>Sim, reduz o peso de gráficos do site sem serrilhar bordas.</dd>
            <dt><strong>Posso converter PNG em lote?</strong></dt>
            <dd>Sim, arraste múltiplos arquivos e baixe em ZIP.</dd>
            <dt><strong>Como afeta a velocidade do site?</strong></dt>
            <dd>Diminui significativamente o peso das páginas com muitos gráficos.</dd>
            <dt><strong>É gratuito?</strong></dt>
            <dd>100% gratuito e sem cadastro.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/pt/free-geo-tagger": {
    title: "Adicionar Localização em Fotos Grátis — Editor EXIF GPS | ImageSEO",
    description: "Insira coordenadas GPS e metadatos EXIF em fotos para impulsionar o SEO local e o Perfil da Empresa no Google. Mapa interativo 100% privado.",
    schemaType: "WebApplication",
    lang: "pt",
    faqs: [
      { q: "Como o geotagging de fotos ajuda no SEO local?", a: "As coordenadas GPS embutidas no cabeçalho EXIF confirmam para os motores de busca o local geográfico real onde seu serviço ou empresa opera." },
      { q: "O Google lê dados GPS EXIF para ranquear no Google Maps e Perfil da Empresa?", a: "Sim. O Google analisa metadados EXIF como um sinal de relevância geográfica, especialmente quando combinado com nomes de arquivo locais e páginas correspondentes." },
      { q: "Como adicionar coordenadas GPS em fotos do Google Meu Negócio?", a: "Defina o local no mapa interativo, carregue as fotos do seu estabelecimento, gere as tags GPS e faça upload das imagens JPEG geradas no seu perfil." },
      { q: "Quais formatos de imagem suportam metadados EXIF GPS?", a: "O padrão universal com suporte nativo a EXIF GPS é o JPEG/JPG. Nossa ferramenta gera arquivos JPEG perfeitamente compatíveis." },
      { q: "Minhas fotos e dados de localização ficam salvos em algum lugar?", a: "Não. Toda a inserção de metadados ocorre 100% no seu próprio navegador. Nada é enviado para a nuvem." }
    ],
    body: `
      <main>
        <h1>Geotag de Fotos e Editor EXIF GPS Grátis</h1>
        <p>Insira latitude e longitude em fotos JPEG diretamente no seu navegador para fortalecer seu SEO local.</p>
        <section class="faqs">
          <h2>Perguntas Frequentes sobre Geotagging</h2>
          <dl>
            <dt><strong>Como o geotagging de fotos ajuda no SEO local?</strong></dt>
            <dd>As coordenadas GPS embutidas no cabeçalho EXIF confirmam para os motores de busca o local geográfico real onde seu serviço ou empresa opera.</dd>
            <dt><strong>O Google lê dados GPS EXIF para ranquear no Google Maps e Perfil da Empresa?</strong></dt>
            <dd>Sim. O Google analisa metadados EXIF como um sinal de relevância geográfica, especialmente quando combinado com nomes de arquivo locais e páginas correspondentes.</dd>
            <dt><strong>Como adicionar coordenadas GPS em fotos do Google Meu Negócio?</strong></dt>
            <dd>Defina o local no mapa interativo, carregue as fotos do seu estabelecimento, gere as tags GPS e faça upload das imagens JPEG geradas no seu perfil.</dd>
            <dt><strong>Quais formatos de imagem suportam metadados EXIF GPS?</strong></dt>
            <dd>O padrão universal com suporte nativo a EXIF GPS é o JPEG/JPG. Nossa ferramenta gera arquivos JPEG perfeitamente compatíveis.</dd>
            <dt><strong>Minhas fotos e dados de localização ficam salvos em algum lugar?</strong></dt>
            <dd>Não. Toda a inserção de metadados ocorre 100% no seu próprio navegador. Nada é enviado para a nuvem.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/pt/free-online-image-compressor": {
    title: "Compressor de Imagens Online Grátis — Diminuir Tamanho de Fotos | ImageSEO",
    description: "Comprima fotos JPG, PNG e WebP em lote mantendo alta qualidade. Ferramenta rápida, segura e sem limites de upload com processamento local no navegador.",
    schemaType: "WebApplication",
    lang: "pt",
    faqs: [
      { q: "Como este compressor reduz o tamanho do arquivo sem perder qualidade?", a: "Ele utiliza algoritmos inteligentes de compressão Canvas que removem dados imperceptíveis ao olho humano, reduzindo os KBs drasticamente." },
      { q: "Qual o tamanho de arquivo recomendado para imagens de websites?", a: "Imagens de destaque e banners devem ficar abaixo de 150KB–200KB; fotos de artigos abaixo de 100KB; e ícones ou miniaturas abaixo de 30KB." },
      { q: "Comprimir imagens melhora o PageSpeed Insights do Google?", a: "Sim. O peso das imagens é a causa mais comum de lentidão no LCP. A compressão pode reduzir o peso total da página em até 80%." },
      { q: "Existe limite no número de fotos ou tamanho para comprimir?", a: "Não há limites. A ferramenta roda com o poder de processamento do seu próprio aparelho, sem planos pagos nem cadastros." },
      { q: "É seguro comprimir fotos comerciais e confidenciais?", a: "Totalmente seguro. Os arquivos nunca saem da memória local do seu navegador." }
    ],
    body: `
      <main>
        <h1>Compressor de Imagens Online Grátis e Ilimitado</h1>
        <p>Comprima fotos JPG, PNG e WebP no navegador sem perda visual e aumente o PageSpeed do seu site.</p>
        <section class="faqs">
          <h2>Perguntas Frequentes sobre Compressão</h2>
          <dl>
            <dt><strong>Como este compressor reduz o tamanho do arquivo sem perder qualidade?</strong></dt>
            <dd>Ele utiliza algoritmos inteligentes de compressão Canvas que removem dados imperceptíveis ao olho humano, reduzindo os KBs drasticamente.</dd>
            <dt><strong>Qual o tamanho de arquivo recomendado para imagens de websites?</strong></dt>
            <dd>Imagens de destaque e banners devem ficar abaixo de 150KB–200KB; fotos de artigos abaixo de 100KB; e ícones ou miniaturas abaixo de 30KB.</dd>
            <dt><strong>Comprimir imagens melhora o PageSpeed Insights do Google?</strong></dt>
            <dd>Sim. O peso das imagens é a causa mais comum de lentidão no LCP. A compressão pode reduzir o peso total da página em até 80%.</dd>
            <dt><strong>Existe limite no número de fotos ou tamanho para comprimir?</strong></dt>
            <dd>Não há limites. A ferramenta roda com o poder de processamento do seu próprio aparelho, sem planos pagos nem cadastros.</dd>
            <dt><strong>É seguro comprimir fotos comerciais e confidenciais?</strong></dt>
            <dd>Totalmente seguro. Os arquivos nunca saem da memória local do seu navegador.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/pt/compress-jpg": {
    title: "Comprimir JPG Online Grátis — Diminuir Tamanho em KB | ImageSEO",
    description: "Diminua o tamanho de fotos JPG em KB mantendo nitidez visual. Rápido, seguro e direto no seu navegador sem limite de uploads.",
    schemaType: "WebApplication",
    lang: "pt",
    faqs: [
      { q: "Como diminuir o tamanho de fotos JPG em KB?", a: "A ferramenta otimiza as matrizes de quantização JPEG removendo dados desnecessários sem alterar a resolução da foto." },
      { q: "Qual a melhor porcentagem para comprimir JPGs?", a: "Entre 75% e 80% oferece excelente equilíbrio com até 75% de redução no peso." },
      { q: "É gratuito?", a: "Sim, 100% gratuito." },
      { q: "Posso comprimir várias fotos de uma vez?", a: "Sim, arraste dezenas de fotos e baixe em arquivo ZIP." },
      { q: "As fotos ficam salvas online?", a: "Não, todo o processamento é local." }
    ],
    body: `
      <main>
        <h1>Comprimir JPG Online Grátis</h1>
        <p>Diminua o peso em KB de fotos JPG com processamento rápido no navegador.</p>
        <section class="faqs">
          <h2>Perguntas Frequentes</h2>
          <dl>
            <dt><strong>Como diminuir o tamanho de fotos JPG em KB?</strong></dt>
            <dd>A ferramenta otimiza as matrizes de quantização JPEG removendo dados desnecessários sem alterar a resolução da foto.</dd>
            <dt><strong>Qual a melhor porcentagem para comprimir JPGs?</strong></dt>
            <dd>Entre 75% e 80% oferece excelente equilíbrio com até 75% de redução no peso.</dd>
            <dt><strong>É gratuito?</strong></dt>
            <dd>Sim, 100% gratuito.</dd>
            <dt><strong>Posso comprimir várias fotos de uma vez?</strong></dt>
            <dd>Sim, arraste dezenas de fotos e baixe em arquivo ZIP.</dd>
            <dt><strong>As fotos ficam salvas online?</strong></dt>
            <dd>Não, todo o processamento é local.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/pt/compress-image-to-kb": {
    title: "Comprimir Foto para 20KB, 50KB, 100KB, 200KB Online | ImageSEO",
    description: "Comprima fotos para tamanhos exatos em KB diretamente no navegador para concursos públicos, vestibulares, passaportes e formulários.",
    schemaType: "WebApplication",
    lang: "pt",
    faqs: [
      { q: "Como comprimir fotos para tamanhos exatos em KB?", a: "O algoritmo faz uma busca binária ajustando a taxa de compressão para atingir exatamente o limite desejado (ex: 20KB, 50KB, 100KB ou 200KB)." },
      { q: "Serve para fotos 3x4 de documentos e concursos?", a: "Sim, é perfeito para formulários que exigem fotos com limite estrito de KB." },
      { q: "Quais formatos são aceitos?", a: "JPG, PNG e WebP." },
      { q: "A foto fica ilegível ao reduzir para 20KB?", a: "O algoritmo mantém a nitidez do rosto e de assinaturas." },
      { q: "É seguro para documentos pessoais?", a: "100% seguro, as fotos nunca saem do seu dispositivo." }
    ],
    body: `
      <main>
        <h1>Comprimir Foto para Tamanho Exato em KB (20KB, 50KB, 100KB, 200KB)</h1>
        <p>Ajuste suas imagens para limites exatos em KB para concursos públicos e formulários online.</p>
        <section class="faqs">
          <h2>Perguntas Frequentes</h2>
          <dl>
            <dt><strong>Como comprimir fotos para tamanhos exatos em KB?</strong></dt>
            <dd>O algoritmo faz uma busca binária ajustando a taxa de compressão para atingir exatamente o limite desejado (ex: 20KB, 50KB, 100KB ou 200KB).</dd>
            <dt><strong>Serve para fotos 3x4 de documentos e concursos?</strong></dt>
            <dd>Sim, é perfeito para formulários que exigem fotos com limite estrito de KB.</dd>
            <dt><strong>Quais formatos são aceitos?</strong></dt>
            <dd>JPG, PNG e WebP.</dd>
            <dt><strong>A foto fica ilegível ao reduzir para 20KB?</strong></dt>
            <dd>O algoritmo mantém a nitidez do rosto e de assinaturas.</dd>
            <dt><strong>É seguro para documentos pessoais?</strong></dt>
            <dd>100% seguro, as fotos nunca saem do seu dispositivo.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/pt/image-seo": {
    title: "Guia Completo de SEO para Imagens (2025) | ImageSEO",
    description: "Aprenda a otimizar imagens para o Google: formatos WebP, compressão, texto alternativo (alt text), nomes de arquivo e geotagging EXIF.",
    schemaType: "Article",
    lang: "pt",
    faqs: [
      { q: "O que é SEO para imagens?", a: "É a prática de otimizar alt text, nomes de arquivo, dimensões e formatos leves para ranquear no Google Imagens e acelerar o site." },
      { q: "Como escrever um alt text ideal?", a: "Descreva a imagem com clareza em 10 a 15 palavras incluindo a palavra-chave contextual de forma natural." },
      { q: "Como nomear arquivos de imagem para SEO?", a: "Use letras minúsculas separadas por hifens com termos descritivos (ex: 'reforma-apartamento-sao-paulo.webp')." },
      { q: "Como as dimensões afetam o Core Web Vitals (CLS)?", a: "Sempre defina atributos width e height no HTML para evitar deslocamento de layout." },
      { q: "O Google ranqueia imagens WebP tão bem quanto JPG?", a: "Sim, o Google indexa WebP com prioridade por ser um formato recomendado para velocidade." }
    ],
    body: `
      <main>
        <article>
          <h1>Guia Completo de SEO para Imagens e Velocidade de Sites</h1>
          <p>Aprenda a otimizar texto alt, nomes de arquivos, formatos WebP e geotagging para alcançar o topo do Google.</p>
          <section class="faqs">
            <h2>Perguntas Frequentes</h2>
            <dl>
              <dt><strong>O que é SEO para imagens?</strong></dt>
              <dd>É a prática de otimizar alt text, nomes de arquivo, dimensões e formatos leves para ranquear no Google Imagens e acelerar o site.</dd>
              <dt><strong>Como escrever um alt text ideal?</strong></dt>
              <dd>Descreva a imagem com clareza em 10 a 15 palavras incluindo a palavra-chave contextual de forma natural.</dd>
              <dt><strong>Como nomear arquivos de imagem para SEO?</strong></dt>
              <dd>Use letras minúsculas separadas por hifens com termos descritivos (ex: 'reforma-apartamento-sao-paulo.webp').</dd>
              <dt><strong>Como as dimensões afetam o Core Web Vitals (CLS)?</strong></dt>
              <dd>Sempre defina atributos width e height no HTML para evitar deslocamento de layout.</dd>
              <dt><strong>O Google ranqueia imagens WebP tão bem quanto JPG?</strong></dt>
              <dd>Sim, o Google indexa WebP com prioridade por ser um formato recomendado para velocidade.</dd>
            </dl>
          </section>
        </article>
      </main>
    `
  },

  // ─── Arabic (ar) Pages (9 routes) ───
  "/ar": {
    title: "أدوات سيو الصور وتحسين السرعة مجانًا وبخصوصية تامة | ImageSEO",
    description: "أدوات احترافية لتحسين وضغط وتحويل الصور إلى WebP وإضافة إحداثيات GPS في المتصفح دون رفعها لأي خادم. سرعة وخفة متوافقة مع شروط جوجل.",
    schemaType: "WebApplication",
    lang: "ar",
    faqs: [
      { q: "ما هي منصة ImageSEO وكيف تساهم في تحسين السيو؟", a: "ImageSEO هي مجموعة أدوات سحابية ومحلية تعمل في المتصفح لضغط الصور وتحويلها إلى صيغ الجيل الجديد WebP وإضافة إحداثيات GPS لتعزيز السيو المحلي وسرعة LCP." },
      { q: "هل صوري وبياناتي في أمان أثناء المعالجة؟", a: "نعم 100%، تتم كافة العمليات داخل متصفحك محليًا دون تخزين أو رفع أي صورة إلى أي خادم خارجي." },
      { q: "لماذا تعد صيغة WebP ضرورية لتسريع المواقع؟", a: "تقلل صيغة WebP حجم الصور بنسبة تصل إلى 80% مقارنة بصيغ JPG وPNG مع الحفاظ على الجودة البصرية العالية." },
      { q: "كيف تفيد إضافة إحداثيات GPS في خرائط جوجل؟", a: "تثبت إحداثيات GPS في بيانات EXIF للصور الموقع الحقيقي لنشاطك التجاري مما يعزز ظهورك في نتائج البحث المحلي." },
      { q: "هل استخدام الموقع مجاني وبلا قيود؟", a: "نعم، جميع الأدوات مجانية بالكامل وبلا أي قيود على عدد الصور أو حجمها." }
    ],
    body: `
      <main>
        <h1>أدوات سيو الصور وتحسين السرعة مجانًا وبخصوصية تامة</h1>
        <p>أدوات احترافية لتحسين وضغط وتحويل الصور إلى WebP وإضافة إحداثيات GPS في المتصفح دون رفعها لأي خادم.</p>
        <section>
          <h2>أدوات تحسين الصور الأساسية</h2>
          <ul>
            <li><a href="/ar/free-webp-converter">محول WebP مجاني</a> — تحويل فوري للصور إلى WebP.</li>
            <li><a href="/ar/free-online-image-compressor">برنامج ضغط الصور</a> — تصغير حجم الصور بالكيلوبايت.</li>
            <li><a href="/ar/free-geo-tagger">إضافة إحداثيات GPS للصور</a> — تثبيت بيانات EXIF الجغرافية.</li>
            <li><a href="/ar/jpg-to-webp">تحويل JPG إلى WebP</a> — تقليل حجم صور JPG.</li>
            <li><a href="/ar/png-to-webp">تحويل PNG إلى WebP</a> — الحفاظ على شفافية الخلفية بحجم خفيف.</li>
            <li><a href="/ar/compress-jpg">ضغط صور JPG</a> — تسريع تحميل صور JPEG.</li>
            <li><a href="/ar/compress-image-to-kb">تقليل حجم الصور بالكيلوبايت</a> — ضغط دقيق إلى 20KB أو 50KB أو 100KB.</li>
            <li><a href="/ar/image-seo">دليل سيو الصور الكامل</a> — تحسين النص البديل وتصنيفات جوجل.</li>
          </ul>
        </section>
        <section class="faqs">
          <h2>الأسئلة الشائعة</h2>
          <dl>
            <dt><strong>ما هي منصة ImageSEO وكيف تساهم في تحسين السيو؟</strong></dt>
            <dd>ImageSEO هي مجموعة أدوات سحابية ومحلية تعمل في المتصفح لضغط الصور وتحويلها إلى صيغ الجيل الجديد WebP وإضافة إحداثيات GPS لتعزيز السيو المحلي وسرعة LCP.</dd>
            <dt><strong>هل صوري وبياناتي في أمان أثناء المعالجة؟</strong></dt>
            <dd>نعم 100%، تتم كافة العمليات داخل متصفحك محليًا دون تخزين أو رفع أي صورة إلى أي خادم خارجي.</dd>
            <dt><strong>لماذا تعد صيغة WebP ضرورية لتسريع المواقع؟</strong></dt>
            <dd>تقلل صيغة WebP حجم الصور بنسبة تصل إلى 80% مقارنة بصيغ JPG وPNG مع الحفاظ على الجودة البصرية العالية.</dd>
            <dt><strong>كيف تفيد إضافة إحداثيات GPS في خرائط جوجل؟</strong></dt>
            <dd>تثبت إحداثيات GPS في بيانات EXIF للصور الموقع الحقيقي لنشاطك التجاري مما يعزز ظهورك في نتائج البحث المحلي.</dd>
            <dt><strong>هل استخدام الموقع مجاني وبلا قيود؟</strong></dt>
            <dd>نعم، جميع الأدوات مجانية بالكامل وبلا أي قيود على عدد الصور أو حجمها.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/ar/free-webp-converter": {
    title: "محول صور WebP مجاني أونلاين — بدون قيود حجم | ImageSEO",
    description: "حول الصور إلى صيغة WebP فائقة الخفة على الفور. سرّع موقعك الإلكتروني مع الحفاظ على دقة وجودة الصورة بمعالجة محلية آمنة داخل متصفحك.",
    schemaType: "WebApplication",
    lang: "ar",
    faqs: [
      { q: "لماذا يفضل استخدام صيغة WebP لتحسين السيو وتجربة المستخدم؟", a: "توفر صيغة WebP ضغطًا أعلى بنسبة تصل إلى 35% مقارنة بـ JPEG مع الحفاظ الكامل على نقاء الصورة، مما يسرع تحميل الموقع ويحسن مؤشرات Core Web Vitals." },
      { q: "هل تقل جودة الصورة عند تحويلها إلى صيغة WebP؟", a: "لا، تحافظ خوارزميات WebP على وضوح التفاصيل الدقيقة والألوان مع التخلص الذكي من البيانات غير الضرورية." },
      { q: "هل تدعم جميع المتصفحات الحديثة صيغة WebP؟", a: "نعم، تدعم متصفحات Google Chrome وSafari وFirefox وEdge وجميع متصفحات الهواتف الذكية صيغة WebP بنسبة تتجاوز 97%." },
      { q: "هل يتم رفع صوري إلى أي خادم خارجي أثناء التحويل؟", a: "لا على الإطلاق. تتم كل عمليات التحويل والمعالجة محليًا داخل ذاكرة متصفحك لضمان أقصى درجات الخصوصية والأمان." },
      { q: "هل يمكنني تحويل مجموعة صور معًا وتنزيلها في ملف مضغوط؟", a: "نعم، يمكنك سحب عشرات الصور دفعة واحدة وتحويلها وتنزيلها معًا في ملف ZIP بضغطة زر." }
    ],
    body: `
      <main>
        <h1>محول صور WebP مجاني وسريع في المتصفح</h1>
        <p>تحويل فوري إلى صيغة WebP لتسريع تحميل المواقع وتحسين نتائج محركات البحث.</p>
        <section class="faqs">
          <h2>الأسئلة الشائعة حول تحويل WebP</h2>
          <dl>
            <dt><strong>لماذا يفضل استخدام صيغة WebP لتحسين السيو وتجربة المستخدم؟</strong></dt>
            <dd>توفر صيغة WebP ضغطًا أعلى بنسبة تصل إلى 35% مقارنة بـ JPEG مع الحفاظ الكامل على نقاء الصورة، مما يسرع تحميل الموقع ويحسن مؤشرات Core Web Vitals.</dd>
            <dt><strong>هل تقل جودة الصورة عند تحويلها إلى صيغة WebP؟</strong></dt>
            <dd>لا، تحافظ خوارزميات WebP على وضوح التفاصيل الدقيقة والألوان مع التخلص الذكي من البيانات غير الضرورية.</dd>
            <dt><strong>هل تدعم جميع المتصفحات الحديثة صيغة WebP؟</strong></dt>
            <dd>نعم، تدعم متصفحات Google Chrome وSafari وFirefox وEdge وجميع متصفحات الهواتف الذكية صيغة WebP بنسبة تتجاوز 97%.</dd>
            <dt><strong>هل يتم رفع صوري إلى أي خادم خارجي أثناء التحويل؟</strong></dt>
            <dd>لا على الإطلاق. تتم كل عمليات التحويل والمعالجة محليًا داخل ذاكرة متصفحك لضمان أقصى درجات الخصوصية والأمان.</dd>
            <dt><strong>هل يمكنني تحويل مجموعة صور معًا وتنزيلها في ملف مضغوط؟</strong></dt>
            <dd>نعم، يمكنك سحب عشرات الصور دفعة واحدة وتحويلها وتنزيلها معًا في ملف ZIP بضغطة زر.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/ar/jpg-to-webp": {
    title: "تحويل JPG إلى WebP أونلاين مجانًا — سريع وخاص | ImageSEO",
    description: "حول صور JPG إلى WebP لتقليل حجم الصفحات وتحسين سرعة تحميل موقعك وترتيبك في محرك بحث جوجل بدون إعلانات مزعجة.",
    schemaType: "WebApplication",
    lang: "ar",
    faqs: [
      { q: "كم يبلغ التوفير في حجم الصور عند التحويل من JPG إلى WebP؟", a: "يصل التوفير في مساحة التخزين إلى ما بين 30% و 50% مع الحفاظ على نفس النقاء البصري." },
      { q: "هل يدعم WebP الهواتف الذكية؟", a: "نعم، تدعم هواتف أندرويد وآيفون صيغة WebP بصورة كاملة." },
      { q: "كيف يساعد تحويل JPG إلى WebP في تحسين سرعة المتجر؟", a: "يقلل وقت تحميل الصفحات الرئيسية وصفحات المنتجات ويزيد من تقييم Core Web Vitals." },
      { q: "هل يمكن تحويل الصور بدقة عالية؟", a: "نعم، يدعم المحول كافة الصور عالية الدقة بسهولة." },
      { q: "هل المحول آمن ومجاني؟", a: "نعم، مجاني 100% ويعمل محليًا داخل المتصفح." }
    ],
    body: `
      <main>
        <h1>تحويل JPG إلى WebP مجانًا أونلاين</h1>
        <p>تحويل صور JPG إلى WebP فائقة الخفة لتسريع موقعك الإلكتروني.</p>
        <section class="faqs">
          <h2>الأسئلة الشائعة</h2>
          <dl>
            <dt><strong>كم يبلغ التوفير في حجم الصور عند التحويل من JPG إلى WebP؟</strong></dt>
            <dd>يصل التوفير في مساحة التخزين إلى ما بين 30% و 50% مع الحفاظ على نفس النقاء البصري.</dd>
            <dt><strong>هل يدعم WebP الهواتف الذكية؟</strong></dt>
            <dd>نعم، تدعم هواتف أندرويد وآيفون صيغة WebP بصورة كاملة.</dd>
            <dt><strong>كيف يساعد تحويل JPG إلى WebP في تحسين سرعة المتجر؟</strong></dt>
            <dd>يقلل وقت تحميل الصفحات الرئيسية وصفحات المنتجات ويزيد من تقييم Core Web Vitals.</dd>
            <dt><strong>هل يمكن تحويل الصور بدقة عالية؟</strong></dt>
            <dd>نعم، يدعم المحول كافة الصور عالية الدقة بسهولة.</dd>
            <dt><strong>هل المحول آمن ومجاني؟</strong></dt>
            <dd>نعم، مجاني 100% ويعمل محليًا داخل المتصفح.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/ar/png-to-webp": {
    title: "تحويل PNG إلى WebP أونلاين مجانًا — بدون فقدان الشفافية | ImageSEO",
    description: "حول ملفات PNG إلى WebP مع الحفاظ الكامل على الخلفية الشفافة وتقليل الحجم بنسبة تصل إلى 80% لتسريع تجربة المستخدم.",
    schemaType: "WebApplication",
    lang: "ar",
    faqs: [
      { q: "هل تحافظ صيغة WebP على الخلفية الشفافة لصور PNG؟", a: "نعم، تدعم صيغة WebP ميزة الشفافية الكاملة وتنتج ملفات أصغر بنسبة تصل إلى 70% مقارنة بملفات PNG-24." },
      { q: "ما هي الاستخدامات الأفضل لصور PNG المحولة لـ WebP؟", a: "للشعارات، والأيقونات، والرسومات التوضيحية، ولقطات الشاشة الشفافة." },
      { q: "هل يتأثر وضوح الشعارات؟", a: "لا، تحافظ خوارزميات WebP على حدة الحواف والنصوص داخل الشعار." },
      { q: "هل التحويل جماعي؟", a: "نعم، يمكنك رفع عدة ملفات PNG وتحميلها كملف مضغوط ZIP." },
      { q: "هل الموقع آمن؟", a: "نعم، 100% محلي دون أي رفع للملفات." }
    ],
    body: `
      <main>
        <h1>تحويل PNG إلى WebP مع الحفاظ على الشفافية</h1>
        <p>تقليل حجم صور PNG مع الحفاظ على الشفافية بدقة متناهية.</p>
        <section class="faqs">
          <h2>الأسئلة الشائعة</h2>
          <dl>
            <dt><strong>هل تحافظ صيغة WebP على الخلفية الشفافة لصور PNG؟</strong></dt>
            <dd>نعم، تدعم صيغة WebP ميزة الشفافية الكاملة وتنتج ملفات أصغر بنسبة تصل إلى 70% مقارنة بملفات PNG-24.</dd>
            <dt><strong>ما هي الاستخدامات الأفضل لصور PNG المحولة لـ WebP؟</strong></dt>
            <dd>للشعارات، والأيقونات، والرسومات التوضيحية، ولقطات الشاشة الشفافة.</dd>
            <dt><strong>هل يتأثر وضوح الشعارات؟</strong></dt>
            <dd>لا، تحافظ خوارزميات WebP على حدة الحواف والنصوص داخل الشعار.</dd>
            <dt><strong>هل التحويل جماعي؟</strong></dt>
            <dd>نعم، يمكنك رفع عدة ملفات PNG وتحميلها كملف مضغوط ZIP.</dd>
            <dt><strong>هل الموقع آمن؟</strong></dt>
            <dd>نعم، 100% محلي دون أي رفع للملفات.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/ar/free-geo-tagger": {
    title: "إضافة إحداثيات GPS للصور أونلاين مجانًا — معدل EXIF | ImageSEO",
    description: "أضف إحداثيات جغرافية وبيانات الموقع لصورك لتعزيز السيو المحلي ونتائج Google Business Profile عبر خريطة تفاعلية آمنة في المتصفح.",
    schemaType: "WebApplication",
    lang: "ar",
    faqs: [
      { q: "كيف تساعد إضافة إحداثيات GPS للصور (Geotagging) في السيو المحلي؟", a: "تمنح بيانات GPS المدمجة في ترويسة EXIF محركات البحث دليلاً جغرافيًا موثوقًا على موقع التقاط الصور ومقر نشاطك التجاري لتعزيز الظهور المحلي." },
      { q: "هل يقرأ جوجل إحداثيات GPS في الصور لتحسين ترتيب الخرائط ونشاطي التجاري؟", a: "نعم، يستخرج جوجل بيانات EXIF في الملفات المرفوعة إلى Google Business Profile لدعم الثقة الجغرافية وتطابق الموقع." },
      { q: "كيف أضيف إحداثيات GPS لصور الملف التجاري في جوجل؟", a: "حدد عنوان متجرك على الخريطة التفاعلية، ارفع صور المتجر أو الأعمال المنجزة، ثم اضغط حفظ وحمّل ملفات JPEG المدمجة لرفعها مباشرة إلى صفحتك." },
      { q: "ما هي صيغ الصور التي تدعم بيانات EXIF GPS؟", a: "صيغة JPEG/JPG هي المعيار العالمي الأساسي لبيانات EXIF GPS، وتقوم أداتنا بتصدير صور JPEG متوافقة تمامًا." },
      { q: "هل صوري وموقعي الجغرافي في أمان وسرية تامة؟", a: "نعم بنسبة 100%، تتم كافة العمليات داخل متصفحك دون إرسال أي ملف أو إحداثيات إلى خوادمنا." }
    ],
    body: `
      <main>
        <h1>إضافة إحداثيات GPS وتعديل بيانات EXIF للصور مجانًا</h1>
        <p>تثبيت بيانات الموقع الجغرافي داخل الصور لدعم السيو المحلي والظهور في خرائط جوجل.</p>
        <section class="faqs">
          <h2>الأسئلة الشائعة حول تحديد موقع الصور</h2>
          <dl>
            <dt><strong>كيف تساعد إضافة إحداثيات GPS للصور (Geotagging) في السيو المحلي؟</strong></dt>
            <dd>تمنح بيانات GPS المدمجة في ترويسة EXIF محركات البحث دليلاً جغرافيًا موثوقًا على موقع التقاط الصور ومقر نشاطك التجاري لتعزيز الظهور المحلي.</dd>
            <dt><strong>هل يقرأ جوجل إحداثيات GPS في الصور لتحسين ترتيب الخرائط ونشاطي التجاري؟</strong></dt>
            <dd>نعم، يستخرج جوجل بيانات EXIF في الملفات المرفوعة إلى Google Business Profile لدعم الثقة الجغرافية وتطابق الموقع.</dd>
            <dt><strong>كيف أضيف إحداثيات GPS لصور الملف التجاري في جوجل؟</strong></dt>
            <dd>حدد عنوان متجرك على الخريطة التفاعلية، ارفع صور المتجر أو الأعمال المنجزة، ثم اضغط حفظ وحمّل ملفات JPEG المدمجة لرفعها مباشرة إلى صفحتك.</dd>
            <dt><strong>ما هي صيغ الصور التي تدعم بيانات EXIF GPS؟</strong></dt>
            <dd>صيغة JPEG/JPG هي المعيار العالمي الأساسي لبيانات EXIF GPS، وتقوم أداتنا بتصدير صور JPEG متوافقة تمامًا.</dd>
            <dt><strong>هل صوري وموقعي الجغرافي في أمان وسرية تامة؟</strong></dt>
            <dd>نعم بنسبة 100%، تتم كافة العمليات داخل متصفحك دون إرسال أي ملف أو إحداثيات إلى خوادمنا.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/ar/free-online-image-compressor": {
    title: "ضغط الصور أونلاين مجانًا — تقليل حجم الصور | ImageSEO",
    description: "اضغط صور JPG و PNG و WebP دفعة واحدة مع الاحتفاظ بأعلى جودة بصرية. معالجة سريعة وآمنة 100% داخل المتصفح دون حفظ أي بيانات.",
    schemaType: "WebApplication",
    lang: "ar",
    faqs: [
      { q: "كيف يقوم هذا البرنامج بضغط الصور دون الإضرار بجودتها؟", a: "يستخدم خوارزميات ضغط ذكية تتخلص من درجات البكسل والبيانات غير المرئية للعين البشرية، مما يقلل الحجم بالكيلوبايت بنسبة هائلة مع الحفاظ على صفاء الصورة." },
      { q: "ما هو الحجم المثالي لصور صفحات المواقع والمتاجر الإلكترونية؟", a: "ينصح بإبقاء صور البانر الرئيسية أقل من 150-200 كيلوبايت، وصور المقالات والمنتجات أقل من 100 كيلوبايت، والرموز والأيقونات أقل من 30 كيلوبايت." },
      { q: "هل يساعد ضغط الصور في رفع تقييم Google PageSpeed؟", a: "نعم، الصور الثقيلة هي المسبب الأكبر لبطء تحميل الصفحات. ضغط الصور يقلل استهلاك الباندويث ويسرع مؤشر Largest Contentful Paint (LCP)." },
      { q: "هل توجد أي حدود لعدد الصور أو حد أقصى للحجم؟", a: "لا توجد أي قيود، فالضغط يعتمد على معالج جهازك مباشرة، ومتاح مجانًا بدون اشتراكات أو علامات مائية." },
      { q: "هل يتم الاحتفاظ بصوري أو رفعها إلى أي مكان؟", a: "أبدًا، جميع عمليات المعالجة تجري محليًا داخل متصفحك ولا تمر عبر الإنترنت مطلقًا." }
    ],
    body: `
      <main>
        <h1>برنامج ضغط الصور أونلاين مجانًا وبلا حدود</h1>
        <p>تصغير حجم صور JPG و PNG مع الحفاظ على الجودة البصرية بدون رفع للملفات.</p>
        <section class="faqs">
          <h2>الأسئلة الشائعة حول ضغط الصور</h2>
          <dl>
            <dt><strong>كيف يقوم هذا البرنامج بضغط الصور دون الإضرار بجودتها؟</strong></dt>
            <dd>يستخدم خوارزميات ضغط ذكية تتخلص من درجات البكسل والبيانات غير المرئية للعين البشرية، مما يقلل الحجم بالكيلوبايت بنسبة هائلة مع الحفاظ على صفاء الصورة.</dd>
            <dt><strong>ما هو الحجم المثالي لصور صفحات المواقع والمتاجر الإلكترونية؟</strong></dt>
            <dd>ينصح بإبقاء صور البانر الرئيسية أقل من 150-200 كيلوبايت، وصور المقالات والمنتجات أقل من 100 كيلوبايت، والرموز والأيقونات أقل من 30 كيلوبايت.</dd>
            <dt><strong>هل يساعد ضغط الصور في رفع تقييم Google PageSpeed؟</strong></dt>
            <dd>نعم، الصور الثقيلة هي المسبب الأكبر لبطء تحميل الصفحات. ضغط الصور يقلل استهلاك الباندويث ويسرع مؤشر Largest Contentful Paint (LCP).</dd>
            <dt><strong>هل توجد أي حدود لعدد الصور أو حد أقصى للحجم؟</strong></dt>
            <dd>لا توجد أي قيود، فالضغط يعتمد على معالج جهازك مباشرة، ومتاح مجانًا بدون اشتراكات أو علامات مائية.</dd>
            <dt><strong>هل يتم الاحتفاظ بصوري أو رفعها إلى أي مكان؟</strong></dt>
            <dd>أبدًا، جميع عمليات المعالجة تجري محليًا داخل متصفحك ولا تمر عبر الإنترنت مطلقًا.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/ar/compress-jpg": {
    title: "ضغط صور JPG مجانًا — تصغير حجم صور JPEG | ImageSEO",
    description: "قلل حجم ملفات صور JPG بالكيلوبايت مع الحفاظ على وضوح التفاصيل وسرعة الفتح على الهواتف وأجهزة الكمبيوتر.",
    schemaType: "WebApplication",
    lang: "ar",
    faqs: [
      { q: "كيف أقلل حجم صور JPG بالكيلوبايت؟", a: "استخدم مؤشر الجودة لتقليل الكيلوبايت مع الحفاظ على أبعاد ودقة الصورة." },
      { q: "ما هي أفضل نسبة ضغط لصور JPG؟", a: "نسبة 75% إلى 80% توفر أفضل نتيجة دون أي تشويش مرئي." },
      { q: "هل الأداة مجانية؟", a: "نعم، مجانية 100%." },
      { q: "هل يمكن ضغط صور متعددة؟", a: "نعم، يمكنك ضغط عشرات الصور دفعة واحدة." },
      { q: "هل تضمن الأداة الخصوصية؟", a: "نعم، المعالجة محلية داخل جهازك بالكامل." }
    ],
    body: `
      <main>
        <h1>ضغط صور JPG أونلاين مجانًا</h1>
        <p>تقليل حجم صور JPG بالكيلوبايت لتسريع المواقع والمدونات.</p>
        <section class="faqs">
          <h2>الأسئلة الشائعة</h2>
          <dl>
            <dt><strong>كيف أقلل حجم صور JPG بالكيلوبايت؟</strong></dt>
            <dd>استخدم مؤشر الجودة لتقليل الكيلوبايت مع الحفاظ على أبعاد ودقة الصورة.</dd>
            <dt><strong>ما هي أفضل نسبة ضغط لصور JPG؟</strong></dt>
            <dd>نسبة 75% إلى 80% توفر أفضل نتيجة دون أي تشويش مرئي.</dd>
            <dt><strong>هل الأداة مجانية؟</strong></dt>
            <dd>نعم، مجانية 100%.</dd>
            <dt><strong>هل يمكن ضغط صور متعددة؟</strong></dt>
            <dd>نعم، يمكنك ضغط عشرات الصور دفعة واحدة.</dd>
            <dt><strong>هل تضمن الأداة الخصوصية؟</strong></dt>
            <dd>نعم، المعالجة محلية داخل جهازك بالكامل.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/ar/compress-image-to-kb": {
    title: "تقليل حجم الصورة بالكيلوبايت (20KB, 50KB, 100KB) | ImageSEO",
    description: "اضغط الصور إلى أحجام دقيقة بالكيلوبايت مثل 20KB أو 50KB أو 100KB مباشرة في متصفحك مجانًا وبخصوصية تامة دون رفع ملفات.",
    schemaType: "WebApplication",
    lang: "ar",
    faqs: [
      { q: "كيف يتم ضغط الصورة لحجم دقيق بالكيلوبايت؟", a: "تعتمد الأداة على خوارزمية ذكية تضبط نسبة الضغط بدقة حتى تصل إلى الحد الأقصى المطلوب مثل 20KB أو 50KB أو 100KB." },
      { q: "هل تصلح للتقديم في الوظائف الحكومية وجوازات السفر؟", a: "نعم، مثالية للبوابات الحكومية التي تشترط حدًا أقصى لحجم الصور والملفات." },
      { q: "ما هي الصيغ المدعومة؟", a: "JPG و PNG و WebP." },
      { q: "هل تظل الصورة واضحة عند ضغطها لـ 20KB؟", a: "تحافظ الخوارزمية على ملامح الوجه والتوقيع واضحة ومقروءة." },
      { q: "هل استخدام الأداة آمن؟", a: "100% آمن، لا يتم إرسال أي صورة عبر الإنترنت." }
    ],
    body: `
      <main>
        <h1>تقليل حجم الصور بالكيلوبايت أونلاين (20KB, 50KB, 100KB)</h1>
        <p>ضغط دقيق للصور لمواقع التقديم والمعاملات الحكومية دون تجاوز الحد المسموح.</p>
        <section class="faqs">
          <h2>الأسئلة الشائعة</h2>
          <dl>
            <dt><strong>كيف يتم ضغط الصورة لحجم دقيق بالكيلوبايت؟</strong></dt>
            <dd>تعتمد الأداة على خوارزمية ذكية تضبط نسبة الضغط بدقة حتى تصل إلى الحد الأقصى المطلوب مثل 20KB أو 50KB أو 100KB.</dd>
            <dt><strong>هل تصلح للتقديم في الوظائف الحكومية وجوازات السفر؟</strong></dt>
            <dd>نعم، مثالية للبوابات الحكومية التي تشترط حدًا أقصى لحجم الصور والملفات.</dd>
            <dt><strong>ما هي الصيغ المدعومة؟</strong></dt>
            <dd>JPG و PNG و WebP.</dd>
            <dt><strong>هل تظل الصورة واضحة عند ضغطها لـ 20KB؟</strong></dt>
            <dd>تحافظ الخوارزمية على ملامح الوجه والتوقيع واضحة ومقروءة.</dd>
            <dt><strong>هل استخدام الأداة آمن؟</strong></dt>
            <dd>100% آمن، لا يتم إرسال أي صورة عبر الإنترنت.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/ar/image-seo": {
    title: "دليل سيو الصور الكامل (2025) — تحسين ترتيب الصور | ImageSEO",
    description: "تعلم كيفية تصدر نتائج بحث الصور في جوجل: صيغة WebP، ضغط الصور، النص البديل Alt Text، أسماء الملفات، وإضافة بيانات الموقع الجغرافي EXIF.",
    schemaType: "Article",
    lang: "ar",
    faqs: [
      { q: "ما هو سيو الصور ولماذا هو مهم لموقعك؟", a: "هو ممارسة تحسين النص البديل وأسماء الملفات وصيغ الصور وتقليل أحجامها لتصدر نتائج بحث جوجل وزيادة سرعة الموقع." },
      { q: "كيف أكتب نصًا بديلاً (Alt Text) متوافقًا مع السيو؟", a: "صف محتوى الصورة بدقة في 10 إلى 15 كلمة مع تضمين الكلمة المفتاحية بشكل طبيعي دون حشو." },
      { q: "كيف أسمي ملفات الصور بطريقة صحيحة؟", a: "استخدم كلمات وصفية باللغة الإنجليزية أو العربية مفصولة بشرطات (مثل: best-coffee-riyadh.webp)." },
      { q: "كيف تؤثر أبعاد الصورة على تجربة المستخدم (CLS)؟", a: "حدد دائمًا أبعاد العرض والارتفاع في كود HTML لتجنب اهتزاز الصفحة أثناء التحميل." },
      { q: "هل يفهرس جوجل صور WebP بنفس كفاءة JPG؟", a: "نعم، ويفضلها جوجل لأنها تسرع تجربة التصفح على الهواتف." }
    ],
    body: `
      <main>
        <article>
          <h1>الدليل الشامل لتحسين سيو الصور وسرعة المواقع</h1>
          <p>دليل تحسين النص البديل وأسماء الملفات واستخدام WebP لتحسين ترتيب محركات البحث.</p>
          <section class="faqs">
            <h2>الأسئلة الشائعة</h2>
            <dl>
              <dt><strong>ما هو سيو الصور ولماذا هو مهم لموقعك؟</strong></dt>
              <dd>هو ممارسة تحسين النص البديل وأسماء الملفات وصيغ الصور وتقليل أحجامها لتصدر نتائج بحث جوجل وزيادة سرعة الموقع.</dd>
              <dt><strong>كيف أكتب نصًا بديلاً (Alt Text) متوافقًا مع السيو؟</strong></dt>
              <dd>صف محتوى الصورة بدقة في 10 إلى 15 كلمة مع تضمين الكلمة المفتاحية بشكل طبيعي دون حشو.</dd>
              <dt><strong>كيف أسمي ملفات الصور بطريقة صحيحة؟</strong></dt>
              <dd>استخدم كلمات وصفية باللغة الإنجليزية أو العربية مفصولة بشرطات (مثل: best-coffee-riyadh.webp).</dd>
              <dt><strong>كيف تؤثر أبعاد الصورة على تجربة المستخدم (CLS)؟</strong></dt>
              <dd>حدد دائمًا أبعاد العرض والارتفاع في كود HTML لتجنب اهتزاز الصفحة أثناء التحميل.</dd>
              <dt><strong>هل يفهرس جوجل صور WebP بنفس كفاءة JPG؟</strong></dt>
              <dd>نعم، ويفضلها جوجل لأنها تسرع تجربة التصفح على الهواتف.</dd>
            </dl>
          </section>
        </article>
      </main>
    `
  },

  // ─── Indonesian (id) Pages (9 routes) ───
  "/id": {
    title: "Tools SEO Gambar Gratis & Kompres Foto Cepat | ImageSEO",
    description: "Optimasi, kompres foto, ubah format ke WebP, dan tambahkan geotag GPS langsung di browser Anda. Cepat, tanpa batas ukuran, dan 100% aman tanpa simpan ke server.",
    schemaType: "WebApplication",
    lang: "id",
    faqs: [
      { q: "Apa itu ImageSEO dan bagaimana fungsinya untuk ranking Google?", a: "ImageSEO adalah platform alat optimasi gambar berbasis browser yang membantu Anda mengubah foto ke WebP, mengompres ukuran KB, dan menyematkan geotag GPS untuk SEO lokal dan Core Web Vitals." },
      { q: "Apakah foto saya aman dan tidak diunggah ke server?", a: "Ya, 100% privat. Semua pemrosesan berjalan di memori lokal browser perangkat Anda menggunakan HTML5 Canvas." },
      { q: "Mengapa format WebP sangat penting untuk kecepatan website?", a: "Format WebP menghemat ukuran file gambar hingga 80% dibandingkan JPG dan PNG, mempercepat skor Largest Contentful Paint (LCP) di Google PageSpeed." },
      { q: "Bagaimana geotagging foto membantu Google Profil Bisnis?", a: "Penyematan koordinat GPS pada metadata EXIF membuktikan lokasi fisik operasional usaha Anda kepada algoritma Google Maps." },
      { q: "Apakah ImageSEO gratis digunakan?", a: "Ya, 100% gratis tanpa watermark dan tanpa batas jumlah file." }
    ],
    body: `
      <main>
        <h1>Tools SEO Gambar Gratis & 100% Privasi di Browser</h1>
        <p>Optimasi gambar website langsung di browser Anda. Ubah ke WebP, kompres foto, dan pasang geotag EXIF GPS.</p>
        <section>
          <h2>Daftar Tools Optimasi Gambar</h2>
          <ul>
            <li><a href="/id/free-webp-converter">Konverter WebP Gratis</a> — Ubah gambar ke format WebP ringan instan.</li>
            <li><a href="/id/free-online-image-compressor">Kompres Foto Online</a> — Perkecil ukuran KB gambar tanpa buram.</li>
            <li><a href="/id/free-geo-tagger">Geotag Foto GPS</a> — Pasang koordinat GPS EXIF foto untuk SEO lokal.</li>
            <li><a href="/id/jpg-to-webp">Ubah JPG ke WebP</a> — Optimasi foto JPG jadi super cepat.</li>
            <li><a href="/id/png-to-webp">Ubah PNG ke WebP</a> — Pertahankan transparansi dengan ukuran 70% lebih kecil.</li>
            <li><a href="/id/compress-jpg">Kompres JPG</a> — Kecilkan ukuran KB file JPG.</li>
            <li><a href="/id/compress-image-to-kb">Kompres Foto ke KB Target</a> — Perkecil ke 20KB, 50KB, 100KB, 200KB.</li>
            <li><a href="/id/image-seo">Panduan Lengkap SEO Gambar</a> — Panduan alt text, penamaan file, dan LCP.</li>
          </ul>
        </section>
        <section class="faqs">
          <h2>Pertanyaan yang Sering Diajukan</h2>
          <dl>
            <dt><strong>Apa itu ImageSEO dan bagaimana fungsinya untuk ranking Google?</strong></dt>
            <dd>ImageSEO adalah platform alat optimasi gambar berbasis browser yang membantu Anda mengubah foto ke WebP, mengompres ukuran KB, dan menyematkan geotag GPS untuk SEO lokal dan Core Web Vitals.</dd>
            <dt><strong>Apakah foto saya aman dan tidak diunggah ke server?</strong></dt>
            <dd>Ya, 100% privat. Semua pemrosesan berjalan di memori lokal browser perangkat Anda menggunakan HTML5 Canvas.</dd>
            <dt><strong>Mengapa format WebP sangat penting untuk kecepatan website?</strong></dt>
            <dd>Format WebP menghemat ukuran file gambar hingga 80% dibandingkan JPG dan PNG, mempercepat skor Largest Contentful Paint (LCP) di Google PageSpeed.</dd>
            <dt><strong>Bagaimana geotagging foto membantu Google Profil Bisnis?</strong></dt>
            <dd>Penyematan koordinat GPS pada metadata EXIF membuktikan lokasi fisik operasional usaha Anda kepada algoritma Google Maps.</dd>
            <dt><strong>Apakah ImageSEO gratis digunakan?</strong></dt>
            <dd>Ya, 100% gratis tanpa watermark dan tanpa batas jumlah file.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/id/free-webp-converter": {
    title: "Konverter WebP Gratis Online — Ubah Gambar ke WebP | ImageSEO",
    description: "Ubah gambar menjadi format WebP modern secara instan. Perkacil ukuran file gambar dan percepat loading website toko online atau blog Anda.",
    schemaType: "WebApplication",
    lang: "id",
    faqs: [
      { q: "Mengapa format WebP sangat direkomendasikan untuk SEO?", a: "WebP berukuran hingga 35% lebih kecil dibandingkan JPG dengan kualitas visual yang sama tajamnya, mempercepat waktu loading dan skor Core Web Vitals Google." },
      { q: "Apakah kualitas gambar berkurang saat dikonversi ke WebP?", a: "Tidak secara kasat mata. Format WebP menggunakan algoritma canggih yang mempertahankan ketajaman detail dan warna gambar." },
      { q: "Apakah semua browser dan perangkat mendukung format WebP?", a: "Ya. Google Chrome, Safari, Firefox, Edge, serta browser HP Android dan iPhone mendukung penuh WebP (mencakup lebih dari 97% pengguna internet)." },
      { q: "Apakah foto saya diunggah ke server saat proses konversi?", a: "Tidak. Seluruh proses konversi berjalan 100% di memori browser perangkat Anda menggunakan HTML5 Canvas. Privasi Anda terjamin aman." },
      { q: "Bisakah saya mengonversi banyak gambar ke WebP sekaligus?", a: "Ya, Anda bisa drag-and-drop puluhan gambar secara massal dan mengunduh semuanya dalam satu file ZIP." }
    ],
    body: `
      <main>
        <h1>Konverter WebP Gratis & Cepat di Browser</h1>
        <p>Ubah foto JPG dan PNG ke WebP instan tanpa upload ke server untuk website lebih cepat.</p>
        <section class="faqs">
          <h2>Pertanyaan Umum seputar Konversi WebP</h2>
          <dl>
            <dt><strong>Mengapa format WebP sangat direkomendasikan untuk SEO?</strong></dt>
            <dd>WebP berukuran hingga 35% lebih kecil dibandingkan JPG dengan kualitas visual yang sama tajamnya, mempercepat waktu loading dan skor Core Web Vitals Google.</dd>
            <dt><strong>Apakah kualitas gambar berkurang saat dikonversi ke WebP?</strong></dt>
            <dd>Tidak secara kasat mata. Format WebP menggunakan algoritma canggih yang mempertahankan ketajaman detail dan warna gambar.</dd>
            <dt><strong>Apakah semua browser dan perangkat mendukung format WebP?</strong></dt>
            <dd>Ya. Google Chrome, Safari, Firefox, Edge, serta browser HP Android dan iPhone mendukung penuh WebP (mencakup lebih dari 97% pengguna internet).</dd>
            <dt><strong>Apakah foto saya diunggah ke server saat proses konversi?</strong></dt>
            <dd>Tidak. Seluruh proses konversi berjalan 100% di memori browser perangkat Anda menggunakan HTML5 Canvas. Privasi Anda terjamin aman.</dd>
            <dt><strong>Bisakah saya mengonversi banyak gambar ke WebP sekaligus?</strong></dt>
            <dd>Ya, Anda bisa drag-and-drop puluhan gambar secara massal dan mengunduh semuanya dalam satu file ZIP.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/id/jpg-to-webp": {
    title: "Ubah JPG ke WebP Online Gratis — Cepat & Privasi Aman | ImageSEO",
    description: "Konversi foto JPG ke WebP super ringan dalam hitungan detik. Tingkatkan performa Core Web Vitals tanpa upload file ke server eksternal.",
    schemaType: "WebApplication",
    lang: "id",
    faqs: [
      { q: "Berapa persen penghematan ukuran file saat mengubah JPG ke WebP?", a: "Rata-rata ukuran file berkurang 35% hingga 50% tanpa penurunan ketajaman visual." },
      { q: "Apakah WebP dapat dibuka di iPhone dan Android?", a: "Ya, semua perangkat iOS dan Android modern mendukung format WebP." },
      { q: "Bagaimana cara kerja konverter ini?", a: "Menggunakan pemrosesan Canvas lokal di browser Anda." },
      { q: "Bisakah mengonversi foto resolusi tinggi?", a: "Ya, tanpa batas resolusi foto." },
      { q: "Apakah alat ini gratis?", a: "Ya, 100% gratis." }
    ],
    body: `
      <main>
        <h1>Ubah JPG ke WebP Gratis Online</h1>
        <p>Konversi foto JPG ke format WebP ringan untuk performa website yang lebih cepat.</p>
        <section class="faqs">
          <h2>Pertanyaan Umum</h2>
          <dl>
            <dt><strong>Berapa persen penghematan ukuran file saat mengubah JPG ke WebP?</strong></dt>
            <dd>Rata-rata ukuran file berkurang 35% hingga 50% tanpa penurunan ketajaman visual.</dd>
            <dt><strong>Apakah WebP dapat dibuka di iPhone dan Android?</strong></dt>
            <dd>Ya, semua perangkat iOS dan Android modern mendukung format WebP.</dd>
            <dt><strong>Bagaimana cara kerja konverter ini?</strong></dt>
            <dd>Menggunakan pemrosesan Canvas lokal di browser Anda.</dd>
            <dt><strong>Bisakah mengonversi foto resolusi tinggi?</strong></dt>
            <dd>Ya, tanpa batas resolusi foto.</dd>
            <dt><strong>Apakah alat ini gratis?</strong></dt>
            <dd>Ya, 100% gratis.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/id/png-to-webp": {
    title: "Ubah PNG ke WebP Online Gratis — Pertahankan Transparansi | ImageSEO",
    description: "Ubah gambar PNG ke WebP dengan latar belakang transparan tetap terjaga sempurna dan ukuran file jauh lebih kecil.",
    schemaType: "WebApplication",
    lang: "id",
    faqs: [
      { q: "Apakah format WebP mendukung transparansi seperti PNG?", a: "Ya, WebP mendukung transparansi alfa penuh dengan ukuran file hingga 70% lebih kecil daripada PNG-24." },
      { q: "Kapan sebaiknya mengonversi PNG ke WebP?", a: "Untuk logo website, ikon UI, dan ilustrasi dengan latar belakang transparan." },
      { q: "Apakah pinggiran logo akan pecah?", a: "Tidak, kualitas sudut dan transparansi tetap terjaga mulus." },
      { q: "Bisakah mengonversi PNG secara massal?", a: "Ya, tarik banyak file sekaligus dan unduh dalam ZIP." },
      { q: "Apakah aman?", a: "Sangat aman, diproses 100% di perangkat Anda." }
    ],
    body: `
      <main>
        <h1>Ubah PNG ke WebP Transparan</h1>
        <p>Ubah PNG ke WebP dengan latar belakang transparan tetap utuh dan ukuran jauh lebih ringan.</p>
        <section class="faqs">
          <h2>Pertanyaan Umum</h2>
          <dl>
            <dt><strong>Apakah format WebP mendukung transparansi seperti PNG?</strong></dt>
            <dd>Ya, WebP mendukung transparansi alfa penuh dengan ukuran file hingga 70% lebih kecil daripada PNG-24.</dd>
            <dt><strong>Kapan sebaiknya mengonversi PNG ke WebP?</strong></dt>
            <dd>Untuk logo website, ikon UI, dan ilustrasi dengan latar belakang transparan.</dd>
            <dt><strong>Apakah pinggiran logo akan pecah?</strong></dt>
            <dd>Tidak, kualitas sudut dan transparansi tetap terjaga mulus.</dd>
            <dt><strong>Bisakah mengonversi PNG secara massal?</strong></dt>
            <dd>Ya, tarik banyak file sekaligus dan unduh dalam ZIP.</dd>
            <dt><strong>Apakah aman?</strong></dt>
            <dd>Sangat aman, diproses 100% di perangkat Anda.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/id/free-geo-tagger": {
    title: "Tambah Lokasi Foto Online Gratis — Edit EXIF GPS | ImageSEO",
    description: "Tambahkan koordinat GPS dan lokasi akurat pada foto untuk memperkuat SEO lokal dan profil Google Bisnisku. Menggunakan peta interaktif yang aman di browser.",
    schemaType: "WebApplication",
    lang: "id",
    faqs: [
      { q: "Apa manfaat geotagging foto untuk SEO lokal?", a: "Data koordinat GPS pada header EXIF memberikan bukti fisik yang valid kepada Google bahwa layanan atau foto Anda benar-benar berada di lokasi target." },
      { q: "Apakah Google membaca koordinat GPS EXIF untuk peringkat Google Maps & Profil Bisnis?", a: "Ya. Google mengekstrak metadata EXIF untuk mencocokkan relevansi geografis foto dengan alamat bisnis Anda." },
      { q: "Bagaimana cara menyematkan lokasi GPS pada foto Google Bisnisku (GBP)?", a: "Cari lokasi usaha Anda pada peta interaktif, unggah foto, pasang tag GPS, dan unduh foto JPEG yang siap diunggah ke profil bisnis Anda." },
      { q: "Format foto apa yang mendukung metadata GPS EXIF?", a: "Format standar yang mendukung EXIF GPS secara universal adalah JPEG/JPG. Alat kami otomatis menghasilkan output JPEG yang kompatibel." },
      { q: "Apakah foto dan data lokasi saya disimpan di server?", a: "Tidak. Semua proses penulisan metadata dilakukan 100% secara lokal di browser Anda." }
    ],
    body: `
      <main>
        <h1>Geotag Foto & Edit Metadata EXIF GPS Gratis</h1>
        <p>Sematkan koordinat latitude dan longitude pada foto untuk SEO lokal dan Google Maps.</p>
        <section class="faqs">
          <h2>Pertanyaan Umum Geotagging</h2>
          <dl>
            <dt><strong>Apa manfaat geotagging foto untuk SEO lokal?</strong></dt>
            <dd>Data koordinat GPS pada header EXIF memberikan bukti fisik yang valid kepada Google bahwa layanan atau foto Anda benar-benar berada di lokasi target.</dd>
            <dt><strong>Apakah Google membaca koordinat GPS EXIF untuk peringkat Google Maps & Profil Bisnis?</strong></dt>
            <dd>Ya. Google mengekstrak metadata EXIF untuk mencocokkan relevansi geografis foto dengan alamat bisnis Anda.</dd>
            <dt><strong>Bagaimana cara menyematkan lokasi GPS pada foto Google Bisnisku (GBP)?</strong></dt>
            <dd>Cari lokasi usaha Anda pada peta interaktif, unggah foto, pasang tag GPS, dan unduh foto JPEG yang siap diunggah ke profil bisnis Anda.</dd>
            <dt><strong>Format foto apa yang mendukung metadata GPS EXIF?</strong></dt>
            <dd>Format standar yang mendukung EXIF GPS secara universal adalah JPEG/JPG. Alat kami otomatis menghasilkan output JPEG yang kompatibel.</dd>
            <dt><strong>Apakah foto dan data lokasi saya disimpan di server?</strong></dt>
            <dd>Tidak. Semua proses penulisan metadata dilakukan 100% secara lokal di browser Anda.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/id/free-online-image-compressor": {
    title: "Kompres Foto Online Gratis — Perkecil Ukuran Foto Cepat | ImageSEO",
    description: "Kompres banyak foto JPG, PNG, dan WebP sekaligus tanpa mengurangi ketajaman visual. 100% diproses di browser tanpa antrean dan tanpa batas upload.",
    schemaType: "WebApplication",
    lang: "id",
    faqs: [
      { q: "Bagaimana cara kerja kompresor ini mengecilkan file tanpa pecah?", a: "Menggunakan algoritma kompresi Canvas cerdas yang membuang data warna tak terlihat mata, sehingga ukuran KB berkurang drastis namun gambar tetap jernih." },
      { q: "Berapa ukuran file foto yang ideal untuk website?", a: "Foto banner disarankan di bawah 150KB–200KB; foto produk dan artikel di bawah 100KB; dan ikon atau thumbnail di bawah 30KB." },
      { q: "Apakah kompresi gambar meningkatkan skor Google PageSpeed?", a: "Ya. Gambar yang terlalu berat adalah faktor utama loading lambat. Kompresi dapat menghemat hingga 80% total ukuran halaman web." },
      { q: "Apakah ada batasan jumlah foto atau ukuran file?", a: "Tidak ada batasan sama sekali karena proses menggunakan tenaga perangkat Anda sendiri, tanpa biaya langganan." },
      { q: "Apakah aman mengompres foto sensitif dan penting?", a: "Sangat aman. Foto Anda tidak pernah dikirim ke internet atau disimpan di server mana pun." }
    ],
    body: `
      <main>
        <h1>Kompres Foto Online Gratis & Tanpa Batas</h1>
        <p>Perkecil ukuran KB foto secara instan di browser tanpa mengurangi ketajaman gambar.</p>
        <section class="faqs">
          <h2>Pertanyaan Umum Kompresi Gambar</h2>
          <dl>
            <dt><strong>Bagaimana cara kerja kompresor ini mengecilkan file tanpa pecah?</strong></dt>
            <dd>Menggunakan algoritma kompresi Canvas cerdas yang membuang data warna tak terlihat mata, sehingga ukuran KB berkurang drastis namun gambar tetap jernih.</dd>
            <dt><strong>Berapa ukuran file foto yang ideal untuk website?</strong></dt>
            <dd>Foto banner disarankan di bawah 150KB–200KB; foto produk dan artikel di bawah 100KB; dan ikon atau thumbnail di bawah 30KB.</dd>
            <dt><strong>Apakah kompresi gambar meningkatkan skor Google PageSpeed?</strong></dt>
            <dd>Ya. Gambar yang terlalu berat adalah faktor utama loading lambat. Kompresi dapat menghemat hingga 80% total ukuran halaman web.</dd>
            <dt><strong>Apakah ada batasan jumlah foto atau ukuran file?</strong></dt>
            <dd>Tidak ada batasan sama sekali karena proses menggunakan tenaga perangkat Anda sendiri, tanpa biaya langganan.</dd>
            <dt><strong>Apakah aman mengompres foto sensitif dan penting?</strong></dt>
            <dd>Sangat aman. Foto Anda tidak pernah dikirim ke internet atau disimpan di server mana pun.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/id/compress-jpg": {
    title: "Kompres JPG Online Gratis — Perkecil Ukuran File JPG | ImageSEO",
    description: "Kecilkan ukuran KB foto JPG dengan kualitas visual tetap tajam. Sangat cepat, gratis, dan menjaga privasi penuh foto Anda.",
    schemaType: "WebApplication",
    lang: "id",
    faqs: [
      { q: "Bagaimana cara mengecilkan ukuran KB foto JPG?", a: "Gunakan slider kompresi untuk menentukan ukuran KB yang pas tanpa merusak warna." },
      { q: "Berapa rasio kompresi terbaik?", a: "Kualitas 75% sampai 80% memangkas ukuran hingga 70% tanpa terlihat pecah." },
      { q: "Apakah gratis?", a: "Ya, 100% gratis." },
      { q: "Bisakah kompres foto banyak sekaligus?", a: "Ya, drag-and-drop banyak foto dan unduh sekaligus dalam file ZIP." },
      { q: "Apakah data foto aman?", a: "Aman, diproses secara lokal." }
    ],
    body: `
      <main>
        <h1>Kompres JPG Online Gratis</h1>
        <p>Kecilkan ukuran file foto JPG tanpa pecah untuk mempercepat website Anda.</p>
        <section class="faqs">
          <h2>Pertanyaan Umum</h2>
          <dl>
            <dt><strong>Bagaimana cara mengecilkan ukuran KB foto JPG?</strong></dt>
            <dd>Gunakan slider kompresi untuk menentukan ukuran KB yang pas tanpa merusak warna.</dd>
            <dt><strong>Berapa rasio kompresi terbaik?</strong></dt>
            <dd>Kualitas 75% sampai 80% memangkas ukuran hingga 70% tanpa terlihat pecah.</dd>
            <dt><strong>Apakah gratis?</strong></dt>
            <dd>Ya, 100% gratis.</dd>
            <dt><strong>Bisakah kompres foto banyak sekaligus?</strong></dt>
            <dd>Ya, drag-and-drop banyak foto dan unduh sekaligus dalam file ZIP.</dd>
            <dt><strong>Apakah data foto aman?</strong></dt>
            <dd>Aman, diproses secara lokal.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/id/compress-image-to-kb": {
    title: "Kompres Foto 100KB, 200KB Online Gratis | ImageSEO",
    description: "Kompres foto ke ukuran target 20KB, 50KB, 100KB, 200KB langsung di browser untuk daftar CPNS, marketplace, dan formulir.",
    schemaType: "WebApplication",
    lang: "id",
    faqs: [
      { q: "Bagaimana cara kompres foto ke ukuran target KB pas?", a: "Alat ini menggunakan pencarian biner otomatis untuk mengecilkan foto tepat di bawah batas ukuran yang dipilih (contoh: 20KB, 50KB, 100KB, atau 200KB)." },
      { q: "Apakah cocok untuk pendaftaran CPNS, BUMN, dan ujian online?", a: "Sangat cocok untuk formulir pendaftaran online yang mewajibkan batas maksimal KB tertentu." },
      { q: "Format foto apa yang didukung?", a: "JPG, PNG, dan WebP." },
      { q: "Apakah wajah tetap jelas jika dikompres ke 20KB?", a: "Ya, algoritma menjaga ketajaman wajah dan tulisan dokumen." },
      { q: "Apakah aman untuk foto KTP atau ijazah?", a: "Sangat aman karena diproses di browser Anda sendiri tanpa pernah diunggah ke internet." }
    ],
    body: `
      <main>
        <h1>Kompres Foto ke KB Target Online (20KB, 50KB, 100KB, 200KB)</h1>
        <p>Kecilkan foto ke 100KB atau 200KB untuk pendaftaran online CPNS dan dokumen resmi.</p>
        <section class="faqs">
          <h2>Pertanyaan Umum</h2>
          <dl>
            <dt><strong>Bagaimana cara kompres foto ke ukuran target KB pas?</strong></dt>
            <dd>Alat ini menggunakan pencarian biner otomatis untuk mengecilkan foto tepat di bawah batas ukuran yang dipilih (contoh: 20KB, 50KB, 100KB, atau 200KB).</dd>
            <dt><strong>Apakah cocok untuk pendaftaran CPNS, BUMN, dan ujian online?</strong></dt>
            <dd>Sangat cocok untuk formulir pendaftaran online yang mewajibkan batas maksimal KB tertentu.</dd>
            <dt><strong>Format foto apa yang didukung?</strong></dt>
            <dd>JPG, PNG, dan WebP.</dd>
            <dt><strong>Apakah wajah tetap jelas jika dikompres ke 20KB?</strong></dt>
            <dd>Ya, algoritma menjaga ketajaman wajah dan tulisan dokumen.</dd>
            <dt><strong>Apakah aman untuk foto KTP atau ijazah?</strong></dt>
            <dd>Sangat aman karena diproses di browser Anda sendiri tanpa pernah diunggah ke internet.</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/id/image-seo": {
    title: "Panduan Lengkap SEO Gambar (2025) | ImageSEO",
    description: "Pelajari cara optimasi gambar untuk Google: format WebP, kompresi tanpa pecah, teks alt, penamaan file ramah SEO, dan metadata lokasi geotag EXIF.",
    schemaType: "Article",
    lang: "id",
    faqs: [
      { q: "Apa itu SEO gambar dan mengapa penting?", a: "SEO gambar adalah teknik mengoptimasi teks alt, nama file, dimensi, dan format ringan untuk menduduki peringkat teratas Google Gambar dan mempercepat website." },
      { q: "Bagaimana cara menulis teks alt (Alt Text) yang benar?", a: "Jelaskan isi foto dengan jelas dalam 10-15 kata sertakan kata kunci utama secara alami." },
      { q: "Bagaimana cara menamai file foto untuk SEO?", a: "Gunakan huruf kecil dipisah tanda strip (contoh: 'jasa-servis-ac-jakarta-selatan.webp')." },
      { q: "Mengapa dimensi gambar mempengaruhi Core Web Vitals (CLS)?", a: "Selalu sertakan atribut width dan height pada tag gambar HTML untuk mencegah pergeseran layout." },
      { q: "Apakah Google merayapi gambar WebP dengan baik?", a: "Ya, Google memprioritaskan format WebP untuk performa kecepatan." }
    ],
    body: `
      <main>
        <article>
          <h1>Panduan Lengkap SEO Gambar & Optimasi Performa Web</h1>
          <p>Panduan lengkap alt text, WebP, penamaan file, dan geotag GPS di Indonesia untuk ranking nomor 1 di Google.</p>
          <section class="faqs">
            <h2>Pertanyaan Umum</h2>
            <dl>
              <dt><strong>Apa itu SEO gambar dan mengapa penting?</strong></dt>
              <dd>SEO gambar adalah teknik mengoptimasi teks alt, nama file, dimensi, dan format ringan untuk menduduki peringkat teratas Google Gambar dan mempercepat website.</dd>
              <dt><strong>Bagaimana cara menulis teks alt (Alt Text) yang benar?</strong></dt>
              <dd>Jelaskan isi foto dengan jelas dalam 10-15 kata sertakan kata kunci utama secara alami.</dd>
              <dt><strong>Bagaimana cara menamai file foto untuk SEO?</strong></dt>
              <dd>Gunakan huruf kecil dipisah tanda strip (contoh: 'jasa-servis-ac-jakarta-selatan.webp').</dd>
              <dt><strong>Mengapa dimensi gambar mempengaruhi Core Web Vitals (CLS)?</strong></dt>
              <dd>Selalu sertakan atribut width dan height pada tag gambar HTML untuk mencegah pergeseran layout.</dd>
              <dt><strong>Apakah Google merayapi gambar WebP dengan baik?</strong></dt>
              <dd>Ya, Google memprioritaskan format WebP untuk performa kecepatan.</dd>
            </dl>
          </section>
        </article>
      </main>
    `
  },

  // ─── Hindi (hi) Pages (9 routes) ───
  "/hi": {
    title: "मुफ़्त इमेज एसईओ टूल्स और फोटो कम्प्रेसर | ImageSEO",
    description: "ब्राउज़र में सीधे फ़ोटो कम्प्रेस करें, WebP में बदलें और GPS लोकेशन जोड़ें। 100% मुफ़्त, बिना सर्वर अपलोड और बिना किसी साइज़ लिमिट के उपयोग करें।",
    schemaType: "WebApplication",
    lang: "hi",
    faqs: [
      { q: "ImageSEO क्या है और यह वेबसाइट रैंकिंग में कैसे मदद करता है?", a: "ImageSEO एक मुफ़्त ब्राउज़र टूलकिट है जो तस्वीरों को WebP में बदलता है, फ़ोटो का साइज़ KB में कम करता है और Google Maps व लोकल एसईओ के लिए GPS लोकेशन जोड़ता है।" },
      { q: "क्या मेरी तस्वीरें सुरक्षित हैं?", a: "हाँ, 100% सुरक्षित। सारा काम आपके कंप्यूटर या फ़ोन के ब्राउज़र में होता है, कोई भी फ़ोटो किसी सर्वर पर नहीं भेजी जाती।" },
      { q: "वेबसाइट के लिए WebP फॉर्मेट क्यों बेहतर है?", a: "WebP फॉर्मेट सामान्य तस्वीरों की तुलना में 80% तक हल्का होता है जिससे वेबसाइट मोबाइल पर तुरंत खुलती है।" },
      { q: "फ़ोटो में GPS लोकेशन जोड़ने से क्या फायदा होता है?", a: "फ़ोटो में GPS लोकेशन जोड़ने से गूगल सर्च और गूगल मैप्स में आपकी दुकान या बिज़नेस की लोकल रैंकिंग बेहतर होती है।" },
      { q: "क्या ImageSEO का इस्तेमाल पूरी तरह मुफ़्त है?", a: "हाँ, यह 100% मुफ़्त है बिना किसी वॉटरमार्क या दैनिक सीमा के।" }
    ],
    body: `
      <main>
        <h1>मुफ़्त इमेज एसईओ टूल्स — 100% सुरक्षित और तेज़ ब्राउज़र टूल्स</h1>
        <p>बिना सर्वर अपलोड के अपनी तस्वीरों को WebP में बदलें, फ़ोटो कम्प्रेस करें और GPS लोकेशन जोड़ें।</p>
        <section>
          <h2>प्रमुख इमेज एसईओ टूल्स</h2>
          <ul>
            <li><a href="/hi/free-webp-converter">WebP कनवर्टर मुफ़्त</a> — JPG और PNG फ़ोटो को WebP में बदलें।</li>
            <li><a href="/hi/free-online-image-compressor">फोटो कम्प्रेसर ऑनलाइन</a> — फ़ोटो का साइज़ KB में कम करें।</li>
            <li><a href="/hi/free-geo-tagger">GPS जियोटैगर टूल</a> — फ़ोटो में सटीक लोकेशन और EXIF डेटा जोड़ें।</li>
            <li><a href="/hi/jpg-to-webp">JPG से WebP कनवर्टर</a> — JPG फ़ोटो को हल्का बनाएं।</li>
            <li><a href="/hi/png-to-webp">PNG से WebP कनवर्टर</a> — पारदर्शी बैकग्राउंड के साथ साइज़ घटाएं।</li>
            <li><a href="/hi/compress-jpg">JPG कम्प्रेसर</a> — बिना धुंधला किए JPG का साइज़ कम करें।</li>
            <li><a href="/hi/compress-image-to-kb">फोटो का साइज 20KB, 50KB, 100KB करें</a> — सरकारी फॉर्म और परीक्षाओं के लिए फ़ोटो सेट करें।</li>
            <li><a href="/hi/image-seo">इमेज एसईओ गाइड</a> — गूगल में फ़ोटो रैंक करने की पूरी गाइड।</li>
          </ul>
        </section>
        <section class="faqs">
          <h2>अक्सर पूछे जाने वाले सवाल</h2>
          <dl>
            <dt><strong>ImageSEO क्या है और यह वेबसाइट रैंकिंग में कैसे मदद करता है?</strong></dt>
            <dd>ImageSEO एक मुफ़्त ब्राउज़र टूलकिट है जो तस्वीरों को WebP में बदलता है, फ़ोटो का साइज़ KB में कम करता है और Google Maps व लोकल एसईओ के लिए GPS लोकेशन जोड़ता है।</dd>
            <dt><strong>क्या मेरी तस्वीरें सुरक्षित हैं?</strong></dt>
            <dd>हाँ, 100% सुरक्षित। सारा काम आपके कंप्यूटर या फ़ोन के ब्राउज़र में होता है, कोई भी फ़ोटो किसी सर्वर पर नहीं भेजी जाती।</dd>
            <dt><strong>वेबसाइट के लिए WebP फॉर्मेट क्यों बेहतर है?</strong></dt>
            <dd>WebP फॉर्मेट सामान्य तस्वीरों की तुलना में 80% तक हल्का होता है जिससे वेबसाइट मोबाइल पर तुरंत खुलती है।</dd>
            <dt><strong>फ़ोटो में GPS लोकेशन जोड़ने से क्या फायदा होता है?</strong></dt>
            <dd>फ़ोटो में GPS लोकेशन जोड़ने से गूगल सर्च और गूगल मैप्स में आपकी दुकान या बिज़नेस की लोकल रैंकिंग बेहतर होती है।</dd>
            <dt><strong>क्या ImageSEO का इस्तेमाल पूरी तरह मुफ़्त है?</strong></dt>
            <dd>हाँ, यह 100% मुफ़्त है बिना किसी वॉटरमार्क या दैनिक सीमा के।</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/hi/free-webp-converter": {
    title: "WebP कनवर्टर मुफ़्त ऑनलाइन — इमेज को WebP में बदलें | ImageSEO",
    description: "अपनी तस्वीरों को आधुनिक WebP फॉर्मेट में तुरंत बदलें। बिना क्वालिटी खोए वेबसाइट और ब्लॉग की लोडिंग स्पीड को सुपरफास्ट बनाएं।",
    schemaType: "WebApplication",
    lang: "hi",
    faqs: [
      { q: "वेबसाइट एसईओ के लिए WebP फॉर्मेट का क्या फ़ायदा है?", a: "WebP फॉर्मेट समान विज़ुअल क्वालिटी में JPG की तुलना में 35% तक हल्का होता है, जिससे वेबसाइट लोडिंग स्पीड और Core Web Vitals स्कोर काफी बेहतर होता है।" },
      { q: "क्या WebP में बदलने से फ़ोटो की क्वालिटी कम हो जाती है?", a: "नहीं, WebP के आधुनिक एल्गोरिदम तस्वीर की शार्पनेस और रंगों को बनाए रखते हुए अनावश्यक बाइट्स को हटा देते हैं।" },
      { q: "क्या सभी ब्राउज़र और मोबाइल डिवाइस WebP को सपोर्ट करते हैं?", a: "हाँ, Google Chrome, Safari, Firefox, Edge और सभी आधुनिक Android व iOS मोबाइल ब्राउज़र WebP को 100% सपोर्ट करते हैं।" },
      { q: "क्या कन्वर्शन के दौरान मेरी फ़ोटो किसी सर्वर पर अपलोड होती है?", a: "बिल्कुल नहीं। सभी कन्वर्शन आपके ब्राउज़र की लोकल मेमोरी में होते हैं, जिससे आपकी प्राइवेसी पूरी तरह सुरक्षित रहती है।" },
      { q: "क्या मैं एक साथ कई फ़ोटो को WebP में बदल सकता हूँ?", a: "हाँ, आप एक साथ दर्जनों फ़ोटो चुनकर उन्हें बल्क में कन्वर्ट कर सकते हैं और एक ZIP फ़ाइल में डाउनलोड कर सकते हैं।" }
    ],
    body: `
      <main>
        <h1>फ़ोटो को WebP में बदलने का मुफ़्त कनवर्टर</h1>
        <p>JPG और PNG फ़ोटो को हल्के WebP फॉर्मेट में तुरंत बदलें और वेबसाइट स्पीड बढ़ाएं।</p>
        <section class="faqs">
          <h2>अक्सर पूछे जाने वाले सवाल</h2>
          <dl>
            <dt><strong>वेबसाइट एसईओ के लिए WebP फॉर्मेट का क्या फ़ायदा है?</strong></dt>
            <dd>WebP फॉर्मेट समान विज़ुअल क्वालिटी में JPG की तुलना में 35% तक हल्का होता है, जिससे वेबसाइट लोडिंग स्पीड और Core Web Vitals स्कोर काफी बेहतर होता है।</dd>
            <dt><strong>क्या WebP में बदलने से फ़ोटो की क्वालिटी कम हो जाती है?",</strong></dt>
            <dd>नहीं, WebP के आधुनिक एल्गोरिदम तस्वीर की शार्पनेस और रंगों को बनाए रखते हुए अनावश्यक बाइट्स को हटा देते हैं।</dd>
            <dt><strong>क्या सभी ब्राउज़र और मोबाइल डिवाइस WebP को सपोर्ट करते हैं?</strong></dt>
            <dd>हाँ, Google Chrome, Safari, Firefox, Edge और सभी आधुनिक Android व iOS मोबाइल ब्राउज़र WebP को 100% सपोर्ट करते हैं।</dd>
            <dt><strong>क्या कन्वर्शन के दौरान मेरी फ़ोटो किसी सर्वर पर अपलोड होती है?</strong></dt>
            <dd>बिल्कुल नहीं। सभी कन्वर्शन आपके ब्राउज़र की लोकल मेमोरी में होते हैं, जिससे आपकी प्राइवेसी पूरी तरह सुरक्षित रहती है।</dd>
            <dt><strong>क्या मैं एक साथ कई फ़ोटो को WebP में बदल सकता हूँ?</strong></dt>
            <dd>हाँ, आप एक साथ दर्जनों फ़ोटो चुनकर उन्हें बल्क में कन्वर्ट कर सकते हैं और एक ZIP फ़ाइल में डाउनलोड कर सकते हैं।</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/hi/jpg-to-webp": {
    title: "JPG से WebP कनवर्टर ऑनलाइन — फ़ोटो का साइज़ घटाएं | ImageSEO",
    description: "JPG इमेज को हल्के WebP फॉर्मेट में तुरंत बदलें। 100% सुरक्षित ब्राउज़र प्रोसेसिंग के साथ वेबसाइट रैंकिंग और स्पीड बेहतर करें।",
    schemaType: "WebApplication",
    lang: "hi",
    faqs: [
      { q: "JPG से WebP में बदलने पर फ़ाइल साइज़ कितना कम होता है?", a: "लगभग 35% से 50% तक साइज़ कम हो जाता है बिना किसी विज़ुअल खराबी के।" },
      { q: "क्या यह आईफोन और एंड्रॉइड पर काम करता है?", a: "हाँ, सभी आधुनिक मोबाइल ब्राउज़र WebP को सपोर्ट करते हैं।" },
      { q: "क्या हाई-रेज़ोल्यूशन तस्वीरें कन्वर्ट की जा सकती हैं?", a: "हाँ, बिना किसी लिमिट के।" },
      { q: "क्या टूल मुफ़्त है?", a: "हाँ, 100% मुफ़्त।" },
      { q: "क्या प्राइवेसी सुरक्षित है?", a: "हाँ, सारी प्रोसेसिंग आपके फ़ोन/कंप्यूटर में ही होती है।" }
    ],
    body: `
      <main>
        <h1>JPG से WebP कनवर्टर मुफ़्त ऑनलाइन</h1>
        <p>JPG फ़ोटो को WebP में बदलें और वेबसाइट की लोडिंग स्पीड तेज करें।</p>
        <section class="faqs">
          <h2>अक्सर पूछे जाने वाले सवाल</h2>
          <dl>
            <dt><strong>JPG से WebP में बदलने पर फ़ाइल साइज़ कितना कम होता है?</strong></dt>
            <dd>लगभग 35% से 50% तक साइज़ कम हो जाता है बिना किसी विज़ुअल खराबी के.</dd>
            <dt><strong>क्या यह आईफोन और एंड्रॉइड पर काम करता है?</strong></dt>
            <dd>हाँ, सभी आधुनिक मोबाइल ब्राउज़र WebP को सपोर्ट करते हैं।</dd>
            <dt><strong>क्या हाई-रेज़ोल्यूशन तस्वीरें कन्वर्ट की जा सकती हैं?</strong></dt>
            <dd>हाँ, बिना किसी लिमिट के।</dd>
            <dt><strong>क्या टूल मुफ़्त है?</strong></dt>
            <dd>हाँ, 100% मुफ़्त।</dd>
            <dt><strong>क्या प्राइवेसी सुरक्षित है?</strong></dt>
            <dd>हाँ, सारी प्रोसेसिंग आपके फ़ोन/कंप्यूटर में ही होती है।</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/hi/png-to-webp": {
    title: "PNG से WebP कनवर्टर ऑनलाइन मुफ़्त — पारदर्शी फ़ाइलें बनाएं | ImageSEO",
    description: "PNG फ़ोटो को WebP में कन्वर्ट करें और ट्रांसपेरेंट बैकग्राउंड सुरक्षित रखते हुए फ़ाइल साइज़ 80% तक कम करें।",
    schemaType: "WebApplication",
    lang: "hi",
    faqs: [
      { q: "क्या WebP पारदर्शी (Transparent) बैकग्राउंड को सपोर्ट करता है?", a: "हाँ, WebP पूरे Alpha Channel को सपोर्ट करता है और PNG से 70% हल्की फ़ाइल बनाता है।" },
      { q: "यह किन तस्वीरों के लिए उपयोगी है?", a: "लोगो, आइकन और पारदर्शी बैकग्राउंड वाले ग्राफिक्स के लिए।" },
      { q: "क्या कई PNG एक साथ बदल सकते हैं?", a: "हाँ, बल्क में कन्वर्ट करके ZIP फ़ाइल डाउनलोड कर सकते हैं।" },
      { q: "क्या यह मुफ़्त है?", a: "हाँ, 100% मुफ़्त।" },
      { q: "क्या मेरी तस्वीरें सुरक्षित हैं?", a: "हाँ, कोई फ़ाइल अपलोड नहीं होती।" }
    ],
    body: `
      <main>
        <h1>PNG से WebP कनवर्टर (पारदर्शी बैकग्राउंड के साथ)</h1>
        <p>पारदर्शी बैकग्राउंड के साथ PNG को WebP में बदलें और साइज़ 80% तक घटाएं।</p>
        <section class="faqs">
          <h2>अक्सर पूछे जाने वाले सवाल</h2>
          <dl>
            <dt><strong>क्या WebP पारदर्शी (Transparent) बैकग्राउंड को सपोर्ट करता है?</strong></dt>
            <dd>हाँ, WebP पूरे Alpha Channel को सपोर्ट करता है और PNG से 70% हल्की फ़ाइल बनाता है।</dd>
            <dt><strong>यह किन तस्वीरों के लिए उपयोगी है?</strong></dt>
            <dd>लोगो, आइकन और पारदर्शी बैकग्राउंड वाले ग्राफिक्स के लिए।</dd>
            <dt><strong>क्या कई PNG एक साथ बदल सकते हैं?</strong></dt>
            <dd>हाँ, बल्क में कन्वर्ट करके ZIP फ़ाइल डाउनलोड कर सकते हैं।</dd>
            <dt><strong>क्या यह मुफ़्त है?</strong></dt>
            <dd>हाँ, 100% मुफ़्त।</dd>
            <dt><strong>क्या मेरी तस्वीरें सुरक्षित हैं?</strong></dt>
            <dd>हाँ, कोई फ़ाइल अपलोड नहीं होती।</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/hi/free-geo-tagger": {
    title: "फ़ोटो में GPS लोकेशन जोड़ें — मुफ़्त EXIF जियोटैगर | ImageSEO",
    description: "लोकल एसईओ और Google Business Profile के लिए फ़ोटो में सटीक GPS कोऑर्डिनेट्स और EXIF डेटा जोड़ें। इंटरएक्टिव मैप के साथ 100% सुरक्षित।",
    schemaType: "WebApplication",
    lang: "hi",
    faqs: [
      { q: "जियोटैगिंग से लोकल एसईओ और गूगल मैप्स में क्या मदद मिलती है?", a: "तस्वीर के EXIF हेडर में GPS कोऑर्डिनेट्स (अक्षांश और देशांतर) जोड़ने से सर्च इंजन को प्रमाणित होता है कि आपका काम उसी शहर में हुआ है।" },
      { q: "क्या गूगल फ़ोटो के GPS EXIF डेटा को रैंकिंग के लिए पढ़ता है?", a: "हाँ, गूगल बिज़नेस प्रोफ़ाइल और लोकल सर्च एल्गोरिदम इमेज मेटाडेटा को सत्यापित लोकेशन सिग्नल के रूप में इस्तेमाल करते हैं।" },
      { q: "Google Business Profile के लिए फ़ोटो में लोकेशन कैसे जोड़ें?", a: "मैप पर अपनी दुकान या सर्विस एरिया चुनें, फ़ोटो अपलोड करें, GPS टैग इंजेक्ट करें और तैयार JPEG फ़ोटो को गूगल प्रोफ़ाइल पर अपलोड करें।" },
      { q: "कौन-से इमेज फॉर्मेट GPS EXIF मेटाडेटा को सपोर्ट करते हैं?", a: "EXIF GPS स्टैंडर्ड को मुख्य रूप से JPEG/JPG फॉर्मेट सपोर्ट करता है, और हमारा टूल पूरी तरह अनुकूलित JPEG फ़ाइल जनरेट करता है।" },
      { q: "क्या मेरी तस्वीरें और लोकेशन डेटा सुरक्षित रहते हैं?", a: "हाँ 100% सुरक्षित। सारा काम आपके ब्राउज़र में होता है, कोई भी फ़ाइल हमारे सर्वर पर नहीं भेजी जाती।" }
    ],
    body: `
      <main>
        <h1>फ़ोटो में लोकेशन डालने और EXIF GPS एडिट करने का मुफ़्त टूल</h1>
        <p>लोकल एसईओ और गूगल मैप्स के लिए तस्वीरों में लोकेशन और GPS कोऑर्डिनेट्स जोड़ें।</p>
        <section class="faqs">
          <h2>अक्सर पूछे जाने वाले सवाल</h2>
          <dl>
            <dt><strong>जियोटैगिंग से लोकल एसईओ और गूगल मैप्स में क्या मदद मिलती है?</strong></dt>
            <dd>तस्वीर के EXIF हेडर में GPS कोऑर्डिनेट्स (अक्षांश और देशांतर) जोड़ने से सर्च इंजन को प्रमाणित होता है कि आपका काम उसी शहर में हुआ है।</dd>
            <dt><strong>क्या गूगल फ़ोटो के GPS EXIF डेटा को रैंकिंग के लिए पढ़ता है?</strong></dt>
            <dd>हाँ, गूगल बिज़नेस प्रोफ़ाइल और लोकल सर्च एल्गोरिदम इमेज मेटाडेटा को सत्यापित लोकेशन सिग्नल के रूप में इस्तेमाल करते हैं।</dd>
            <dt><strong>Google Business Profile के लिए फ़ोटो में लोकेशन कैसे जोड़ें?</strong></dt>
            <dd>मैप पर अपनी दुकान या सर्विस एरिया चुनें, फ़ोटो अपलोड करें, GPS टैग इंजेक्ट करें और तैयार JPEG फ़ोटो को गूगल प्रोफ़ाइल पर अपलोड करें।</dd>
            <dt><strong>कौन-से इमेज फॉर्मेट GPS EXIF मेटाडेटा को सपोर्ट करते हैं?</strong></dt>
            <dd>EXIF GPS स्टैंडर्ड को मुख्य रूप से JPEG/JPG फॉर्मेट सपोर्ट करता है, और हमारा टूल पूरी तरह अनुकूलित JPEG फ़ाइल जनरेट करता है।</dd>
            <dt><strong>क्या मेरी तस्वीरें और लोकेशन डेटा सुरक्षित रहते हैं?</strong></dt>
            <dd>हाँ 100% सुरक्षित। सारा काम आपके ब्राउज़र में होता है, कोई भी फ़ाइल हमारे सर्वर पर नहीं भेजी जाती।</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/hi/free-online-image-compressor": {
    title: "फोटो का साइज कम करें — मुफ़्त इमेज कम्प्रेसर ऑनलाइन | ImageSEO",
    description: "JPG, PNG और WebP तस्वीरों को एक साथ कम्प्रेस करें बिना क्लेरिटी खोए। सरकारी फॉर्म, जॉब पोर्टल और वेबसाइट के लिए तुरंत साइज़ कम करें।",
    schemaType: "WebApplication",
    lang: "hi",
    faqs: [
      { q: "यह इमेज कम्प्रेसर फ़ोटो की क्लेरिटी बनाए रखते हुए साइज़ कैसे घटाता है?", a: "यह टूल स्मार्ट कैनवास एल्गोरिदम का उपयोग करके अनदेखे पिक्सेल डेटा को हटाता है, जिससे बिना क्वालिटी खोए फ़ाइल साइज़ KB में बहुत कम हो जाता है।" },
      { q: "वेबसाइट के लिए फ़ोटो का आदर्श साइज़ (KB) कितना होना चाहिए?", a: "वेबसाइट बैनर के लिए 150KB–200KB से कम, ब्लॉग और प्रोडक्ट फ़ोटो के लिए 50KB–100KB, और थंबनेल के लिए 30KB से कम साइज़ सबसे अच्छा माना जाता है।" },
      { q: "क्या फ़ोटो का साइज़ कम करने से Google PageSpeed स्कोर बढ़ता है?", a: "हाँ, भारी फ़ोटो वेबसाइट धीमी होने का सबसे बड़ा कारण हैं। कम्प्रेस करने से कुल पेज वेट 80% तक घट जाता है और स्पीड बढ़ जाती है।" },
      { q: "क्या फ़ोटो कम्प्रेस करने की कोई दैनिक सीमा या शुल्क है?", a: "कोई सीमा नहीं है। यह टूल आपके अपने डिवाइस की पावर पर चलता है और पूरी तरह मुफ़्त है।" },
      { q: "क्या सरकारी फॉर्म या रिज़्यूमे की तस्वीरें अपलोड करना सुरक्षित है?", a: "पूरी तरह सुरक्षित। आपकी तस्वीरें कभी भी इंटरनेट पर किसी सर्वर पर नहीं भेजी जाती हैं।" }
    ],
    body: `
      <main>
        <h1>फोटो का साइज कम करने का मुफ़्त ऑनलाइन टूल</h1>
        <p>सरकारी फॉर्म और वेबसाइट के लिए फ़ोटो का साइज़ KB में कम करें बिना धुंधला किए।</p>
        <section class="faqs">
          <h2>अक्सर पूछे जाने वाले सवाल</h2>
          <dl>
            <dt><strong>यह इमेज कम्प्रेसर फ़ोटो की क्लेरिटी बनाए रखते हुए साइज़ कैसे घटाता है?</strong></dt>
            <dd>यह टूल स्मार्ट कैनवास एल्गोरिदम का उपयोग करके अनदेखे पिक्सेल डेटा को हटाता है, जिससे बिना क्वालिटी खोए फ़ाइल साइज़ KB में बहुत कम हो जाता है।</dd>
            <dt><strong>वेबसाइट के लिए फ़ोटो का आदर्श साइज़ (KB) कितना होना चाहिए?</strong></dt>
            <dd>वेबसाइट बैनर के लिए 150KB–200KB से कम, ब्लॉग और प्रोडक्ट फ़ोटो के लिए 50KB–100KB, और थंबनेल के लिए 30KB से कम साइज़ सबसे अच्छा माना जाता है।</dd>
            <dt><strong>क्या फ़ोटो का साइज़ कम करने से Google PageSpeed स्कोर बढ़ता है?</strong></dt>
            <dd>हाँ, भारी फ़ोटो वेबसाइट धीमी होने का सबसे बड़ा कारण हैं। कम्प्रेस करने से कुल पेज वेट 80% तक घट जाता है और स्पीड बढ़ जाती है।</dd>
            <dt><strong>क्या फ़ोटो कम्प्रेस करने की कोई दैनिक सीमा या शुल्क है?</strong></dt>
            <dd>कोई सीमा नहीं है। यह टूल आपके अपने डिवाइस की पावर पर चलता है और पूरी तरह मुफ़्त है।</dd>
            <dt><strong>क्या सरकारी फॉर्म या रिज़्यूमे की तस्वीरें अपलोड करना सुरक्षित है?</strong></dt>
            <dd>पूरी तरह सुरक्षित। आपकी तस्वीरें कभी भी इंटरनेट पर किसी सर्वर पर नहीं भेजी जाती हैं।</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/hi/compress-jpg": {
    title: "JPG फ़ोटो कम्प्रेसर ऑनलाइन — बिना क्वालिटी खोए साइज़ घटाएं | ImageSEO",
    description: "JPG इमेज का साइज़ KB में कम करें। तेज़, सुरक्षित और सीधे आपके ब्राउज़र में चलने वाला बिना किसी लिमिट का टूल।",
    schemaType: "WebApplication",
    lang: "hi",
    faqs: [
      { q: "JPG फ़ोटो का साइज़ KB में कैसे घटाएं?", a: "क्वालिटी स्लाइडर की मदद से आप फ़ोटो को बिना धुंधला किए आसानी से हल्का कर सकते हैं।" },
      { q: "सर्वश्रेष्ठ कम्प्रेशन प्रतिशत क्या है?", a: "75% से 80% सेटिंग फ़ोटो की क्लेरिटी बनाए रखते हुए 70% तक साइज़ कम करती है।" },
      { q: "क्या यह टूल मुफ़्त है?", a: "हाँ, 100% मुफ़्त।" },
      { q: "क्या कई JPG एक साथ कम्प्रेस कर सकते हैं?", a: "हाँ, एक साथ कई तस्वीरें कम्प्रेस करके ZIP में डाउनलोड कर सकते हैं।" },
      { q: "क्या मेरी तस्वीरें सुरक्षित हैं?", a: "हाँ, सारी प्रोसेसिंग आपके ब्राउज़र में होती है।" }
    ],
    body: `
      <main>
        <h1>JPG फ़ोटो कम्प्रेस करें मुफ़्त ऑनलाइन</h1>
        <p>JPG तस्वीरों का साइज़ कम करें बिना धुंधला किए सीधे अपने ब्राउज़र में।</p>
        <section class="faqs">
          <h2>अक्सर पूछे जाने वाले सवाल</h2>
          <dl>
            <dt><strong>JPG फ़ोटो का साइज़ KB में कैसे घटाएं?</strong></dt>
            <dd>क्वालिटी स्लाइडर की मदद से आप फ़ोटो को बिना धुंधला किए आसानी से हल्का कर सकते हैं।</dd>
            <dt><strong>सर्वश्रेष्ठ कम्प्रेशन प्रतिशत क्या है?</strong></dt>
            <dd>75% से 80% सेटिंग फ़ोटो की क्लेरिटी बनाए रखते हुए 70% तक साइज़ कम करती है।</dd>
            <dt><strong>क्या यह टूल मुफ़्त है?</strong></dt>
            <dd>हाँ, 100% मुफ़्त।</dd>
            <dt><strong>क्या कई JPG एक साथ कम्प्रेस कर सकते हैं?</strong></dt>
            <dd>हाँ, एक साथ कई तस्वीरें कम्प्रेस करके ZIP में डाउनलोड कर सकते हैं।</dd>
            <dt><strong>क्या मेरी तस्वीरें सुरक्षित हैं?</strong></dt>
            <dd>हाँ, सारी प्रोसेसिंग आपके ब्राउज़र में होती है।</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/hi/compress-image-to-kb": {
    title: "फोटो का साइज 20KB, 50KB, 100KB कैसे करें ऑनलाइन | ImageSEO",
    description: "ऑनलाइन सरकारी फॉर्म और परीक्षाओं के लिए फ़ोटो का साइज़ 20KB, 50KB, 100KB में बदलें। 100% मुफ़्त और सुरक्षित।",
    schemaType: "WebApplication",
    lang: "hi",
    faqs: [
      { q: "फ़ोटो का साइज़ 20KB, 50KB या 100KB कैसे करें?", a: "हमारा टूल ऑटोमैटिक बाइनरी सर्च तकनीक से फ़ोटो को आपकी चुनी हुई KB लिमिट के ठीक नीचे सटीक रूप से कम्प्रेस करता है।" },
      { q: "क्या यह SSC, UPSC, रेलवे और बैंक फॉर्म के लिए उपयुक्त है?", a: "हाँ, यह सभी सरकारी परीक्षाओं और फॉर्म्स की फ़ोटो और सिग्नेचर साइज़ लिमिट के लिए सबसे उपयुक्त है।" },
      { q: "कौन-से फॉर्मेट सपोर्टेड हैं?", a: "JPG, PNG और WebP।" },
      { q: "क्या 20KB करने पर फ़ोटो में चेहरा साफ दिखेगा?", a: "हाँ, एल्गोरिदम चेहरे और हस्ताक्षर की स्पष्टता को बनाए रखता है।" },
      { q: "क्या दस्तावेज़ों की तस्वीरें अपलोड करना सुरक्षित है?", a: "हाँ, 100% सुरक्षित क्योंकि कोई भी फ़ाइल इंटरनेट पर नहीं भेजी जाती।" }
    ],
    body: `
      <main>
        <h1>फोटो का साइज 20KB, 50KB, 100KB करें</h1>
        <p>सरकारी परीक्षाओं (SSC, UPSC, रेलवे) के लिए फ़ोटो और सिग्नेचर का साइज़ सेट करें।</p>
        <section class="faqs">
          <h2>अक्सर पूछे जाने वाले सवाल</h2>
          <dl>
            <dt><strong>फ़ोटो का साइज़ 20KB, 50KB या 100KB कैसे करें?</strong></dt>
            <dd>हमारा टूल ऑटोमैटिक बाइनरी सर्च तकनीक से फ़ोटो को आपकी चुनी हुई KB लिमिट के ठीक नीचे सटीक रूप से कम्प्रेस करता है।</dd>
            <dt><strong>क्या यह SSC, UPSC, रेलवे और बैंक फॉर्म के लिए उपयुक्त है?</strong></dt>
            <dd>हाँ, यह सभी सरकारी परीक्षाओं और फॉर्म्स की फ़ोटो और सिग्नेचर साइज़ लिमिट के लिए सबसे उपयुक्त है।</dd>
            <dt><strong>कौन-से फॉर्मेट सपोर्टेड हैं?</strong></dt>
            <dd>JPG, PNG और WebP।</dd>
            <dt><strong>क्या 20KB करने पर फ़ोटो में चेहरा साफ दिखेगा?</strong></dt>
            <dd>हाँ, एल्गोरिदम चेहरे और हस्ताक्षर की स्पष्टता को बनाए रखता है।</dd>
            <dt><strong>क्या दस्तावेज़ों की तस्वीरें अपलोड करना सुरक्षित है?</strong></dt>
            <dd>हाँ, 100% सुरक्षित क्योंकि कोई भी फ़ाइल इंटरनेट पर नहीं भेजी जाती।</dd>
          </dl>
        </section>
      </main>
    `
  },
  "/hi/image-seo": {
    title: "इमेज एसईओ गाइड (2025) — गूगल में फ़ोटो रैंक कैसे करें | ImageSEO",
    description: "सिखिए गूगल सर्च में इमेज कैसे रैंक करें: WebP फॉर्मेट, इमेज कम्प्रेशन, ऑल्ट टेक्स्ट (Alt Text), सही फ़ाइल नाम और EXIF जियोटैगिंग का पूरा तरीका।",
    schemaType: "Article",
    lang: "hi",
    faqs: [
      { q: "इमेज एसईओ क्या है और यह क्यों ज़रूरी है?", a: "इमेज एसईओ वेबसाइट की तस्वीरों के ऑल्ट टेक्स्ट, फ़ाइल नाम, साइज़ और फॉर्मेट को ऑप्टिमाइज़ करने का तरीका है जिससे गूगल में फ़ोटो रैंक करती है और साइट तेज़ खुलती है।" },
      { q: "सही ऑल्ट टेक्स्ट (Alt Text) कैसे लिखें?", a: "तस्वीर का 10-15 शब्दों में सटीक वर्णन करें और मुख्य कीवर्ड को स्वाभाविक रूप से शामिल करें।" },
      { q: "फ़ोटो फ़ाइल का नाम कैसे रखें?", a: "हमेशा छोटे अक्षरों (lowercase) और हाइफ़न का उपयोग करके स्पष्ट नाम रखें (जैसे: interior-designer-south-delhi.webp)।" },
      { q: "तस्वीरों का आकार वेबसाइट लेआउट (CLS) को कैसे प्रभावित करता है?", a: "HTML में हमेशा चौड़ाई (width) और ऊंचाई (height) निश्चित करें ताकि पेज लोड होते समय स्क्रीन हिले नहीं।" },
      { q: "क्या गूगल WebP तस्वीरों को JPG जितना ही अच्छा रैंक करता है?", a: "हाँ, गूगल WebP को प्राथमिकता देता है क्योंकि यह वेबसाइट को तेज़ बनाता है।" }
    ],
    body: `
      <main>
        <article>
          <h1>इमेज एसईओ और वेबसाइट स्पीड ऑप्टिमाइजेशन की पूरी गाइड</h1>
          <p>गूगल में फोटो रैंक कराने के तरीके: ऑल्ट टेक्स्ट, फ़ाइल का सही नाम और WebP फॉर्मेट।</p>
          <section class="faqs">
            <h2>अक्सर पूछे जाने वाले सवाल</h2>
            <dl>
              <dt><strong>इमेज एसईओ क्या है और यह क्यों ज़रूरी है?</strong></dt>
              <dd>इमेज एसईओ वेबसाइट की तस्वीरों के ऑल्ट टेक्स्ट, फ़ाइल नाम, साइज़ और फॉर्मेट को ऑप्टिमाइज़ करने का तरीका है जिससे गूगल में फ़ोटो रैंक करती है और साइट तेज़ खुलती है।</dd>
              <dt><strong>सही ऑल्ट टेक्स्ट (Alt Text) कैसे लिखें?</strong></dt>
              <dd>तस्वीर का 10-15 शब्दों में सटीक वर्णन करें और मुख्य कीवर्ड को स्वाभाविक रूप से शामिल करें।</dd>
              <dt><strong>फ़ोटो फ़ाइल का नाम कैसे रखें?</strong></dt>
              <dd>हमेशा छोटे अक्षरों (lowercase) और हाइफ़न का उपयोग करके स्पष्ट नाम रखें (जैसे: interior-designer-south-delhi.webp)।</dd>
              <dt><strong>तस्वीरों का आकार वेबसाइट लेआउट (CLS) को कैसे प्रभावित करता है?</strong></dt>
              <dd>HTML में हमेशा चौड़ाई (width) और ऊंचाई (height) निश्चित करें ताकि पेज लोड होते समय स्क्रीन हिले नहीं।</dd>
              <dt><strong>क्या गूगल WebP तस्वीरों को JPG जितना ही अच्छा रैंक करता है?</strong></dt>
              <dd>हाँ, गूगल WebP को प्राथमिकता देता है क्योंकि यह वेबसाइट को तेज़ बनाता है।</dd>
            </dl>
          </section>
        </article>
      </main>
    `
  }
};

// Add blog posts to pages map
for (const post of blogPosts) {
  pages[`/blog/${post.slug}`] = {
    title: post.metaTitle,
    description: post.metaDescription,
    schemaType: "Article",
    dateISO: post.dateISO,
    image: post.image,
    author: post.author,
    faqs: post.faqs,
    body: renderBlogPostHtml(post)
  };
}

const template = await readFile(join(outputDir, "index.html"), "utf8");

// Clean base template: extract base shell without hardcoded tags
const cleanTemplate = template
  .replace(/<title>[\s\S]*?<\/title>/i, "{{TITLE}}")
  .replace(/<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i, "{{DESCRIPTION}}")
  .replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i, "{{CANONICAL}}")
  .replace(/<!--\s*Open Graph[\s\S]*?(?=<link\s+rel=["']icon)/i, "{{SOCIAL_META}}\n    ")
  .replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, "{{SCHEMA}}")
  .replace(/<div\s+id=["']root["']>[\s\S]*?<\/div>/i, "{{ROOT_CONTENT}}");

const supportedLangCodes = ["en", "es", "pt", "ar", "id", "hi"];

const localeMap = {
  en: "en_US",
  es: "es_ES",
  pt: "pt_BR",
  ar: "ar_AR",
  id: "id_ID",
  hi: "hi_IN"
};

const langNameMap = {
  es: "Español",
  pt: "Português",
  ar: "العربية",
  id: "Bahasa Indonesia",
  hi: "हिन्दी"
};

function getBreadcrumbs(route, page) {
  if (route === "/") {
    return null;
  }

  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": `${origin}/`
    }
  ];

  if (route.startsWith("/blog/")) {
    items.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": `${origin}/blog`
    });
    items.push({
      "@type": "ListItem",
      "position": 3,
      "name": page.title.split(" | ")[0] || page.title,
      "item": `${origin}${route}`
    });
  } else if (route === "/blog") {
    items.push({
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": `${origin}/blog`
    });
  } else if (/^\/(es|pt|ar|id|hi)(\/|$)/.test(route)) {
    const langMatch = route.match(/^\/(es|pt|ar|id|hi)/);
    const lang = langMatch ? langMatch[1] : "en";
    items.push({
      "@type": "ListItem",
      "position": 2,
      "name": langNameMap[lang] || lang.toUpperCase(),
      "item": `${origin}/${lang}`
    });

    if (route !== `/${lang}`) {
      items.push({
        "@type": "ListItem",
        "position": 3,
        "name": page.title.split(" | ")[0] || page.title,
        "item": `${origin}${route}`
      });
    }
  } else {
    items.push({
      "@type": "ListItem",
      "position": 2,
      "name": page.title.split(" | ")[0] || page.title,
      "item": `${origin}${route}`
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
  };
}

for (const [route, page] of Object.entries(pages)) {
  const canonical = `${origin}${route === "/" ? "/" : route}`;
  const titleTag = `<title>${escapeHtml(page.title)}</title>`;
  const descTag = `<meta name="description" content="${escapeHtml(page.description)}" />`;
  const canonicalTag = `<link rel="canonical" href="${canonical}" />`;

  // Language & Direction
  const pageLang = page.lang || (route.startsWith("/es") ? "es" : route.startsWith("/pt") ? "pt" : route.startsWith("/ar") ? "ar" : route.startsWith("/id") ? "id" : route.startsWith("/hi") ? "hi" : "en");
  const pageDir = pageLang === "ar" ? "rtl" : "ltr";
  const ogLocale = localeMap[pageLang] || "en_US";

  // Open Graph / Twitter Tags
  const isArticle = page.schemaType === "Article";
  const ogType = isArticle ? "article" : "website";

  let ogImage = `${origin}/opengraph.jpg`;
  let ogImageWidth = 1200;
  let ogImageHeight = 630;
  let ogImageAlt = page.title;

  if (page.image) {
    ogImage = page.image.startsWith("http") ? page.image : `${origin}${page.image.startsWith("/") ? page.image : "/images/blog/" + page.image}`;
    ogImageHeight = 675;
  }

  const socialMeta = `<!-- Open Graph / Facebook -->
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="IMGSEO" />
    <meta property="og:locale" content="${ogLocale}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(page.title)}" />
    <meta property="og:description" content="${escapeHtml(page.description)}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="${ogImageWidth}" />
    <meta property="og:image:height" content="${ogImageHeight}" />
    <meta property="og:image:alt" content="${escapeHtml(ogImageAlt)}" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${canonical}" />
    <meta name="twitter:title" content="${escapeHtml(page.title)}" />
    <meta name="twitter:description" content="${escapeHtml(page.description)}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="twitter:image:alt" content="${escapeHtml(ogImageAlt)}" />`;

  // Reciprocal Hreflang Tag Generation
  const baseRoute = route.replace(/^\/(es|pt|ar|id|hi)/, "") || "/";
  let hreflangTags = "";
  for (const langCode of supportedLangCodes) {
    const langRoute = langCode === "en" ? baseRoute : (baseRoute === "/" ? `/${langCode}` : `/${langCode}${baseRoute}`);
    hreflangTags += `\n    <link rel="alternate" hreflang="${langCode}" href="${origin}${langRoute === "/" ? "/" : langRoute}" />`;
  }
  const defaultRoute = baseRoute;
  hreflangTags += `\n    <link rel="alternate" hreflang="x-default" href="${origin}${defaultRoute === "/" ? "/" : defaultRoute}" />`;

  let schemas = [];

  // WebSite & Organization Schemas on root
  if (route === "/") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "IMGSEO",
      "url": origin,
      "description": page.description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${origin}/blog?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    });

    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "IMGSEO",
      "url": origin,
      "logo": {
        "@type": "ImageObject",
        "url": `${origin}/favicon.svg`
      }
    });
  }

  // BreadcrumbList Schema on subpages
  const breadcrumbSchema = getBreadcrumbs(route, page);
  if (breadcrumbSchema) {
    schemas.push(breadcrumbSchema);
  }

  if (page.schemaType === "Article") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": page.title,
      "description": page.description,
      "url": canonical,
      "image": ogImage,
      "datePublished": page.dateISO || "2026-09-23",
      "dateModified": page.dateISO || "2026-09-23",
      "author": {
        "@type": "Organization",
        "name": page.author || "IMGSEO Team",
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
    });
  } else if (page.schemaType === "WebApplication") {
    schemas.push({
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
    });
  } else {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": page.title,
      "url": canonical,
      "description": page.description
    });
  }

  // Include FAQPage Schema for every page with FAQs
  if (page.faqs && page.faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": page.faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    });
  }

  const schemaTag = schemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join("\n    ");
  const rootContent = `<div id="root"></div>\n    <noscript>\n      ${page.body}\n    </noscript>`;

  let html = cleanTemplate
    .replace("{{TITLE}}", titleTag)
    .replace("{{DESCRIPTION}}", descTag)
    .replace("{{CANONICAL}}", `${canonicalTag}${hreflangTags}`)
    .replace("{{SOCIAL_META}}", socialMeta)
    .replace("{{SCHEMA}}", schemaTag)
    .replace("{{ROOT_CONTENT}}", rootContent);

  // Set html lang and dir attribute
  html = html.replace(/<html[^>]*>/i, `<html lang="${pageLang}" dir="${pageDir}">`);

  const relativeDir = route === "/" ? "" : route.replace(/^\//, "");
  const targetDir = join(outputDir, relativeDir);
  await mkdir(targetDir, { recursive: true });
  await writeFile(join(targetDir, "index.html"), html, "utf8");
}

// Generate 404.html
const notFoundCanonical = `${origin}/404.html`;
const notFoundTitle = "Page Not Found | IMGSEO";
const notFoundDesc = "The requested IMGSEO page could not be found. Return to the homepage for free image tools.";
const notFoundOg = `<!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="IMGSEO" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="${notFoundCanonical}" />
    <meta property="og:title" content="${escapeHtml(notFoundTitle)}" />
    <meta property="og:description" content="${escapeHtml(notFoundDesc)}" />
    <meta property="og:image" content="${origin}/opengraph.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="IMGSEO - Page Not Found" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${notFoundCanonical}" />
    <meta name="twitter:title" content="${escapeHtml(notFoundTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(notFoundDesc)}" />
    <meta name="twitter:image" content="${origin}/opengraph.jpg" />
    <meta name="twitter:image:alt" content="IMGSEO - Page Not Found" />`;

let notFoundHtml = cleanTemplate
  .replace("{{TITLE}}", `<title>${notFoundTitle}</title>`)
  .replace("{{DESCRIPTION}}", `<meta name="description" content="${notFoundDesc}" />`)
  .replace("{{CANONICAL}}", `<link rel="canonical" href="${notFoundCanonical}" />`)
  .replace("{{SOCIAL_META}}", notFoundOg)
  .replace("{{SCHEMA}}", "")
  .replace("{{ROOT_CONTENT}}", '<div id="root"></div>\n    <noscript><main><h1>Page Not Found</h1><p>The requested page could not be found.</p><p><a href="/">Return to IMGSEO Home</a></p></main></noscript>');

notFoundHtml = notFoundHtml.replace(/<html[^>]*>/i, '<html lang="en" dir="ltr">');

await writeFile(join(outputDir, "404.html"), notFoundHtml, "utf8");

console.log(`Successfully prerendered ${Object.keys(pages).length} routes + 404.html to ${outputDir}`);

