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
  if (filepath.endsWith('.tsx')) {
    let content = fs.readFileSync(filepath, 'utf8');
    const original = content;
    
    // Remote hardcoded border-gray-x on cards if they are present
    content = content.replace(/(hu-card(?:-alt)?(?:\s+[A-Za-z0-9/:-]+)*)\s+border-gray-100/g, '$1');
    content = content.replace(/(hu-card(?:-alt)?(?:\s+[A-Za-z0-9/:-]+)*)\s+border-dashed/g, '$1 border-dashed'); // wait border-dashed is fine, but maybe border-gray-100 is not
    content = content.replace(/border-gray-[0-9]{2,3}/g, 'border-brand-border');
    
    // Remove shadow hardcodes on cards
    content = content.replace(/shadow-hu-green\/[0-9]+/g, 'shadow-brand-primary/20');
    
    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`Updated borders and shadows in ${filepath}`);
    }
  }
});
