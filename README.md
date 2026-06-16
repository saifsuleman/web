# Resume Site

Single-source resume website + PDF generation using Astro, React, TypeScript, Zod, YAML, and Playwright.

## Commands

- `npm run validate:resume` validates `content/resume.yml` using Zod.
- `npm run build` builds the static website.
- `npm run generate:pdf` starts preview and generates `resume.pdf` from `/resume`.
- `RESUME_PAPER_SIZE=Letter npm run generate:pdf` generates a US Letter PDF.
- `npm run build:resume` runs validate + build + PDF generation.
