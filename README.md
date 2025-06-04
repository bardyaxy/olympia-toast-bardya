# Olympia Toast Bardya

This project is a lightweight promotional site for Toast POS services in Olympia, WA. It showcases Bardya Banihashemi's local expertise, links to useful resources, and provides contact information for businesses interested in learning more.

## Prerequisites

The build scripts assume **Node.js 18 or newer**. Install a current LTS release from [nodejs.org](https://nodejs.org/) if you don't already have it available.

## Building the Site

The HTML pages are generated from templates using a small Node.js script located
in `scripts/build.js`. Templates use [EJS](https://ejs.co/) so common elements
like the header and footer are included from the `includes/` directory. Source
templates live in the `src/` folder and running the build will render them to
plain HTML at the project root and under `dist/`.
Install dependencies once and then run the build command:

```bash
npm install     # if you haven't already
npm run build
```

The compiled files are written to the `dist/` directory.

During development you can use a basic watch mode to rebuild whenever files
change:

```bash
npm run watch
```

This script monitors source HTML, CSS and JavaScript files and re-runs the build
each time one of them updates.

## Repository Layout

- `scripts/` – JavaScript files including the build script and site logic
- `src/` – page templates written in EJS
- `styles/` – CSS stylesheet
- `includes/` – HTML snippets for the header and footer
- HTML pages at the project root – compiled output
- `img/` – image assets like logos and icons

## Serving the Built Files

After running the build, you can serve the site locally. A small Node script is provided:

```bash
npm run serve
```

The command serves the contents of the `dist/` directory on `http://localhost:8080`.
Open that URL in a browser to view the generated site. You can also use any other static file server if you prefer.

## Caching and Fingerprinting

The site now fingerprints all CSS, JS and image assets during the build. Each file name includes a content hash so browsers can cache them indefinitely. HTML files are built with the correct hashed references and are served with headers that force revalidation on every request.

Run `npm run serve` to start an Express server that applies these headers:

- `Cache-Control: no-cache, must-revalidate` for HTML
- `Cache-Control: public, max-age=31536000, immutable` for static assets

## SEO and Indexing

The repository includes `robots.txt` and `sitemap.xml` at the project root.
They are copied to the `dist/` directory during the build so search engines can
discover all pages of the site.
