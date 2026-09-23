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
  '/blog/free-geo-tagger-fast-location-seo',
  '/blog/image-file-names-local-seo',
  '/blog/google-business-profile-photo-optimization',
  '/blog/webp-vs-jpg-local-seo',
  '/blog/alt-text-local-seo-formula',
  '/blog/image-seo-checklist-local-business'
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
