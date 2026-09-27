// Step definitions for privacy_claims.feature
// Guards against site copy promising more than the app does.

import { Given, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('the site page {string} is open', async function (path) {
  if (!this.page) {
    await this.launchBrowser();
  }
  const url = new URL(path, this.config.baseURL).toString();
  const response = await this.page.goto(url, { waitUntil: 'networkidle' });
  expect(response.status()).toBe(200);
});

async function mainText(page) {
  return (await page.locator('main').innerText()).toLowerCase();
}

Then('the main content does not mention {string}', async function (phrase) {
  expect(await mainText(this.page)).not.toContain(phrase.toLowerCase());
});

Then('the main content does not mention {string} in relation to sharing', async function (word) {
  // The privacy policy legitimately says you can revoke *location
  // permission* in system settings; only sharing/export revocation is false.
  const text = await mainText(this.page);
  const sentences = text.split(/(?<=[.!?])\s+/);
  const bad = sentences.filter(
    (s) => s.includes(word.toLowerCase()) && /(shar|export|report|care provider|doctor)/.test(s)
  );
  expect(bad, `found: ${bad.join(' | ')}`).toHaveLength(0);
});

Then('the main content mentions that a backup can be locked with a password', async function () {
  expect(await mainText(this.page)).toMatch(/backup[^.]*password|password[^.]*backup/);
});
