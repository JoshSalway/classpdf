# Source code (AGPL-3.0)

ClassPDF is a rebranded distribution of
[BentoPDF](https://github.com/alam00000/bentopdf), licensed under the
**GNU Affero General Public License v3.0** (see [LICENSE](./LICENSE)).

Under AGPL-3.0 §13, anyone interacting with this software over a network is
entitled to receive the **Corresponding Source** of the exact version running
on the site. That source is made available in two ways:

1. **Download it directly from the running site**: the footer of every page
   links to `/source.zip`, a snapshot of the exact source used to build the
   deployed site (excluding build artifacts and `node_modules`, which are
   reproducible via `npm ci`).

2. **Request it**: email the operator (see the site's Contact page) and the
   Corresponding Source for the deployed version will be provided.

## Building from source

```bash
npm ci
export VITE_BRAND_NAME="ClassPDF"
export VITE_FOOTER_TEXT="© 2026 ClassPDF. Free, private, browser-based PDF tools."
export SITE_URL="https://classpdf.com"
npm run build        # static site output in dist/
```

## Attribution

Upstream project: BentoPDF by alam00000 and contributors
(https://github.com/alam00000/bentopdf), AGPL-3.0. This distribution keeps the
LICENSE and upstream attribution intact.
