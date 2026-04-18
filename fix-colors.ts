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

    // Fix invisible text (text-black to text-brand-text)
    content = content.replace(/text-black/g, 'text-brand-text');

    // Fix remaining green colors to use the semantic primary variable
    content = content.replace(/text-hu-green(-[a-z]+)?/g, 'text-brand-primary$1');
    content = content.replace(/bg-hu-green(-[a-z]+)?/g, 'bg-brand-primary$1');
    content = content.replace(/border-hu-green(-[a-z]+)?/g, 'border-brand-primary$1');
    content = content.replace(/ring-hu-green(-[a-z]+)?/g, 'ring-brand-primary$1');
    content = content.replace(/shadow-hu-green(-[a-z]+)?/g, 'shadow-brand-primary$1');

    // Remove duplicates if any were already done
    content = content.replace(/text-white dark:text-hu-charcoal/g, 'text-white');
    content = content.replace(/text-white/g, 'text-white dark:text-hu-charcoal');
    content = content.replace(/text-white dark:text-hu-charcoal dark:text-hu-charcoal/g, 'text-white dark:text-hu-charcoal');

    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`Updated colors in ${filepath}`);
    }
  }
});
