# Olympia Toast Bardya

This project is a lightweight promotional site for Toast POS services in Olympia, WA. It showcases Bardya Banihashemi's local expertise, links to useful resources, and provides contact information for businesses interested in learning more.

## Building the Site

The HTML pages are assembled by a small Node.js script located in `scripts/build.js`.
Install dependencies once and then run the build command:

```bash
npm install     # if you haven't already
npm run build
```

The compiled files are written to the `dist/` directory.

## Repository Layout

* `scripts/` – JavaScript files including the build script and site logic
* `styles/` – CSS stylesheet
* `includes/` – HTML snippets for the header and footer
* HTML pages and assets remain at the project root

## Serving the Built Files

After running the build, you can serve the site locally. A small Node script is provided:

```bash
npm run serve
```

This starts a simple HTTP server on `http://localhost:8080`. You can also use any other static file server if you prefer.

