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

    content = content.replace(/text-gray-black\/70/g, 'text-brand-muted');
    content = content.replace(/bg-hu-cream\/20/g, 'bg-brand-surface');
    content = content.replace(/divide-gray-[0-9]{2,3}/g, 'divide-brand-border');
    content = content.replace(/bg-gray-50(\/50)?/g, 'bg-brand-bg');
    content = content.replace(/text-hu-charcoal/g, 'text-brand-text');
    
    // except we just changed dark:text-hu-charcoal to dark:text-brand-text -- oh no. 
    // Let's refine the text-hu-charcoal replacement.
    content = content.replace(/dark:text-brand-text/g, 'dark:text-hu-charcoal'); // reverse it for buttons
    
    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`Updated table/grey instances in ${filepath}`);
    }
  }
});
