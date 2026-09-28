// Step definitions for features/screenshot_viewer.feature
// Covers the screenshot lightbox on the Health Flare and Inner Flare pages.

import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

const TRIGGER = '.screenshot-trigger';
const VIEWER = '#lightbox';

function trigger(world, n) {
  return world.page.locator(TRIGGER).nth(n - 1);
}

async function expectedFor(world, n) {
  const btn = trigger(world, n);
  const img = btn.locator('img');
  const src = await img.getAttribute('src');
  const alt = await img.getAttribute('alt');
  // Screenshots outside a <figure> (e.g. a hero image) carry data-caption.
  const caption = (
    (await btn.getAttribute('data-caption')) ??
    (await btn.locator('xpath=ancestor::figure[1]').locator('figcaption').first().textContent())
  ).trim();
  return { src, alt, caption };
}

async function expectViewerShows(world, n) {
  const want = await expectedFor(world, n);
  const img = world.page.locator(`${VIEWER} .lightbox-img`);
  // Compare resolved URLs so relative and absolute paths both match.
  await expect(img).toHaveJSProperty('src', new URL(want.src, world.page.url()).href);
  await expect(img).toHaveAttribute('alt', want.alt);
  await expect(world.page.locator(`${VIEWER} .lightbox-caption`)).toHaveText(want.caption);
}

Then('every screenshot on the page is a button that opens a dialog', async function () {
  const triggers = this.page.locator(TRIGGER);
  const count = await triggers.count();
  expect(count).toBeGreaterThan(1);
  for (let i = 0; i < count; i++) {
    const t = triggers.nth(i);
    expect(await t.evaluate((el) => el.tagName)).toBe('BUTTON');
    await expect(t).toHaveAttribute('aria-haspopup', 'dialog');
    await expect(t).toHaveAccessibleName(/\S/);
    await expect(t.locator('img')).toHaveCount(1);
  }
  const viewer = this.page.locator(VIEWER);
  await expect(viewer).toHaveAttribute('role', 'dialog');
  await expect(viewer).toHaveAttribute('aria-modal', 'true');
  await expect(viewer).toBeHidden();
});

When('I click screenshot {int}', async function (n) {
  const t = trigger(this, n);
  await t.scrollIntoViewIfNeeded();
  await t.click();
});

When('I click the viewer\'s previous button', async function () {
  await this.page.locator(`${VIEWER} .lightbox-prev`).click();
});

When('I click the viewer\'s backdrop', async function () {
  // Top-left corner is backdrop, clear of the image and the buttons.
  await this.page.mouse.click(5, 5);
});

When('I press {string}', async function (key) {
  await this.page.keyboard.press(key);
});

When('I press {string} {int} times', async function (key, times) {
  for (let i = 0; i < times; i++) {
    await this.page.keyboard.press(key);
  }
});

Then('the screenshot viewer is open', async function () {
  await expect(this.page.locator(VIEWER)).toBeVisible();
  await expect(this.page.locator(`${VIEWER} .lightbox-img`)).toBeVisible();
});

Then('the screenshot viewer is closed', async function () {
  await expect(this.page.locator(VIEWER)).toBeHidden();
});

Then('the viewer shows screenshot {int} with its caption and description', async function (n) {
  await expectViewerShows(this, n);
});

Then('the viewer shows the last screenshot', async function () {
  const count = await this.page.locator(TRIGGER).count();
  await expectViewerShows(this, count);
});

Then('the viewer\'s close button has focus', async function () {
  await expect(this.page.locator(`${VIEWER} .lightbox-close`)).toBeFocused();
});

Then('screenshot {int} has focus again', async function (n) {
  await expect(trigger(this, n)).toBeFocused();
});

Then('focus is inside the screenshot viewer', async function () {
  const inside = await this.page.evaluate(
    (sel) => document.querySelector(sel).contains(document.activeElement),
    VIEWER,
  );
  expect(inside).toBe(true);
});
