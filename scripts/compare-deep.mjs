import fs from 'node:fs';
import path from 'node:path';

const routes = [
  '/',
  '/free-webp-converter',
  '/free-geo-tagger',
  '/free-online-image-compressor',
  '/jpg-to-webp',
  '/png-to-webp',
  '/compress-jpg',
  '/image-seo',
  '/privacy',
  '/terms',
  '/blog/free-geo-tagger-fast-location-seo',
  '/blog/image-file-names-local-seo',
  '/blog/google-business-profile-photo-optimization',
  '/blog/webp-vs-jpg-local-seo',
  '/blog/alt-text-local-seo-formula',
  '/blog/image-seo-checklist-local-business',
  '/non-existent-404-check'
];

async function run() {
  const distDir = path.resolve('artifacts/imgseo/dist/public');
  const results = [];

  for (const route of routes) {
    // 1. Live
    let liveData = { status: null, title: null, h1: null, canonical: null, desc: null, schemaCount: 0, htmlLen: 0 };
    if (route !== '/non-existent-404-check') {
      try {
        const liveRes = await fetch(`https://imageseo.cc${route}`, { redirect: 'manual' });
        const liveText = await liveRes.text();
        const liveTitle = (liveText.match(/<title>([^<]*)<\/title>/i) || [])[1];
        const liveH1 = (liveText.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
        const liveCanon = (liveText.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) || [])[1];
        const liveDesc = (liveText.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || [])[1];
        const liveSchemas = (liveText.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || []).length;
        liveData = {
          status: liveRes.status,
          title: liveTitle ? liveTitle.trim() : '(none)',
          h1: liveH1 ? liveH1.replace(/<[^>]+>/g, '').trim() : '(none)',
          canonical: liveCanon || '(none)',
          desc: liveDesc || '(none)',
          schemaCount: liveSchemas,
          htmlLen: liveText.length
        };
      } catch (e) {
        liveData.error = e.message;
      }
    } else {
      try {
        const liveRes = await fetch(`https://imageseo.cc/non-existent-404-check`, { redirect: 'manual' });
        liveData = { status: liveRes.status, htmlLen: (await liveRes.text()).length };
      } catch (e) {
        liveData.error = e.message;
      }
    }

    // 2. Local dist
    let localData = { fileExists: false, title: null, h1: null, canonical: null, desc: null, schemaCount: 0, htmlLen: 0 };
    let filePath = '';
    if (route === '/') {
      filePath = path.join(distDir, 'index.html');
    } else if (route === '/non-existent-404-check') {
      filePath = path.join(distDir, '404.html');
    } else {
      filePath = path.join(distDir, route.replace(/^\//, ''), 'index.html');
    }

    if (fs.existsSync(filePath)) {
      const localText = fs.readFileSync(filePath, 'utf8');
      const localTitle = (localText.match(/<title>([^<]*)<\/title>/i) || [])[1];
      const localH1 = (localText.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1];
      const localCanon = (localText.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i) || [])[1];
      const localDesc = (localText.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) || [])[1];
      const localSchemas = (localText.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || []).length;
      localData = {
        fileExists: true,
        title: localTitle ? localTitle.trim() : '(none)',
        h1: localH1 ? localH1.replace(/<[^>]+>/g, '').trim() : '(none)',
        canonical: localCanon || '(none)',
        desc: localDesc || '(none)',
        schemaCount: localSchemas,
        htmlLen: localText.length
      };
    } else {
      localData = { fileExists: false, note: 'Missing static HTML file in dist/public' };
    }

    results.push({
      route,
      live: liveData,
      local: localData
    });
  }

  console.log(JSON.stringify(results, null, 2));
}

run();
