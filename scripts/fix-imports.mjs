import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

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

function fixImports(directory, pattern) {
  const fullDir = path.resolve(rootDir, directory);
  if (!fs.existsSync(fullDir)) {
    console.warn(`Directory not found: ${fullDir}`);
    return;
  }

  console.log(`Checking ${directory} for files matching ${pattern}...`);
  
  walk(fullDir, (filePath) => {
    if (pattern.test(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('import.meta')) {
        console.log(`Fixing import.meta in ${path.relative(rootDir, filePath)}`);
        const fixedContent = content.replace(/import\.meta/g, '({})');
        fs.writeFileSync(filePath, fixedContent, 'utf8');
      }
    }
  });
}

// Fix zustand in node_modules
fixImports('node_modules/zustand', /\.mjs$/);

// Fix web bundle if it exists
fixImports('dist/_expo/static/js/web', /\.js$/);
