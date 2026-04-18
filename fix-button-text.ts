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

    // Fix the "dark:text-hu-charcoal" which makes text dark on transparent background
    content = content.replace(/hover:bg-brand-primary hover:text-white dark:text-hu-charcoal dark:hover:text-brand-text/g, 'hover:bg-brand-primary hover:text-white dark:hover:text-hu-charcoal');
    
    // Also check group-hover variants
    content = content.replace(/group-hover:bg-brand-primary group-hover:text-white dark:text-hu-charcoal dark:group-hover:text-brand-text/g, 'group-hover:bg-brand-primary group-hover:text-white dark:hover:text-hu-charcoal');

    // Handle generic cases where bg-brand-primary/10 has dark:text-hu-charcoal
    content = content.replace(/bg-brand-primary\/10(.*?)dark:text-hu-charcoal/g, 'bg-brand-primary/10$1');

    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`Updated button text classes in ${filepath}`);
    }
  }
});
