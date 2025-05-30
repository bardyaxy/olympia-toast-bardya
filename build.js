const fs = require('fs');
const path = require('path');

const includesDir = path.join(__dirname, 'includes');
const header = fs.readFileSync(path.join(includesDir, 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(includesDir, 'footer.html'), 'utf8');

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

const pages = ['index.html', 'about.html', 'resources.html'];

pages.forEach(page => {
  const filePath = path.join(__dirname, page);
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace('<!--#include file="includes/header.html" -->', header);
  html = html.replace('<!--#include file="includes/footer.html" -->', footer);
  const destPath = path.join(distDir, page);
  fs.writeFileSync(destPath, html);
  console.log(`Built ${destPath}`);
});