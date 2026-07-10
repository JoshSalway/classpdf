#!/usr/bin/env node
// Injects the Google Analytics (GA4) scaffold into every built HTML page.
//
// TO ENABLE ANALYTICS: set the GA_MEASUREMENT_ID env var to your GA4
// Measurement ID at build time, e.g.
//   GA_MEASUREMENT_ID=G-ABC1234567 npm run build
// (or hardcode the DEFAULT_ID constant below). Until a real "G-" id is set,
// the injected snippet is a no-op and loads nothing.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(repoRoot, 'dist');

// One obvious place for Josh to paste his GA4 Measurement ID.
const DEFAULT_ID = 'G-KCJP827K0J';
const GA_ID = process.env.GA_MEASUREMENT_ID || DEFAULT_ID;

const MARKER = 'window.GA_MEASUREMENT_ID';

function snippet(id) {
  return `<!-- Google Analytics (GA4) - see scripts/inject-analytics.mjs -->
<script>
  window.GA_MEASUREMENT_ID = ${JSON.stringify(id)};
  (function () {
    var gid = window.GA_MEASUREMENT_ID;
    if (!gid || gid.indexOf('G-XXXX') === 0) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + gid;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', gid);
  })();
</script>
</head>`;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

let injected = 0;
let skipped = 0;
for (const file of walk(distDir)) {
  const html = readFileSync(file, 'utf8');
  if (html.includes(MARKER)) {
    skipped++;
    continue;
  }
  if (!html.includes('</head>')) {
    skipped++;
    continue;
  }
  writeFileSync(file, html.replace('</head>', snippet(GA_ID)), 'utf8');
  injected++;
}

const state = GA_ID.startsWith('G-XXXX') ? 'placeholder (no-op)' : GA_ID;
console.log(
  `[analytics] GA id: ${state} - injected ${injected}, already present ${skipped}`
);
