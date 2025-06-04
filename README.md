# Olympia BCB Bardya

This project is a lightweight promotional site showcasing Bardya Banihashemi's local expertise, links to useful resources, and provides contact information for businesses interested in learning more.

## Prerequisites

The build scripts assume **Node.js 18 or newer**. Install a current LTS release from [nodejs.org](https://nodejs.org/) if you don't already have it available.

## Building the Site

The HTML pages are assembled by a small TypeScript script located in `scripts/build.ts`.
Templates use [EJS](https://ejs.co/) so common elements like the header and footer
are included from the `includes/` directory.
Install dependencies once and then run the build command:

```bash
npm install     # if you haven't already
npm run build
```

### Configuration

Certain values like external URLs and analytics IDs are pulled from environment variables at build time. Create a `.env` file (see `.env.example`) with any overrides:

```bash
# .env
CHILIPIPER_LINK=https://BCB.chilipiper.com/personal/bardya-banihashemi
GA_MEASUREMENT_ID=GA-XXXXXXXXX
```

These variables will be embedded into the bundled JavaScript and HTML so they can be changed without modifying the source code.

The compiled files are written to the `dist/` directory.

### Building with Eleventy

If you prefer to use [Eleventy](https://www.11ty.dev/) for templating and routing,
you can run:

```bash
npm run build:eleventy
```

This command processes the same EJS templates and writes the output to `dist/` using Eleventy.

During development you can use a basic watch mode to rebuild whenever files
change:

```bash
npm run watch
```

This script monitors source HTML, CSS and TypeScript files and re-runs the build
each time one of them updates.

## Repository Layout

 - `scripts/` – TypeScript files including the build script and site logic
- `styles/` – CSS stylesheet
- `includes/` – HTML snippets for the header and footer
- HTML pages remain at the project root
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

## Deploying to Netlify

A simple `netlify.toml` file is included so Netlify will build the project with `npm run build` and publish the generated `dist/` directory. Make sure your site settings use this repository and the default build command to ensure the EJS templates are compiled correctly. Without this step your deployed pages will still contain the raw `<%- include %>` tags and appear blank.

