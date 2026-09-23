import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('artifacts/imgseo/dist/public');
const publicDir = path.resolve('artifacts/imgseo/public');

// Ensure sitemap.xml and robots.txt are in distDir
if (fs.existsSync(path.join(publicDir, 'sitemap.xml'))) {
  fs.copyFileSync(path.join(publicDir, 'sitemap.xml'), path.join(distDir, 'sitemap.xml'));
}
if (fs.existsSync(path.join(publicDir, 'robots.txt'))) {
  fs.copyFileSync(path.join(publicDir, 'robots.txt'), path.join(distDir, 'robots.txt'));
}
if (fs.existsSync(path.join(publicDir, '.htaccess'))) {
  fs.copyFileSync(path.join(publicDir, '.htaccess'), path.join(distDir, '.htaccess'));
}

const expectedRoutes = [
  '/',
  '/free-webp-converter',
  '/free-geo-tagger',
  '/free-online-image-compressor',
  '/jpg-to-webp',
  '/png-to-webp',
  '/compress-jpg',
  '/compress-image-to-kb',
  '/image-seo',
  '/privacy',
  '/terms',
  '/blog',
  // 11 Blog Posts
  '/blog/free-geo-tagger-fast-location-seo',
  '/blog/image-file-names-local-seo',
  '/blog/google-business-profile-photo-optimization',
  '/blog/webp-vs-jpg-local-seo',
  '/blog/alt-text-local-seo-formula',
  '/blog/image-seo-checklist-local-business',
  '/blog/generative-ai-image-search-optimization',
  '/blog/fix-largest-contentful-paint-lcp-image-optimization',
  '/blog/ecommerce-product-image-seo-guide',
  '/blog/exif-metadata-local-pack-rankings-study',
  '/blog/target-kb-image-compression-passport-visas-forms',
  // Spanish (es)
  '/es',
  '/es/free-webp-converter',
  '/es/free-geo-tagger',
  '/es/free-online-image-compressor',
  '/es/jpg-to-webp',
  '/es/png-to-webp',
  '/es/compress-jpg',
  '/es/compress-image-to-kb',
  '/es/image-seo',
  // Portuguese (pt)
  '/pt',
  '/pt/free-webp-converter',
  '/pt/free-geo-tagger',
  '/pt/free-online-image-compressor',
  '/pt/jpg-to-webp',
  '/pt/png-to-webp',
  '/pt/compress-jpg',
  '/pt/compress-image-to-kb',
  '/pt/image-seo',
  // Arabic (ar)
  '/ar',
  '/ar/free-webp-converter',
  '/ar/free-geo-tagger',
  '/ar/free-online-image-compressor',
  '/ar/jpg-to-webp',
  '/ar/png-to-webp',
  '/ar/compress-jpg',
  '/ar/compress-image-to-kb',
  '/ar/image-seo',
  // Indonesian (id)
  '/id',
  '/id/free-webp-converter',
  '/id/free-geo-tagger',
  '/id/free-online-image-compressor',
  '/id/jpg-to-webp',
  '/id/png-to-webp',
  '/id/compress-jpg',
  '/id/compress-image-to-kb',
  '/id/image-seo',
  // Hindi (hi)
  '/hi',
  '/hi/free-webp-converter',
  '/hi/free-geo-tagger',
  '/hi/free-online-image-compressor',
  '/hi/jpg-to-webp',
  '/hi/png-to-webp',
  '/hi/compress-jpg',
  '/hi/compress-image-to-kb',
  '/hi/image-seo'
];

function auditTechnical() {
  const report = [];

  for (const route of expectedRoutes) {
    const filePath = route === '/' ? path.join(distDir, 'index.html') : path.join(distDir, route.replace(/^\//, ''), 'index.html');
    const exists = fs.existsSync(filePath);
    if (!exists) {
      report.push({
        route,
        status: 'MISSING_FILE',
        verdict: 'FAIL'
      });
      continue;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content="([^"]*)"/i);
    const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href="([^"]*)"/i);
    const ogUrlMatch = html.match(/<meta\s+property=["']og:url["']\s+content="([^"]*)"/i);
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const schemas = (html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi) || []);

    const title = titleMatch ? titleMatch[1].trim() : '(none)';
    const desc = descMatch ? descMatch[1] : '(none)';
    const canonical = canonMatch ? canonMatch[1] : '(none)';
    const ogUrl = ogUrlMatch ? ogUrlMatch[1] : '(none)';
    const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '(none)';

    const expectedCanon = `https://imageseo.cc${route === '/' ? '/' : route}`;
    const canonPass = canonical === expectedCanon;

    report.push({
      route,
      status: 'PRESENT',
      title,
      descLength: desc.length,
      canonical,
      canonPass,
      ogUrl,
      h1,
      schemasCount: schemas.length,
      verdict: canonPass && h1 !== '(none)' && desc.length > 50 ? 'PASS' : 'WARN'
    });
  }

  // 404 check
  const notFoundPath = path.join(distDir, '404.html');
  const notFoundExists = fs.existsSync(notFoundPath);

  // sitemap check
  const sitemapPath = path.join(distDir, 'sitemap.xml');
  const sitemapContent = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
  const sitemapUrls = (sitemapContent.match(/<loc>(.*?)<\/loc>/g) || []).map(s => s.replace(/<\/?loc>/g, ''));

  // robots check
  const robotsPath = path.join(distDir, 'robots.txt');
  const robotsContent = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, 'utf8') : '';

  console.log(JSON.stringify({
    totalAuditedRoutes: report.length,
    passedRoutesCount: report.filter(r => r.verdict === 'PASS').length,
    routesReport: report,
    notFoundFile: notFoundExists,
    sitemapUrlsCount: sitemapUrls.length,
    sitemapUrls,
    robotsValid: robotsContent.includes('Sitemap:') && robotsContent.includes('Allow: /')
  }, null, 2));
}

auditTechnical();
