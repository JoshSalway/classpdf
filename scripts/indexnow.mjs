#!/usr/bin/env node
// Submit the live sitemap's URLs to IndexNow (Bing, Yandex, Seznam, Naver).
// The key file public/<KEY>.txt must be deployed so IndexNow can verify ownership.
// Usage: node scripts/indexnow.mjs
const HOST = 'classpdf.com';
const KEY = '4bbc4be617d1a2f72a14354ba8778b0a';

const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error('no URLs found in sitemap');

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});
console.log(
  `IndexNow: HTTP ${res.status} — submitted ${urlList.length} URLs (200/202 = accepted)`
);
