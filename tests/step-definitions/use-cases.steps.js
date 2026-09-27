// Step definitions for use_cases.feature
// Checks the /for/ use-case pages: structure, required disclosures, links.

import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('the {string} page is loaded in a browser', async function (path) {
  if (!this.page) {
    await this.launchBrowser();
  }
  const url = new URL(path, this.config.baseURL).toString();
  const response = await this.page.goto(url, { waitUntil: 'networkidle' });
  expect(response.status()).toBe(200);
});

Then('I see a link to {string}', async function (href) {
  await expect(this.page.locator(`main a[href="${href}"]`)).toHaveCount(1);
});

Then('the page has exactly one h1', async function () {
  await expect(this.page.locator('h1')).toHaveCount(1);
});

Then('the page says the example person is made up', async function () {
  await expect(this.page.locator('main').getByText(/made-up example/i)).toBeVisible();
});

Then('the page links to the App Store and Google Play in new tabs', async function () {
  for (const host of ['apps.apple.com', 'play.google.com']) {
    const link = this.page.locator(`main a[href*="${host}"]`).first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
  }
});

Then('the page says Health Flare is not a medical device', async function () {
  await expect(this.page.locator('main').getByText(/not a medical device/i)).toBeVisible();
});

Then('the page links back to {string}', async function (href) {
  await expect(this.page.locator(`main a[href="${href}"]`).first()).toBeVisible();
});

Then('the main content contains no em dashes or en dashes', async function () {
  const text = await this.page.locator('main').innerText();
  const found = text.match(/.{0,30}[\u2013\u2014].{0,30}/g) || [];
  expect(found, `dashes found: ${found.join(' | ')}`).toHaveLength(0);
});

Then('the footer links to {string}', async function (href) {
  await expect(this.page.locator(`footer a[href="${href}"]`)).toHaveCount(1);
});

Then('the families feature links to {string}', async function (href) {
  const feature = this.page.locator('#features .feature', { hasText: 'Built for families too' });
  await expect(feature.locator(`a[href="${href}"]`)).toBeVisible();
});
