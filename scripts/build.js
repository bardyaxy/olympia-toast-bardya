const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');
const includesDir = path.join(rootDir, 'includes');

// clean output
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(assetsDir, { recursive: true });

// run webpack to build js/css and process asset modules
execSync('npx webpack --config webpack.config.js', { stdio: 'inherit' });

// map generated js/css files
const assetFiles = fs.readdirSync(assetsDir);
const cssFile = assetFiles.find(f => f.endsWith('.css'));
const jsFile = assetFiles.find(f => f.endsWith('.js'));

// fingerprint static images/icons
const assetMap = {};
const imageRegex = /\.(png|jpe?g|svg|ico)$/i;
fs.readdirSync(rootDir).forEach(file => {
  if (imageRegex.test(file)) {
    const content = fs.readFileSync(path.join(rootDir, file));
    const hash = crypto.createHash('md5').update(content).digest('hex').slice(0,8);
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const hashedName = `${base}.${hash}${ext}`;
    fs.writeFileSync(path.join(assetsDir, hashedName), content);
    assetMap[file] = `assets/${hashedName}`;
  }
});

// copy and update webmanifest
const manifestSrc = path.join(rootDir, 'site.webmanifest');
if (fs.existsSync(manifestSrc)) {
  let manifest = fs.readFileSync(manifestSrc, 'utf8');
  Object.entries(assetMap).forEach(([orig, hashed]) => {
    manifest = manifest.replace(new RegExp(orig, 'g'), hashed);
  });
  fs.writeFileSync(path.join(distDir, 'site.webmanifest'), manifest);
}

// copy CNAME if present
const cnameSrc = path.join(rootDir, 'CNAME');
if (fs.existsSync(cnameSrc)) {
  fs.copyFileSync(cnameSrc, path.join(distDir, 'CNAME'));
}

const header = fs.readFileSync(path.join(includesDir, 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(includesDir, 'footer.html'), 'utf8');

const pages = ['index.html', 'about.html', 'resources.html'];

pages.forEach(page => {
  const filePath = path.join(rootDir, page);
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace('<!--#include file="includes/header.html" -->', header);
  html = html.replace('<!--#include file="includes/footer.html" -->', footer);
  html = html.replace(/styles\/style\.css/g, `assets/${cssFile}`);
  html = html.replace(/scripts\/app\.js/g, `assets/${jsFile}`);
  Object.entries(assetMap).forEach(([orig, hashed]) => {
    html = html.replace(new RegExp(orig, 'g'), hashed);
  });
  const destPath = path.join(distDir, page);
  fs.writeFileSync(destPath, html);
  console.log(`Built ${destPath}`);
});
