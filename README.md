# ClassPDF

Free, private, in-browser PDF tools for teachers — merge, split, compress and
convert PDFs. Everything runs client-side, so your files never leave your
device.

Live: https://classpdf.com

## Run locally

```bash
npm install
npm run dev        # local dev server
npm run build      # static production build -> dist/
```

The rebrand (name, footer, sitemap URL) is driven by env vars at build time:

```bash
export VITE_BRAND_NAME="ClassPDF"
export VITE_FOOTER_TEXT="© 2026 ClassPDF. Free, private, browser-based PDF tools."
export SITE_URL="https://classpdf.com"
npm run build
```

## Deploy

Static output in `dist/` deploys to Cloudflare Pages. See [DEPLOY.md](DEPLOY.md)
for the full runbook.

## Built on BentoPDF

ClassPDF is a rebranded distribution of
[BentoPDF](https://github.com/alam00000/bentopdf).

License: **AGPL-3.0** (see [LICENSE](LICENSE)). Upstream copyright and
attribution are preserved; see the site's Attribution page.
