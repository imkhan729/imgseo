import fs from 'node:fs';

const urls = [
  'https://imageseo.cc/',
  'https://imageseo.cc/robots.txt',
  'https://imageseo.cc/sitemap.xml',
  'https://imageseo.cc/free-webp-converter',
  'https://imageseo.cc/free-geo-tagger',
  'https://imageseo.cc/free-online-image-compressor',
  'https://imageseo.cc/jpg-to-webp',
  'https://imageseo.cc/png-to-webp',
  'https://imageseo.cc/compress-jpg',
  'https://imageseo.cc/image-seo',
  'https://imageseo.cc/privacy',
  'https://imageseo.cc/terms',
  'https://imageseo.cc/blog/free-geo-tagger-fast-location-seo',
  'https://imageseo.cc/blog/image-file-names-local-seo',
  'https://imageseo.cc/blog/google-business-profile-photo-optimization',
  'https://imageseo.cc/blog/webp-vs-jpg-local-seo',
  'https://imageseo.cc/blog/alt-text-local-seo-formula',
  'https://imageseo.cc/blog/image-seo-checklist-local-business',
  'https://imageseo.cc/non-existent-page-test-404'
];

async function main() {
  const results = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { redirect: 'manual' });
      const text = await res.text();
      const titleMatch = text.match(/<title>([^<]*)<\/title>/i);
      const h1Match = text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const canonMatch = text.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
      const descMatch = text.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
      const title = titleMatch ? titleMatch[1].trim() : '(none)';
      const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '(none)';
      const canonical = canonMatch ? canonMatch[1] : '(none)';
      const desc = descMatch ? descMatch[1] : '(none)';
      results.push({
        url,
        status: res.status,
        contentType: res.headers.get('content-type'),
        length: text.length,
        title,
        h1,
        canonical,
        desc
      });
    } catch (e) {
      results.push({ url, error: e.message });
    }
  }
  console.log(JSON.stringify(results, null, 2));
}

main();
