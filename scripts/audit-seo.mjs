import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const publicDir = join(process.cwd(), 'artifacts', 'imgseo', 'dist', 'public');

function getHtmlFiles(dir) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(publicDir);
console.log(`Found ${htmlFiles.length} HTML files for SEO audit.`);

const summary = {
  total: htmlFiles.length,
  titleErrors: [],
  descErrors: [],
  h1Errors: [],
  canonicalErrors: [],
  hreflangErrors: [],
  schemaErrors: [],
  langErrors: [],
  pages: []
};

for (const file of htmlFiles) {
  const content = readFileSync(file, 'utf8');
  const relPath = relative(publicDir, file).replace(/\\/g, '/');

  // Skip 404.html from standard indexing audits
  const is404 = relPath === '404.html';

  // Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const titleLen = title.length;
  const titleOk = is404 || (titleLen >= 30 && titleLen <= 70);
  if (!titleOk) {
    summary.titleErrors.push({ file: relPath, title, len: titleLen });
  }

  // Meta description
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i);
  const desc = descMatch ? descMatch[1].trim() : '';
  const descLen = desc.length;
  const descOk = is404 || (descLen >= 90 && descLen <= 170);
  if (!descOk) {
    summary.descErrors.push({ file: relPath, desc, len: descLen });
  }

  // Canonical
  const canonMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const canonical = canonMatch ? canonMatch[1].trim() : '';
  if (!canonical) {
    summary.canonicalErrors.push({ file: relPath });
  }

  // H1
  const h1Match = content.match(/<h1[^>]*>([^<]*)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].trim() : '';
  if (!h1) {
    summary.h1Errors.push({ file: relPath });
  }

  // Hreflangs
  const hreflangs = (content.match(/<link\s+rel=["']alternate["']\s+hreflang=/gi) || []).length;
  if (!is404 && hreflangs !== 7) { // 6 languages + 1 x-default = 7
    summary.hreflangErrors.push({ file: relPath, count: hreflangs });
  }

  // Schema
  const hasSchema = content.includes('application/ld+json');
  if (!is404 && !hasSchema) {
    summary.schemaErrors.push({ file: relPath });
  }

  // Lang & Dir
  const langMatch = content.match(/<html[^>]+lang=["']([^"']*)["']/i);
  const lang = langMatch ? langMatch[1] : '';
  const dirMatch = content.match(/<html[^>]+dir=["']([^"']*)["']/i);
  const dir = dirMatch ? dirMatch[1] : '';
  if (!lang || !dir) {
    summary.langErrors.push({ file: relPath, lang, dir });
  }

  summary.pages.push({
    file: relPath,
    title,
    titleLen,
    desc,
    descLen,
    canonical,
    h1,
    hreflangs,
    hasSchema,
    lang,
    dir
  });
}

console.log('=== SEO AUDIT SUMMARY ===');
console.log(`Total Pages: ${summary.total}`);
console.log(`Title Length Issues (Target 30-70 chars): ${summary.titleErrors.length}`);
if (summary.titleErrors.length > 0) console.log(JSON.stringify(summary.titleErrors, null, 2));

console.log(`Description Length Issues (Target 90-170 chars): ${summary.descErrors.length}`);
if (summary.descErrors.length > 0) console.log(JSON.stringify(summary.descErrors, null, 2));

console.log(`Missing H1s: ${summary.h1Errors.length}`);
if (summary.h1Errors.length > 0) console.log(JSON.stringify(summary.h1Errors, null, 2));

console.log(`Missing Canonicals: ${summary.canonicalErrors.length}`);
if (summary.canonicalErrors.length > 0) console.log(JSON.stringify(summary.canonicalErrors, null, 2));

console.log(`Hreflang Issues (Expected 7 cluster links): ${summary.hreflangErrors.length}`);
if (summary.hreflangErrors.length > 0) console.log(JSON.stringify(summary.hreflangErrors, null, 2));

console.log(`Missing Schema.org JSON-LD: ${summary.schemaErrors.length}`);
if (summary.schemaErrors.length > 0) console.log(JSON.stringify(summary.schemaErrors, null, 2));

console.log(`Missing Lang/Dir attributes: ${summary.langErrors.length}`);
if (summary.langErrors.length > 0) console.log(JSON.stringify(summary.langErrors, null, 2));
