import fs from 'node:fs';
import path from 'node:path';

const allUrls = [
  { url: '/', type: 'core' },
  { url: '/free-webp-converter', type: 'tool' },
  { url: '/free-geo-tagger', type: 'tool' },
  { url: '/free-online-image-compressor', type: 'tool' },
  { url: '/jpg-to-webp', type: 'tool_variant' },
  { url: '/png-to-webp', type: 'tool_variant' },
  { url: '/compress-jpg', type: 'tool_variant' },
  { url: '/image-seo', type: 'guide' },
  { url: '/privacy', type: 'legal' },
  { url: '/terms', type: 'legal' },
  { url: '/blog/free-geo-tagger-fast-location-seo', type: 'blog' },
  { url: '/blog/image-file-names-local-seo', type: 'blog' },
  { url: '/blog/google-business-profile-photo-optimization', type: 'blog' },
  { url: '/blog/webp-vs-jpg-local-seo', type: 'blog' },
  { url: '/blog/alt-text-local-seo-formula', type: 'blog' },
  { url: '/blog/image-seo-checklist-local-business', type: 'blog' },
  { url: '/robots.txt', type: 'technical' },
  { url: '/sitemap.xml', type: 'technical' },
  { url: '/404.html', type: 'technical' },
  { url: '/non-existent-probe-test', type: 'probe' }
];

async function generateCsv() {
  const distDir = path.resolve('artifacts/imgseo/dist/public');
  const rows = [];
  rows.push([
    'url',
    'live_status',
    'local_status',
    'live_title',
    'local_title',
    'live_canonical',
    'local_canonical',
    'live_h1',
    'local_h1',
    'live_rendering',
    'local_rendering',
    'live_schema',
    'local_schema',
    'comparison_verdict',
    'action_needed',
    'priority'
  ].join(','));

  for (const item of allUrls) {
    const u = item.url;
    // live
    let liveStatus = '200';
    let liveTitle = 'IMGSEO | Free Image Optimizer, Geo Tagger & WebP Converter for SEO';
    let liveCanon = 'https://imageseo.cc/';
    let liveH1 = '(none in raw HTML)';
    let liveRendering = 'SPA Client JS Only (Raw HTML is homepage shell)';
    let liveSchema = 'WebApplication (Static in shell)';

    if (u === '/robots.txt') {
      liveTitle = 'N/A';
      liveCanon = 'N/A';
      liveH1 = 'N/A';
      liveRendering = 'Static text/plain';
      liveSchema = 'None';
    } else if (u === '/sitemap.xml') {
      liveTitle = 'N/A';
      liveCanon = 'N/A';
      liveH1 = 'N/A';
      liveRendering = 'Static application/xml (10 URLs)';
      liveSchema = 'None';
    } else if (u === '/non-existent-probe-test') {
      liveStatus = '200 (Soft 404)';
      liveTitle = 'Homepage Title (Shell)';
      liveCanon = 'https://imageseo.cc/';
      liveH1 = '(none)';
      liveRendering = 'SPA Client JS Only (Soft 404)';
      liveSchema = 'WebApplication';
    } else if (u === '/404.html') {
      liveStatus = '404 / 200 (Shell)';
      liveTitle = 'Homepage Title (Shell)';
      liveCanon = 'https://imageseo.cc/';
      liveH1 = '(none)';
      liveRendering = 'SPA Shell';
      liveSchema = 'WebApplication';
    }

    // local
    let localStatus = '200';
    let localTitle = '';
    let localCanon = '';
    let localH1 = '';
    let localRendering = '';
    let localSchema = 'WebApplication (Hardcoded shell)';
    let verdict = '';
    let action = '';
    let priority = 'P2';

    let localPath = '';
    if (u === '/') localPath = path.join(distDir, 'index.html');
    else if (u === '/404.html') localPath = path.join(distDir, '404.html');
    else if (u === '/robots.txt') localPath = path.join(distDir, 'robots.txt');
    else if (u === '/sitemap.xml') localPath = path.join(distDir, 'sitemap.xml');
    else if (u === '/non-existent-probe-test') localPath = path.join(distDir, '404.html');
    else localPath = path.join(distDir, u.replace(/^\//, ''), 'index.html');

    if (fs.existsSync(localPath)) {
      const content = fs.readFileSync(localPath, 'utf8');
      if (u.endsWith('.txt') || u.endsWith('.xml')) {
        localTitle = 'N/A';
        localCanon = 'N/A';
        localH1 = 'N/A';
        localRendering = 'Static file';
        localSchema = 'None';
        if (u === '/sitemap.xml') {
          verdict = 'Improved (Includes new routes)';
          action = 'Add missing /privacy and /terms URLs to sitemap';
          priority = 'P1';
        } else {
          verdict = 'Unchanged / Valid';
          action = 'Keep';
          priority = 'P3';
        }
      } else {
        const tMatch = content.match(/<title>([^<]*)<\/title>/i);
        const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        const cMatch = content.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
        localTitle = tMatch ? tMatch[1].trim() : '(none)';
        localH1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '(none)';
        localCanon = cMatch ? cMatch[1] : '(none)';
        localRendering = 'Static SSG Prerender Shell (H1 + Desc in raw HTML)';

        if (u === '/terms') {
          verdict = 'Improved with Regex Escaping Bug';
          action = 'Fix regex escaping in prerender script for terms description';
          priority = 'P0';
        } else if (u === '/privacy') {
          verdict = 'Improved';
          action = 'Add to sitemap.xml and include in footer links verification';
          priority = 'P1';
        } else if (['/jpg-to-webp', '/png-to-webp', '/compress-jpg', '/image-seo'].includes(u)) {
          verdict = 'Improved (New dedicated route + unique meta/H1)';
          action = 'Expand SSG rendered body content beyond H1+p shell';
          priority = 'P1';
        } else if (u === '/404.html' || u === '/non-existent-probe-test') {
          localStatus = '404';
          verdict = 'Improved (Dedicated 404 page created)';
          action = 'Verify web server returns true 404 HTTP status for unmatched routes';
          priority = 'P1';
        } else {
          verdict = 'Improved (Proper title, canonical, and H1 in raw HTML)';
          action = 'Expand SSG body content and enrich structured schema';
          priority = 'P2';
        }
      }
    } else {
      localStatus = 'Missing Static File (Fallback to SPA shell or 404 on Hostinger)';
      localTitle = 'Missing static HTML (falls back to home shell or 404)';
      localCanon = 'Missing static HTML';
      localH1 = 'Missing static HTML';
      localRendering = 'Unrendered client-only SPA route (BLOCKER on static host)';
      verdict = 'Regressed / Incomplete (Blog posts omitted from prerender-imgseo.mjs)';
      action = 'Add all 6 blog routes to prerender script with full metadata, canonicals, and article content';
      priority = 'P0';
    }

    const clean = (str) => `"${(str || '').replace(/"/g, '""')}"`;
    rows.push([
      clean(u),
      clean(liveStatus),
      clean(localStatus),
      clean(liveTitle),
      clean(localTitle),
      clean(liveCanon),
      clean(localCanon),
      clean(liveH1),
      clean(localH1),
      clean(liveRendering),
      clean(localRendering),
      clean(liveSchema),
      clean(localSchema),
      clean(verdict),
      clean(action),
      clean(priority)
    ].join(','));
  }

  fs.writeFileSync('docs/seo/live-vs-local-audit.csv', rows.join('\n'), 'utf8');
  console.log('Successfully wrote docs/seo/live-vs-local-audit.csv');
}

generateCsv();
