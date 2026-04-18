import fs from 'fs';
import path from 'path';

function walkDir(dir: string, callback: (filepath: string) => void) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

walkDir('./src', (filepath) => {
  if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
    let content = fs.readFileSync(filepath, 'utf8');
    const original = content;

    content = content.replace(/text-hu-blue/g, 'text-brand-primary');
    content = content.replace(/bg-hu-blue/g, 'bg-brand-primary');

    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`Updated blue to primary in ${filepath}`);
    }
  }
});
