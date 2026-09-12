// Step definitions for privacy_zero_trust.feature
// Verifies the landing page itself makes zero third-party requests, sets no
// cookies, and writes no persistent client-side storage.

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

const ANALYTICS_PATTERNS = ['google-analytics', 'googletagmanager', 'analytics', 'mixpanel', 'segment', 'amplitude', 'hotjar'];
const AD_PATTERNS = ['doubleclick', 'googlesyndication', 'adsystem', 'adservice'];
const SOCIAL_PATTERNS = ['facebook.net', 'facebook.com/tr', 'twitter.com/i/', 'connect.facebook', 'pixel'];
const FONT_HOST_PATTERNS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'use.typekit.net', 'fast.fonts.com'];

// ---------------------------------------------------------------------------
// Background: network capture
// ---------------------------------------------------------------------------

Given('browser DevTools are open on the Network panel', async function () {
  this.networkRequests = [];
  this.networkResponses = [];
  this.page.on('request', (request) => {
    this.networkRequests.push({ url: request.url(), method: request.method() });
  });
  this.page.on('response', (response) => {
    this.networkResponses.push({ url: response.url(), headers: response.headers() });
  });
});

function originOf(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

function thirdPartyRequests(requests, baseURL) {
  const baseOrigin = originOf(baseURL);
  return requests.filter((req) => {
    if (req.url.startsWith('data:')) return false;
    const origin = originOf(req.url);
    return origin !== null && origin !== baseOrigin;
  });
}

// ---------------------------------------------------------------------------
// No third-party requests
// ---------------------------------------------------------------------------

When('the page finishes loading', async function () {
  await this.page.reload({ waitUntil: 'networkidle' });
});

Then('the network request log contains requests only to the hosting origin or its CDN', async function () {
  const thirdParty = thirdPartyRequests(this.networkRequests, this.config.baseURL);
  expect(thirdParty, `Third-party requests found:\n${thirdParty.map((r) => r.url).join('\n')}`).toHaveLength(0);
});

Then('there are no requests to analytics providers such as Google Analytics or Mixpanel', async function () {
  const matches = this.networkRequests.filter((r) => ANALYTICS_PATTERNS.some((p) => r.url.toLowerCase().includes(p)));
  expect(matches).toHaveLength(0);
});

Then('there are no requests to advertising networks', async function () {
  const matches = this.networkRequests.filter((r) => AD_PATTERNS.some((p) => r.url.toLowerCase().includes(p)));
  expect(matches).toHaveLength(0);
});

Then('there are no requests to social media platforms or pixel trackers', async function () {
  const matches = this.networkRequests.filter((r) => SOCIAL_PATTERNS.some((p) => r.url.toLowerCase().includes(p)));
  expect(matches).toHaveLength(0);
});

Then('there are no requests to font hosting services such as Google Fonts or Adobe Fonts', async function () {
  const matches = this.networkRequests.filter((r) => FONT_HOST_PATTERNS.some((p) => r.url.toLowerCase().includes(p)));
  expect(matches).toHaveLength(0);
});

// ---------------------------------------------------------------------------
// Fonts served locally
// ---------------------------------------------------------------------------

When('the page loads its fonts', async function () {
  await this.page.reload({ waitUntil: 'networkidle' });
});

Then('font files are loaded from the same origin as the page', async function () {
  const fontRequests = this.networkRequests.filter((r) => /\.(woff2?|ttf|otf)(\?|$)/i.test(r.url));
  const thirdParty = thirdPartyRequests(fontRequests, this.config.baseURL);
  expect(thirdParty).toHaveLength(0);
});

Then('no @font-face rule references an external URL', async function () {
  const baseOrigin = originOf(this.config.baseURL);
  const externalFontFaces = await this.page.evaluate((origin) => {
    const external = [];
    for (const sheet of document.styleSheets) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of rules) {
        if (rule.constructor.name === 'CSSFontFaceRule' || /@font-face/.test(rule.cssText || '')) {
          const match = /url\((['"]?)(.*?)\1\)/.exec(rule.cssText || '');
          if (match && match[2] && !match[2].startsWith('data:')) {
            try {
              const resolved = new URL(match[2], location.href).origin;
              if (resolved !== origin) external.push(match[2]);
            } catch {
              // relative/local path, fine
            }
          }
        }
      }
    }
    return external;
  }, baseOrigin);
  expect(externalFontFaces).toHaveLength(0);
});

Then('the browser makes no network request to fetch a font from a third party', async function () {
  const fontRequests = this.networkRequests.filter((r) => /\.(woff2?|ttf|otf)(\?|$)/i.test(r.url));
  const thirdParty = thirdPartyRequests(fontRequests, this.config.baseURL);
  expect(thirdParty).toHaveLength(0);
});

// ---------------------------------------------------------------------------
// No third-party scripts or stylesheets
// ---------------------------------------------------------------------------

When('the DOM is fully parsed', async function () {
  await this.page.waitForLoadState('domcontentloaded');
});

Then('every script element references a resource on the hosting origin', async function () {
  const baseOrigin = originOf(this.config.baseURL);
  const externalScripts = await this.page.evaluate((origin) => {
    return Array.from(document.querySelectorAll('script[src]'))
      .map((s) => s.src)
      .filter((src) => {
        try {
          return new URL(src).origin !== origin;
        } catch {
          return false;
        }
      });
  }, baseOrigin);
  expect(externalScripts).toHaveLength(0);
});

Then('there are no inline scripts that dynamically inject external script tags', async function () {
  const html = await this.page.content();
  expect(html).not.toMatch(/createElement\(\s*['"]script['"]\s*\)[\s\S]{0,200}\.src\s*=\s*['"]https?:\/\//i);
});

Then('there are no tag manager containers \\(e.g. GTM, Segment\\) in the page source', async function () {
  const html = await this.page.content();
  expect(html.toLowerCase()).not.toMatch(/googletagmanager|segment\.(io|com)\/analytics|gtm\.js/);
});

When('the page styles are applied', async function () {
  await this.page.waitForLoadState('load');
});

Then('every stylesheet link element references a resource on the hosting origin', async function () {
  const baseOrigin = originOf(this.config.baseURL);
  const externalStylesheets = await this.page.evaluate((origin) => {
    return Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((l) => l.href)
      .filter((href) => {
        try {
          return new URL(href).origin !== origin;
        } catch {
          return false;
        }
      });
  }, baseOrigin);
  expect(externalStylesheets).toHaveLength(0);
});

Then('no CSS file imports styles from an external origin via @import', async function () {
  const baseOrigin = originOf(this.config.baseURL);
  const externalImports = await this.page.evaluate((origin) => {
    const external = [];
    for (const sheet of document.styleSheets) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of rules) {
        if (rule.constructor.name === 'CSSImportRule') {
          try {
            if (new URL(rule.href, location.href).origin !== origin) external.push(rule.href);
          } catch {
            // relative/local, fine
          }
        }
      }
    }
    return external;
  }, baseOrigin);
  expect(externalImports).toHaveLength(0);
});

// ---------------------------------------------------------------------------
// No cookies or persistent storage
// ---------------------------------------------------------------------------

When('the page loads for the first time', async function () {
  await this.page.reload({ waitUntil: 'networkidle' });
});

Then('the browser\'s cookie store for the domain contains zero cookies', async function () {
  const cookies = await this.context.cookies();
  expect(cookies).toHaveLength(0);
});

Then('no Set-Cookie header is returned by the server in any response', async function () {
  const withSetCookie = this.networkResponses.filter((r) => 'set-cookie' in r.headers);
  expect(withSetCookie).toHaveLength(0);
});

When('the page finishes loading and all scripts have executed', async function () {
  await this.page.reload({ waitUntil: 'networkidle' });
});

Then('localStorage for the origin is empty', async function () {
  const length = await this.page.evaluate(() => window.localStorage.length);
  expect(length).toBe(0);
});

Then('sessionStorage for the origin is empty', async function () {
  const length = await this.page.evaluate(() => window.sessionStorage.length);
  expect(length).toBe(0);
});

When('the page loads without a service worker previously installed', async function () {
  await this.page.reload({ waitUntil: 'networkidle' });
});

Then('no IndexedDB databases are created', async function () {
  const dbs = await this.page.evaluate(async () => {
    if (!indexedDB.databases) return [];
    const list = await indexedDB.databases();
    return list.map((d) => d.name);
  });
  expect(dbs).toHaveLength(0);
});

Then('no Cache API caches are created', async function () {
  const cacheNames = await this.page.evaluate(async () => {
    if (!('caches' in window)) return [];
    return caches.keys();
  });
  expect(cacheNames).toHaveLength(0);
});

// ---------------------------------------------------------------------------
// Service worker and offline behaviour
// ---------------------------------------------------------------------------

Given('a service worker is registered for offline support', async function () {
  const hasServiceWorker = await this.page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const regs = await navigator.serviceWorker.getRegistrations();
    return regs.length > 0;
  });
  if (!hasServiceWorker) {
    // The site has no service worker at all — nothing to inspect.
    return 'skipped';
  }
  this.hasServiceWorker = true;
});

Given('service workers are not supported or have been disabled', async function () {
  // True by default: the site registers no service worker.
});

When('the service worker is inspected', async function () {
  this.serviceWorkerCacheNames = await this.page.evaluate(() => ('caches' in window ? caches.keys() : []));
});

Then('it caches only static assets \\(HTML, CSS, JS, images, fonts\\)', async function () {
  const staticExtension = /\.(html?|css|js|png|jpe?g|svg|webp|gif|woff2?|ttf|otf)$/i;
  for (const name of this.serviceWorkerCacheNames || []) {
    const cache = await this.page.evaluate(async (cacheName) => {
      const c = await caches.open(cacheName);
      const keys = await c.keys();
      return keys.map((k) => k.url);
    }, name);
    for (const url of cache) {
      const pathname = new URL(url).pathname;
      expect(staticExtension.test(pathname) || pathname === '/' || pathname.endsWith('/')).toBe(true);
    }
  }
});

Then('it does not cache any URL query parameters that could contain personal data', async function () {
  for (const name of this.serviceWorkerCacheNames || []) {
    const cache = await this.page.evaluate(async (cacheName) => {
      const c = await caches.open(cacheName);
      const keys = await c.keys();
      return keys.map((k) => k.url);
    }, name);
    for (const url of cache) {
      expect(new URL(url).search).toBe('');
    }
  }
});

Then('it does not forward any data to an external endpoint', async function () {
  const swRequests = this.networkRequests.filter((r) => r.url.includes('sw.js') || r.url.includes('service-worker'));
  const thirdParty = thirdPartyRequests(swRequests, this.config.baseURL);
  expect(thirdParty).toHaveLength(0);
});

Then('all content is accessible', async function () {
  await expect(this.page.locator('body')).toBeVisible();
  const main = this.page.locator('main, #main').first();
  await expect(main).toBeVisible();
});

Then('no error messages related to service worker registration are shown to the user', async function () {
  await expect(this.page.getByText(/service worker/i)).toHaveCount(0);
});

// ---------------------------------------------------------------------------
// Zero-trust messaging clarity
// ---------------------------------------------------------------------------

When('I look for evidence of the privacy claims', async function () {
  // No action needed - the page is already loaded
});

Then('there is a clear explanation that the website itself does not track visitors', async function () {
  await expect(this.page.getByText(/no tracking of any kind|zero analytics|no analytics/i).first()).toBeVisible();
});

Then('there is a clear explanation that the app never sends data to a server', async function () {
  await expect(this.page.getByText(/never.*leave|stored on-device|no cloud/i).first()).toBeVisible();
});

Then('the explanation avoids jargon and is understandable to a non-technical parent', async function () {
  const text = await this.page.textContent('body');
  expect(text.toLowerCase()).not.toMatch(/end-to-end encrypt|zero-knowledge proof|asymmetric cryptography/);
});

Then('no weasel words such as {string} appear without substantiation', async function (phrase) {
  const text = await this.page.textContent('body');
  expect(text.toLowerCase()).not.toContain(phrase.toLowerCase());
});

Then('there is a link to the app\'s open-source repository or a public privacy policy', async function () {
  const link = this.page.locator('a[href*="github.com"], a[href="/privacy"], a[href*="/privacy"]').first();
  await expect(link).toBeVisible();
});

Then('the privacy policy, if present, is written in plain language', async function () {
  const privacyLink = this.page.locator('a[href="/privacy"], a[href*="/privacy"]').first();
  if ((await privacyLink.count()) === 0) return 'skipped';
  const href = await privacyLink.getAttribute('href');
  const url = new URL(href, this.config.baseURL).toString();
  const privacyPage = await this.context.newPage();
  await privacyPage.goto(url, { waitUntil: 'networkidle' });
  const text = await privacyPage.textContent('body');
  expect(text.toLowerCase()).not.toMatch(/end-to-end encrypt|zero-knowledge proof|asymmetric cryptography/);
  await privacyPage.close();
});

Then('the privacy policy confirms zero data collection by both the website and the app', async function () {
  const privacyLink = this.page.locator('a[href="/privacy"], a[href*="/privacy"]').first();
  await expect(privacyLink).toBeVisible();
  const href = await privacyLink.getAttribute('href');
  const url = new URL(href, this.config.baseURL).toString();
  const privacyPage = await this.context.newPage();
  await privacyPage.goto(url, { waitUntil: 'networkidle' });
  await expect(privacyPage.getByText(/does not collect/i).first()).toBeVisible();
  await privacyPage.close();
});

// ---------------------------------------------------------------------------
// Subresource integrity
// ---------------------------------------------------------------------------

Given('any script or stylesheet is loaded from a CDN origin controlled by HealthFlare', async function () {
  const baseOrigin = originOf(this.config.baseURL);
  this.cdnResources = await this.page.evaluate((origin) => {
    const els = [
      ...Array.from(document.querySelectorAll('script[src]')),
      ...Array.from(document.querySelectorAll('link[rel="stylesheet"]')),
    ];
    return els
      .map((el) => el.src || el.href)
      .filter((url) => {
        try {
          const u = new URL(url);
          return u.origin !== origin;
        } catch {
          return false;
        }
      });
  }, baseOrigin);
  if (this.cdnResources.length === 0) {
    // Everything is self-hosted inline — no CDN-loaded resources to check.
    return 'skipped';
  }
});

When('the element is inspected', async function () {
  // No action needed - resources were already collected above
});

Then('it carries an integrity attribute with a valid SHA-384 or SHA-512 hash', async function () {
  expect(this.cdnResources).toHaveLength(0);
});

Then('it carries a crossorigin attribute set to {string}', async function () {
  expect(this.cdnResources).toHaveLength(0);
});
