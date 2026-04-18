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
    // Remove border-none only if it comes after hu-card or hu-card-alt
    content = content.replace(/(hu-card(?:-alt)?(?:\s+[A-Za-z0-9/:-]+)*)\s+border-none/g, '$1');
    content = content.replace(/(hu-card(?:-alt)?(?:\s+[A-Za-z0-9/:-]+)*)\s+border-transparent/g, '$1');
    
    // Sometimes border-none is before it: 
    // content = content.replace(/border-none\s+(hu-card(?:-alt)?)/g, '$1');
    
    if (content !== original) {
      fs.writeFileSync(filepath, content, 'utf8');
      console.log(`Updated ${filepath}`);
    }
  }
});
