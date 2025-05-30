const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};
const distDir = path.join(__dirname, '..', 'dist');
const server = http.createServer((req, res) => {
  let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
    res.end(data);
  });
});
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Serving on http://localhost:${port}`);
});

