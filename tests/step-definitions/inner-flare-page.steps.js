// Step definitions for inner_flare_page.feature

import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

async function everyLinkPointsTo(page, host, fragment) {
  const hrefs = await page.locator(`a[href*="${host}"]`).evaluateAll(
    (links) => links.map((a) => a.getAttribute('href')),
  );
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) expect(href).toContain(fragment);
}

Then('every App Store link on the page points to {string}', async function (fragment) {
  await everyLinkPointsTo(this.page, 'apps.apple.com', fragment);
});

Then('every Google Play link on the page points to {string}', async function (fragment) {
  await everyLinkPointsTo(this.page, 'play.google.com', fragment);
});

Then('the page does not say {string}', async function (text) {
  const body = await this.page.locator('body').innerText();
  expect(body.toLowerCase()).not.toContain(text.toLowerCase());
});
