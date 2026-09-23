import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const JSZip = require('../artifacts/imgseo/node_modules/jszip');


const distPublicDir = path.resolve('artifacts/imgseo/dist/public');
const targetZip = path.resolve('artifacts/imgseo/imgseo-hostinger-build.zip');

async function createZip() {
  const zip = new JSZip();

  function addDirToZip(currentDir, relativePath = '') {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      const fullPath = path.join(currentDir, file);
      const entryRelPath = relativePath ? `${relativePath}/${file}` : file;
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        addDirToZip(fullPath, entryRelPath);
      } else {
        const content = fs.readFileSync(fullPath);
        zip.file(entryRelPath, content);
      }
    }
  }

  console.log(`Zipping contents of ${distPublicDir}...`);
  addDirToZip(distPublicDir);

  const content = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  fs.writeFileSync(targetZip, content);
  console.log(`Successfully created ${targetZip} (${(content.length / 1024).toFixed(2)} KB)`);
}

createZip();
