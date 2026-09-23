import fs from 'node:fs';

const contentGaps = [
  {
    target_url: "/free-webp-converter",
    target_keyword: "webp converter",
    cluster: "conversion",
    intent: "Transactional / Tool",
    competitor_benchmark: "toWebP / CloudConvert offer instant conversion matrix and format FAQs",
    current_local_state: "Client React tool functional; SSG HTML output contains only H1 + single paragraph",
    identified_gap: "Static HTML lacks explanation of WebP compression benefits, format support table, and step-by-step instructions",
    recommended_action: "Inject semantic HTML in prerender containing tool guide, browser compatibility table, and FAQPage schema",
    priority: "P1"
  },
  {
    target_url: "/jpg-to-webp",
    target_keyword: "jpg to webp",
    cluster: "conversion",
    intent: "Transactional / Task",
    competitor_benchmark: "Dedicated landing pages with JPG-specific quality comparison and savings data",
    current_local_state: "Dedicated route created; SSG HTML contains minimal H1+P shell",
    identified_gap: "Needs specific copy addressing DCT artifacts, typical 25-35% file size reduction, and recommended quality (80-85%)",
    recommended_action: "Enhance SSG rendered body with JPG-to-WebP comparison guide, FAQ, and internal links",
    priority: "P1"
  },
  {
    target_url: "/png-to-webp",
    target_keyword: "png to webp",
    cluster: "conversion",
    intent: "Transactional / Task",
    competitor_benchmark: "Top competitors explain lossless WebP and alpha transparency retention",
    current_local_state: "Dedicated route created; SSG HTML contains minimal shell",
    identified_gap: "Needs clear explanation of alpha channel preservation vs PNG-24 weight reduction for web graphics",
    recommended_action: "Add transparency preservation guide and lossless WebP technical context in rendered body",
    priority: "P1"
  },
  {
    target_url: "/free-geo-tagger",
    target_keyword: "free geo tagger",
    cluster: "metadata/geotagging",
    intent: "Transactional / Tool",
    competitor_benchmark: "GeoImgr / GeoTag.world provide interactive maps and EXIF field breakdowns",
    current_local_state: "Interactive Leaflet map tool in client; SSG HTML is H1+P shell",
    identified_gap: "Static HTML lacks explanation of EXIF GPS coordinates, privacy guarantees, and photo metadata best practices",
    recommended_action: "Add semantic how-to guide, GPS EXIF explanation, and FAQ in prerendered HTML without false ranking claims",
    priority: "P1"
  },
  {
    target_url: "/free-online-image-compressor",
    target_keyword: "image compressor",
    cluster: "compression",
    intent: "Transactional / Tool",
    competitor_benchmark: "TinyPNG / Squoosh explain compression ratios, visual fidelity, and Core Web Vitals (LCP)",
    current_local_state: "Client compressor supports multi-format batch; SSG HTML contains minimal shell",
    identified_gap: "Missing static comparison table of compression algorithms and page speed performance impact",
    recommended_action: "Add comprehensive compression guide, quality vs size table, and FAQ in static HTML",
    priority: "P1"
  },
  {
    target_url: "/compress-jpg",
    target_keyword: "compress jpg",
    cluster: "compression",
    intent: "Transactional / Task",
    competitor_benchmark: "CompressJPEG / 11zon feature dedicated JPEG compression sliders and batch ZIP downloads",
    current_local_state: "Dedicated route created; SSG HTML contains minimal shell",
    identified_gap: "Needs detailed JPEG optimization guidance, quality presets, and clear download instructions",
    recommended_action: "Enrich static HTML with JPEG compression workflow, artifact prevention tips, and FAQs",
    priority: "P1"
  },
  {
    target_url: "/image-seo",
    target_keyword: "image seo",
    cluster: "knowledge hub",
    intent: "Informational / Pillar",
    competitor_benchmark: "Google Search Central / Yoast provide in-depth pillars on alt text, file names, responsive images, and sitemaps",
    current_local_state: "Dedicated route created with comprehensive React guide component; SSG HTML is minimal shell",
    identified_gap: "Search engines crawling raw HTML miss the entire 2,000+ word pillar guide, structured headings, and internal links",
    recommended_action: "Prerender complete pillar guide HTML with semantic sections, Google Search Central citations, and Article schema",
    priority: "P1"
  },
  {
    target_url: "/blog/* (6 posts)",
    target_keyword: "image seo long-tail & local business",
    cluster: "blog/spokes",
    intent: "Informational / Supporting",
    competitor_benchmark: "Ranking blog posts have full SSR/SSG article bodies with Article JSON-LD and Author/Date metadata",
    current_local_state: "COMPLETELY OMITTED from prerender script; missing from static dist HTML",
    identified_gap: "Critical P0 blocker: 6 blog posts return 404 or fall back to generic SPA homepage shell on static host",
    recommended_action: "Add all 6 blog posts to prerender pipeline with complete article body, Article schema, and Breadcrumbs",
    priority: "P0"
  }
];

function generate() {
  const header = [
    'target_url',
    'target_keyword',
    'cluster',
    'intent',
    'competitor_benchmark',
    'current_local_state',
    'identified_gap',
    'recommended_action',
    'priority'
  ].join(',');

  const rows = contentGaps.map(r => [
    `"${r.target_url}"`,
    `"${r.target_keyword}"`,
    `"${r.cluster}"`,
    `"${r.intent}"`,
    `"${r.competitor_benchmark.replace(/"/g, '""')}"`,
    `"${r.current_local_state.replace(/"/g, '""')}"`,
    `"${r.identified_gap.replace(/"/g, '""')}"`,
    `"${r.recommended_action.replace(/"/g, '""')}"`,
    `"${r.priority}"`
  ].join(','));

  fs.writeFileSync('docs/seo/post-codex-content-gaps.csv', [header, ...rows].join('\n'), 'utf8');
  console.log('Successfully wrote docs/seo/post-codex-content-gaps.csv');
}

generate();
