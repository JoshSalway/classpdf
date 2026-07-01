# ClassPDF - build & deploy

ClassPDF is a rebranded distribution of
[BentoPDF](https://github.com/alam00000/bentopdf) (AGPL-3.0), kept in a
**private** repo. It is a 100% client-side PDF toolkit - no server, no uploads,
no tracking of file contents. Upstream LICENSE and attribution are kept intact.

## AGPL-3.0 compliance (private repo)

A private repo alone does NOT satisfy AGPL-3.0 §13, which requires that users of
the deployed network app can obtain the Corresponding Source. So the deployed
site ships a **`/source.zip`** archive of the exact built source, linked from the
footer ("Download source code") of every page, plus `SOURCE.md`. When
redeploying, always regenerate `dist/source.zip` (see the deploy steps below) so
it matches the running version.

## Rebrand config (build-time env vars)

The upstream project supports white-label branding via env vars, so the rebrand
is mostly config rather than code edits:

```
VITE_BRAND_NAME=ClassPDF
VITE_FOOTER_TEXT=© 2026 ClassPDF. Free, private, browser-based PDF tools.
SITE_URL=https://classpdf.com     # used by the sitemap generator
```

These are also written to `.env.production` (gitignored). Because the build's
Handlebars/`define` step reads `process.env` directly (not Vite's `.env`
loader), **export them in the shell before building**:

```bash
export VITE_BRAND_NAME="ClassPDF"
export VITE_FOOTER_TEXT="© 2026 ClassPDF. Free, private, browser-based PDF tools."
export SITE_URL="https://classpdf.com"
npm ci
npm run build     # outputs static site to dist/
```

Additional hard-coded branding (title, meta, OG/Twitter tags, canonical URL) is
in `index.html`; PWA name in `public/site.webmanifest`.

## Analytics (GA4) - one spot to enable

Analytics is scaffolded but **off by default**. To turn it on, set your GA4
Measurement ID at build time:

```bash
GA_MEASUREMENT_ID=G-ABC1234567 npm run build
```

`scripts/inject-analytics.mjs` runs as part of `npm run build` and injects a
standard gtag snippet into every built HTML page. Until a real `G-` id is set,
the snippet is a no-op and loads nothing. (You can also hardcode `DEFAULT_ID`
in that script.)

## Cross-promo

A single honest footer link points to https://sproutsheets.com ("Made by the
team behind SproutSheets, free printable worksheets for teachers.").

## Deploy to Cloudflare Pages

```bash
# 1. Build (see env exports above)
npm run build

# 2. AGPL source archive of the committed source -> served at /source.zip
git archive --format=zip -o dist/source.zip HEAD

# 3. Drop the two >25 MiB LibreOffice binaries (Pages per-file cap)
rm -f dist/libreoffice-wasm/soffice.wasm.gz dist/libreoffice-wasm/soffice.data.gz

# 4. Deploy (first time only: create the project)
env -u CLOUDFLARE_API_TOKEN npx wrangler pages project create classpdf --production-branch=main
env -u CLOUDFLARE_API_TOKEN npx wrangler pages deploy dist --project-name=classpdf --branch=main --commit-dirty=true
```

Custom domain (classpdf.com) is a zone/DNS action done in the Cloudflare
dashboard once the domain is registered.

### Known limitation: LibreOffice Office->PDF converter

`public/libreoffice-wasm/soffice.wasm.gz` (47 MiB) and `soffice.data.gz`
(27 MiB) exceed Cloudflare Pages' 25 MiB per-file limit, so they are **excluded
from the Pages deploy**. Every other tool (merge, split, compress, image<->PDF,
etc.) works; only the LibreOffice-backed Office-document conversion tool will
fail to load its engine on the hosted site.

To restore it later: host those two files somewhere without a 25 MiB cap (e.g.
an R2 bucket or another CDN) and point `src/js/utils/libreoffice-loader.ts`
(`LIBREOFFICE_LOCAL_PATH`) at that base URL. The files ship via the
`@matbee/libreoffice-converter` GitHub releases (git-LFS).
