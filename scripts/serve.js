const express = require('express');
const path = require('path');

const app = express();
const distDir = path.join(__dirname, '..', 'dist');

// Cache headers: HTML revalidated, assets long lived
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || req.path === '/') {
    res.set('Cache-Control', 'no-cache, must-revalidate');
  }
  next();
});

app.use(
  express.static(distDir, {
    setHeaders: (res, filePath) => {
      if (!filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    },
  }),
);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Serving on http://localhost:${port}`);
});
