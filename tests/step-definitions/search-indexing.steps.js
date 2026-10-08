// Step definitions for search_indexing.feature
// Reads dist/sitemap.xml and dist/robots.txt straight from the build output.
// "the built site is inspected" is defined in ci-cd.steps.js and fills
// this.distFiles.

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

const ORIGIN = 'https://healthflare.org';

function sitemap() {
  const xml = readFileSync('dist/sitemap.xml', 'utf8');
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: (m[1].match(/<loc>([^<]+)<\/loc>/) || [])[1],
    lastmod: (m[1].match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1],
  }));
  return { xml, entries };
}

// Map a built HTML file to the public URL it is served at. Hand-authored
// pages like privacy.html are linked and canonicalised without the
// extension (GitHub Pages serves both).
function urlFor(file) {
  let path = file.replace(/^dist/, '');
  if (path.endsWith('/index.html')) path = path.slice(0, -'index.html'.length);
  else path = path.replace(/\.html$/, '');
  return ORIGIN + path;
}

// Map a sitemap URL back to the file that serves it.
function fileFor(url) {
  const path = url.slice(ORIGIN.length);
  if (path.endsWith('/')) return join('dist', path, 'index.html');
  return join('dist', `${path}.html`);
}

function publicHtml(files) {
  return files.filter((f) => f.endsWith('.html') && f !== 'dist/404.html');
}

Then('a sitemap.xml file exists at the root of the build output', function () {
  expect(existsSync('dist/sitemap.xml')).toBe(true);
});

Then('the sitemap is a valid sitemaps.org urlset', function () {
  const { xml, entries } = sitemap();
  expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  expect(xml).toMatch(/<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
  expect(entries.length).toBeGreaterThan(0);
  for (const e of entries) expect(e.loc, 'every <url> needs a <loc>').toBeTruthy();
  const locs = entries.map((e) => e.loc);
  expect(new Set(locs).size, 'duplicate <loc> entries').toBe(locs.length);
});

Then('every public HTML page in the build output is listed in the sitemap', function () {
  const listed = new Set(sitemap().entries.map((e) => e.loc));
  const missing = publicHtml(this.distFiles).map(urlFor).filter((u) => !listed.has(u));
  expect(missing, `Pages missing from sitemap:\n${missing.join('\n')}`).toHaveLength(0);
});

Then('the 404 page is not listed in the sitemap', function () {
  const locs = sitemap().entries.map((e) => e.loc);
  expect(locs.filter((u) => /\/404(\.html)?$/.test(u))).toHaveLength(0);
});

Then('every sitemap URL is an absolute https:\\/\\/healthflare.org URL', function () {
  const bad = sitemap().entries.map((e) => e.loc).filter((u) => !u.startsWith(`${ORIGIN}/`));
  expect(bad, `Non-canonical sitemap URLs:\n${bad.join('\n')}`).toHaveLength(0);
});

Then('every sitemap URL resolves to a page in the build output', function () {
  const missing = sitemap().entries.map((e) => e.loc).filter((u) => !existsSync(fileFor(u)));
  expect(missing, `Sitemap URLs with no built page:\n${missing.join('\n')}`).toHaveLength(0);
});

Then('every blog post in the sitemap has a lastmod date matching its front matter', function () {
  const byLoc = new Map(sitemap().entries.map((e) => [e.loc, e.lastmod]));
  const dirs = [
    ['src/blog/posts', '/blog/'],
    ['src/inner-flare/blog/posts', '/inner-flare/blog/'],
  ];
  const wrong = [];
  let checked = 0;
  for (const [dir, prefix] of dirs) {
    for (const name of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
      const src = readFileSync(join(dir, name), 'utf8');
      const date = (src.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m) || [])[1];
      const loc = `${ORIGIN}${prefix}${name.replace(/\.md$/, '')}/`;
      checked += 1;
      if (byLoc.get(loc) !== date) wrong.push(`${loc}: expected ${date}, got ${byLoc.get(loc)}`);
    }
  }
  expect(checked).toBeGreaterThan(0);
  expect(wrong, wrong.join('\n')).toHaveLength(0);
});

Then('a robots.txt file exists at the root of the build output', function () {
  expect(existsSync('dist/robots.txt')).toBe(true);
});

Then('robots.txt allows crawling and names https:\\/\\/healthflare.org\\/sitemap.xml', function () {
  const robots = readFileSync('dist/robots.txt', 'utf8');
  expect(robots).toMatch(/^User-agent:\s*\*$/m);
  expect(robots).not.toMatch(/^Disallow:\s*\/\s*$/m);
  expect(robots).toMatch(/^Sitemap:\s*https:\/\/healthflare\.org\/sitemap\.xml\s*$/m);
});
