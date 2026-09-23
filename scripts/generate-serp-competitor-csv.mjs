import fs from 'node:fs';

const competitorRows = [
  {
    query_or_keyword: "webp converter",
    p1_cluster: "conversion",
    top_competitors: "cloudconvert.com, towebp.io, freeconvert.com, anywebp.com",
    competitor_advantages: "High domain authority, broad format matrix, cloud queue infrastructure",
    competitor_weaknesses: "Server upload delays, daily conversion limits (e.g. 25/day on CloudConvert), intrusive ads",
    imageseo_advantages: "100% client-side browser conversion, zero upload wait, zero privacy risk, unlimited batch, integrated SEO filename generator",
    imageseo_gaps: "Local prerendered static HTML is currently thin (H1+p only); lacks comparison table in static HTML",
    feature_opportunity: "Show instantaneous file size reduction percentage and side-by-side quality preview",
    schema_gap: "Missing SoftwareApplication & HowTo JSON-LD schema",
    verdict: "High opportunity to outrank on speed, privacy, and UX"
  },
  {
    query_or_keyword: "jpg to webp",
    p1_cluster: "conversion",
    top_competitors: "cloudconvert.com, towebp.io, iloveimg.com",
    competitor_advantages: "Established format-pair landing pages, strong backlink profiles",
    competitor_weaknesses: "Generic template copy, remote server storage, lack of image SEO guidance",
    imageseo_advantages: "Dedicated JPG->WebP landing page with browser compression slider, instant download, and privacy",
    imageseo_gaps: "Static HTML needs rich explanation of JPEG compression artifacts vs WebP savings",
    feature_opportunity: "Default to 80-85% WebP quality preset recommended by Google web.dev",
    schema_gap: "Missing FAQPage and BreadcrumbList schema",
    verdict: "Strong attainable format-pair target"
  },
  {
    query_or_keyword: "png to webp",
    p1_cluster: "conversion",
    top_competitors: "cloudconvert.com, towebp.io, freeconvert.com",
    competitor_advantages: "High search ranking, multi-file format support",
    competitor_weaknesses: "Fails to explain alpha channel / transparency handling in lossy vs lossless WebP",
    imageseo_advantages: "Dedicated transparency-focused guidance, client canvas processing without alpha degradation",
    imageseo_gaps: "Need clear documentation explaining alpha channel preservation in rendered copy",
    feature_opportunity: "Transparency detection flag and lossless toggle",
    schema_gap: "Missing FAQPage schema",
    verdict: "High differentiation potential via transparency preservation"
  },
  {
    query_or_keyword: "free geo tagger",
    p1_cluster: "metadata/geotagging",
    top_competitors: "freegeotagger.com, geotag.world, tool.geoimgr.com",
    competitor_advantages: "GeoImgr has strong brand recognition in local SEO; GeoTag.world has clean leaflet map",
    competitor_weaknesses: "GeoImgr caps free tier at 5 photos/day and paywalls batch processing; some competitors make unscientific local rank claims",
    imageseo_advantages: "100% free unlimited batch geotagging, Leaflet map UI, privacy-first (no server upload), honest metadata utility positioning",
    imageseo_gaps: "Local prerender HTML omits map explanation; needs step-by-step metadata workflow in SSG shell",
    feature_opportunity: "Add batch GPS coordinate assignment and EXIF preview before saving",
    schema_gap: "Missing HowTo and WebApplication schema for geotagger",
    verdict: "Major opportunity to win users frustrated by GeoImgr daily paywalls"
  },
  {
    query_or_keyword: "image compressor",
    p1_cluster: "compression",
    top_competitors: "tinypng.com, iloveimg.com, squoosh.app",
    competitor_advantages: "TinyPNG brand dominance; Squoosh fine-grained WASM codecs (MozJPEG, OxiPNG)",
    competitor_weaknesses: "TinyPNG uploads files to remote server, limits 20 images/5MB on free tier; Squoosh is single-image only (no batch)",
    imageseo_advantages: "Batch compression + privacy-first client processing + multi-format output + ZIP download",
    imageseo_gaps: "Static HTML needs comprehensive compression comparison table and Core Web Vitals context",
    feature_opportunity: "Batch ZIP download and instant preview",
    schema_gap: "Missing WebApplication and FAQPage schema",
    verdict: "High utility value; differentiate on batch + zero uploads"
  },
  {
    query_or_keyword: "compress jpg",
    p1_cluster: "compression",
    top_competitors: "compressjpeg.com, iloveimg.com, 11zon.com",
    competitor_advantages: "Ranked for exact format query, simple UI",
    competitor_weaknesses: "Cluttered ad layouts, lack of educational guidance on DCT compression and chroma subsampling",
    imageseo_advantages: "Clean ad-free UI, client processing, integrated SEO file naming",
    imageseo_gaps: "Prerendered HTML needs detailed JPEG compression guide and FAQ",
    feature_opportunity: "Visual comparison slider for before/after compression",
    schema_gap: "Missing FAQPage schema",
    verdict: "Strong P1 capture"
  },
  {
    query_or_keyword: "image seo",
    p1_cluster: "knowledge hub",
    top_competitors: "developers.google.com, yoast.com, ahrefs.com, semrush.com",
    competitor_advantages: "Massive domain rating and editorial authority",
    competitor_weaknesses: "Articles are purely informational without instant built-in utility tools",
    imageseo_advantages: "Actionable pillar hub that connects Google Search Central guidelines directly to interactive browser tools",
    imageseo_gaps: "Prerendered static HTML is minimal; must include full guide text, Google citations, and internal links",
    feature_opportunity: "Interactive SEO checklist and quick links to converter/compressor/geotagger",
    schema_gap: "Missing Article & BreadcrumbList structured data",
    verdict: "Pillar hub with strong topical authority potential"
  }
];

function generate() {
  const header = [
    'query_or_keyword',
    'p1_cluster',
    'top_competitors',
    'competitor_advantages',
    'competitor_weaknesses',
    'imageseo_advantages',
    'imageseo_gaps',
    'feature_opportunity',
    'schema_gap',
    'verdict'
  ].join(',');

  const rows = competitorRows.map(r => [
    `"${r.query_or_keyword}"`,
    `"${r.p1_cluster}"`,
    `"${r.top_competitors.replace(/"/g, '""')}"`,
    `"${r.competitor_advantages.replace(/"/g, '""')}"`,
    `"${r.competitor_weaknesses.replace(/"/g, '""')}"`,
    `"${r.imageseo_advantages.replace(/"/g, '""')}"`,
    `"${r.imageseo_gaps.replace(/"/g, '""')}"`,
    `"${r.feature_opportunity.replace(/"/g, '""')}"`,
    `"${r.schema_gap.replace(/"/g, '""')}"`,
    `"${r.verdict.replace(/"/g, '""')}"`
  ].join(','));

  fs.writeFileSync('docs/seo/serp-competitor-validation.csv', [header, ...rows].join('\n'), 'utf8');
  console.log('Successfully wrote docs/seo/serp-competitor-validation.csv');
}

generate();
