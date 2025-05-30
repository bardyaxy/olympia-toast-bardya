const fs = require('fs');
const path = require('path');

const includesDir = path.join(__dirname, 'includes');
const header = fs.readFileSync(path.join(includesDir, 'header.html'), 'utf8');
const footer = fs.readFileSync(path.join(includesDir, 'footer.html'), 'utf8');

const pages = ['index.html', 'about.html', 'resources.html'];

pages.forEach(page => {
  const filePath = path.join(__dirname, page);
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace('<!--#include file="includes/header.html" -->', header);
  html = html.replace('<!--#include file="includes/footer.html" -->', footer);
  fs.writeFileSync(filePath, html);
  console.log(`Built ${page}`);
});
