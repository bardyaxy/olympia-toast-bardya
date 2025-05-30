# Olympia Toast Bardya

A small single-page website promoting Toast POS services in Olympia, WA. It includes information about Bardya Banihashemi, helpful resources, and contact options.

## Running Locally

You can launch a simple development server using Python:

```bash
python3 -m http.server
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.


## Building

This project uses small HTML includes for the shared header and footer. The build script resolves the includes and writes the resulting HTML files to a `dist/` directory. To build the site run:

```bash
npm run build
```

The command generates `dist/index.html`, `dist/about.html`, and `dist/resources.html` with the contents of the partials from `includes/`.
