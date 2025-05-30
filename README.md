# Olympia Toast Bardya

This project is a lightweight promotional site for Toast POS services in Olympia, WA. It showcases Bardya Banihashemi's local expertise, links to useful resources, and provides contact information for businesses interested in learning more.

## Building the Site

The HTML pages are assembled by a small Node.js script. Install dependencies once and then run the build command:

```bash
npm install     # if you haven't already
npm run build
```

The compiled files are written to the `dist/` directory.

## Serving the Built Files

After running the build, you can serve the site locally with Python or any other static file server:

```bash
python3 -m http.server
```

Open `http://localhost:8000` in your browser to view the site.
