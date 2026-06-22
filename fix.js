const fs = require('fs');
const path = require('path');
const https = require('https');

const assetsDir = 'c:/Users/Youssef/Downloads/bytelab/assets/';
const levelsDir = 'c:/Users/Youssef/Downloads/bytelab/levels/';

const downloads = {
  'deepseek.png': 'https://dropshare.42web.io/1/files/vnF2qOpX5W.png',
  'uber.png': 'https://dropshare.42web.io/1/files/5wbUhMdXit.png',
  'spacex.png': 'https://dropshare.42web.io/1/files/TY2MB5OLjz.png',
  'airbnb.png': 'https://dropshare.42web.io/1/files/NUZcxl2Mkq.png',
  'amazon.png': 'https://dropshare.42web.io/1/files/RsnAFCOqMe.png',
  'netflix.png': 'https://dropshare.42web.io/1/files/Vomath8qW9.png',
  'paypal.png': 'https://dropshare.42web.io/1/files/dlFOJf8KTG.png',
  'byte-happy.png': 'https://dropshare.42web.io/1/files/vYpn87OAaM.png',
  'byte-detective.png': 'https://dropshare.42web.io/1/files/JCodP2ISAz.png',
  'byte-ninja.png': 'https://dropshare.42web.io/1/files/U5wACMdT3j.png',
  'byte-hacker.png': 'https://dropshare.42web.io/1/files/XlojkWFJx7.png'
};

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
         // handle redirect
         https.get(res.headers.location, (res2) => {
             const fileStream = fs.createWriteStream(filename);
             res2.pipe(fileStream);
             fileStream.on('finish', () => { fileStream.close(); resolve(); });
         }).on('error', reject);
      } else {
         const fileStream = fs.createWriteStream(filename);
         res.pipe(fileStream);
         fileStream.on('finish', () => { fileStream.close(); resolve(); });
      }
    }).on('error', reject);
  });
}

async function fixLevels() {
  console.log('Downloading images...');
  for (const [name, url] of Object.entries(downloads)) {
    const dest = path.join(assetsDir, name);
    try {
      await downloadImage(url, dest);
      console.log('Downloaded', name);
    } catch (e) {
      console.error('Failed to download', name, e);
    }
  }

  console.log('Patching HTML files...');
  function walk(dir) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      if (fs.statSync(p).isDirectory()) {
        walk(p);
      } else if (p.endsWith('.html')) {
        let content = fs.readFileSync(p, 'utf8');
        let companyMatch = content.match(/<span[^>]*class="font-extrabold text-2xl tracking-tighter"[^>]*>([^<]+)<\/span>/i);
        let company = 'logo';
        if (companyMatch) {
            company = companyMatch[1].toLowerCase().replace(/\s+/g, '-');
            if (company.includes('paypal')) company = 'paypal';
            if (company.includes('netflix')) company = 'netflix';
            if (company.includes('amazon')) company = 'amazon';
            if (company.includes('spacex')) company = 'spacex';
            if (company.includes('airbnb')) company = 'airbnb';
            if (company.includes('uber')) company = 'uber';
            if (company.includes('deepseek')) company = 'deepseek';
            if (company.includes('google')) company = 'google-logo';
            if (company.includes('facebook')) company = 'facebook-logo';
        }

        // Generic replacements
        content = content.replace(/https:\/\/dropshare\.42web\.io\/1\/files\/zVYAUZDpex\.png/g, '../../../assets/byte-hello.png');
        content = content.replace(/https:\/\/dropshare\.42web\.io\/1\/files\/n3cWyiNBjO\.png/g, '../../../assets/byte-hello.png');
        content = content.replace(/https:\/\/dropshare\.42web\.io\/1\/files\/OStYxaWILh\.png/g, '../../../assets/byte-pc.png');
        content = content.replace(/https:\/\/dropshare\.42web\.io\/1\/files\/UIi3dXms4F\.png/g, `../../../assets/${company}.png`);
        
        // Also if they used local logo.png for specific companies
        if (company !== 'logo') {
            content = content.replace(/href="\.\.\/\.\.\/\.\.\/assets\/logo\.png"/g, `href="../../../assets/${company}.png"`);
            content = content.replace(/src="\.\.\/\.\.\/\.\.\/assets\/logo\.png" class="app-logo"/g, `src="../../../assets/${company}.png" class="app-logo"`);
        }
        
        fs.writeFileSync(p, content, 'utf8');
      }
    }
  }
  
  walk(levelsDir);
  console.log('Finished fixing levels.');
}

fixLevels();
