# PUFF PUFF PASS — Report Site

Static client-facing progress dashboard for the PUFF PUFF PASS ecommerce build.

**Live:** https://mediumaquamarine-fish-133779.hostingersite.com/

## Structure

Pure static HTML/CSS/JS — no build step.

```
.
├── index.html              homepage (progress ring + project overview)
├── assets/style.css        single global stylesheet
├── screenshots/*.png       in-page imagery
├── contact/                contact page
├── development/            dev progress (admin, backend, catalogue, frontend)
├── ecommerce/              storefront features (payments, products)
├── project/                project meta (goals, scope, timeline)
├── roadmap/                roadmap
└── technology/             stack (architecture, performance, security)
```

Every folder uses `index.html` so URLs are clean (`/development/admin/`).

## Local preview

Any static server works:

```bash
npx serve .
# or
python -m http.server 8000
```

## Deploy

Pushes to `main` auto-deploy to Hostinger via the workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Manual deploy: zip the repo root contents and drop them into `public_html/` via Hostinger File Manager.
