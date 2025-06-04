import express from 'express';
import compression from 'compression';
import path from 'path';

const app = express();
const distDir = path.join(__dirname, '..', 'dist');

// Enable gzip compression for all responses
app.use(compression());

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

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`Serving on http://localhost:${port}`);
});
