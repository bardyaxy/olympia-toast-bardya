# Olympia Toast Bardya

A small single-page website promoting Toast POS services in Olympia, WA. It includes information about Bardya Banihashemi, helpful resources, and contact options.

## Running Locally

You can launch a simple development server using Python:

```bash
python3 -m http.server
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.


## Building

This project uses small HTML includes for the shared header and footer. To merge the includes into each page run:

```bash
npm run build
```

The command updates `index.html`, `about.html`, and `resources.html` with the contents of the partials in `includes/`.
