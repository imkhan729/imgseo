import fs from 'node:fs';
import path from 'node:path';

const sitemapContent = fs.readFileSync('sitemap.xml', 'utf8');
const locs = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

console.log(`Total sitemap URLs: ${locs.length}`);

let missingInRoot = 0;
let missingInDist = 0;

for (const url of locs) {
  const parsed = new URL(url);
  const pathname = parsed.pathname; // e.g. / or /free-webp-converter or /blog/alt-text-...
  
  // Root check
  let rootExpectedPath = pathname === '/' 
    ? path.join('.', 'index.html') 
    : path.join('.', pathname.replace(/^\//, ''), 'index.html');
  
  if (!fs.existsSync(rootExpectedPath)) {
    // Try .html directly
    rootExpectedPath = path.join('.', `${pathname.replace(/^\//, '')}.html`);
  }
  
  if (!fs.existsSync(rootExpectedPath)) {
    console.warn(`[Root Missing] ${url} -> expected ${rootExpectedPath}`);
    missingInRoot++;
  }

  // Dist check
  let distExpectedPath = pathname === '/' 
    ? path.join('artifacts', 'imgseo', 'dist', 'public', 'index.html') 
    : path.join('artifacts', 'imgseo', 'dist', 'public', pathname.replace(/^\//, ''), 'index.html');
  
  if (!fs.existsSync(distExpectedPath)) {
    distExpectedPath = path.join('artifacts', 'imgseo', 'dist', 'public', `${pathname.replace(/^\//, '')}.html`);
  }

  if (!fs.existsSync(distExpectedPath)) {
    console.warn(`[Dist Missing] ${url} -> expected ${distExpectedPath}`);
    missingInDist++;
  }
}

console.log(`\nAudit complete:`);
console.log(`Missing in Root: ${missingInRoot}`);
console.log(`Missing in Dist: ${missingInDist}`);
