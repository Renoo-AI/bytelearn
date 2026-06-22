const fs = require('fs');
const path = require('path');
const urls = new Set();
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
        walk(p);
    } else if (p.endsWith('.html')) {
        const content = fs.readFileSync(p, 'utf8');
        const matches = content.match(/https:\/\/dropshare\.42web\.io\/1\/files\/[a-zA-Z0-9_-]+\.png/g);
        if (matches) {
            matches.forEach(m => urls.add(m));
        }
    }
  }
}
walk('c:/Users/Youssef/Downloads/bytelab/levels');
console.log(Array.from(urls).join('\n'));
