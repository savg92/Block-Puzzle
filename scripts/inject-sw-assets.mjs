import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const swFile = path.resolve(distDir, 'service-worker.js');

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      walk(filePath, callback);
    } else if (stats.isFile()) {
      callback(filePath);
    }
  });
}

if (!fs.existsSync(swFile)) {
  console.error('Service worker not found in dist/service-worker.js');
  process.exit(1);
}

console.log('Scanning for assets in dist/ directory...');
const assets = [];
walk(distDir, (filePath) => {
  const relativePath = path.relative(distDir, filePath);
  // Skip service worker itself and manifest/index (already added manually or should be handled by SW)
  // But we want to include JS, CSS, and other assets
  if (
    relativePath === 'service-worker.js' ||
    relativePath === 'index.html' ||
    relativePath === 'manifest.json' ||
    relativePath === 'favicon.ico' ||
    relativePath === 'metadata.json'
  ) {
    return;
  }

  // Ensure leading slash for caching
  assets.push('/' + relativePath.replace(/\\/g, '/'));
});

console.log(`Found ${assets.length} assets to inject.`);

let swContent = fs.readFileSync(swFile, 'utf8');
const assetsString = `const BUILD_ASSETS = ${JSON.stringify(assets, null, 2)};`;

if (swContent.includes('// BUILD_ASSETS_PLACEHOLDER')) {
  swContent = swContent.replace('// BUILD_ASSETS_PLACEHOLDER', assetsString);
  fs.writeFileSync(swFile, swContent, 'utf8');
  console.log('Successfully injected assets into service-worker.js');
} else {
  console.warn('BUILD_ASSETS_PLACEHOLDER not found in service-worker.js');
}
