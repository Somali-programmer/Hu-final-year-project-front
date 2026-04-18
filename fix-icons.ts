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

    // Standardize all hardcoded multi-colored icon backgrounds to brand-primary
    content = content.replace(/color:\s*'(text-[a-z]+-[0-9]{3})',\s*bg:\s*'bg-[a-z]+-[0-9]{2,3}'/g, "color: 'text-brand-primary', bg: 'bg-brand-primary/10'");
    content = content.replace(/color:\s*'(text-[a-z]+-500)',\s*bg:\s*'bg-[a-z]+-50'/g, "color: 'text-brand-primary', bg: 'bg-brand-primary/10'");

    // Specifically for dark mode visibility of table text which might still be text-gray-900 or similar
    content = content.replace(/text-gray-900/g, 'text-brand-text');
    content = content.replace(/text-gray-800/g, 'text-brand-text');

    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`Updated icons in ${filepath}`);
    }
  }
});
