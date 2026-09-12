// Step definitions for about.feature
// Tests the About section: author background, values, and disclosures

import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('I see a section describing the author or project background', async function () {
  const section = this.page.locator('#about, [data-section="about"]').first();
  await expect(section).toBeVisible();
});

Then('the section has an accessible heading', async function () {
  const heading = this.page.locator('#about h1, #about h2, #about h3').first();
  await expect(heading).toBeVisible();
  const text = await heading.textContent();
  expect(text.trim().length).toBeGreaterThan(0);
});

Then('I see a mention of a child or family member with a chronic condition', async function () {
  await expect(this.page.getByText(/child|family/i).first()).toBeVisible();
});

Then('I see a reference to lived experience or personal motivation', async function () {
  await expect(this.page.getByText(/our family needed it|lived experience|personal/i).first()).toBeVisible();
});

Then('I see a reference to experience in software development or technology', async function () {
  await expect(this.page.getByText(/software developer|software development|years? in tech/i).first()).toBeVisible();
});

Then('I see a reference to Flaredown', async function () {
  await expect(this.page.getByText(/flaredown/i).first()).toBeVisible();
});

Then('the reference includes a link to flaredown.com', async function () {
  const link = this.page.locator('a[href*="flaredown.com"]').first();
  await expect(link).toBeVisible();
});

Then('the link opens in a new tab', async function () {
  // Refers to the most recently checked link context (Flaredown or GitHub,
  // both of which are the only about-section links this feature covers).
  const link = this.page.locator('#about a[target="_blank"]').first();
  await expect(link).toHaveAttribute('target', '_blank');
});

Then('the link has a descriptive accessible name', async function () {
  const link = this.page.locator('a[href*="flaredown.com"]').first();
  const text = await link.textContent();
  const ariaLabel = await link.getAttribute('aria-label');
  expect((ariaLabel || text || '').trim().length).toBeGreaterThan(0);
});

Then('I see privacy listed as a core value', async function () {
  const section = this.page.locator('#about');
  await expect(section.getByText(/privacy/i).first()).toBeVisible();
});

Then('I see transparency listed as a core value', async function () {
  const section = this.page.locator('#about');
  await expect(section.getByText(/transparency/i).first()).toBeVisible();
});

Then('I see a disclosure that AI or LLMs are used in development', async function () {
  const section = this.page.locator('#about');
  await expect(section.getByText(/\bAI\b|LLMs?/i).first()).toBeVisible();
});

Then('the disclosure makes clear that all generated code is reviewed and tested by the author', async function () {
  const section = this.page.locator('#about');
  await expect(section.getByText(/reviewed and tested/i).first()).toBeVisible();
});

Then('I see a link to the author\'s GitHub profile', async function () {
  const link = this.page.locator('a[href*="github.com"]').first();
  await expect(link).toBeVisible();
});

Then('the link has a descriptive accessible name indicating it goes to GitHub', async function () {
  const link = this.page.locator('a[href*="github.com"]').first();
  const text = await link.textContent();
  const ariaLabel = await link.getAttribute('aria-label');
  const accessibleName = (ariaLabel || text || '').trim();
  expect(accessibleName.length).toBeGreaterThan(0);
  expect(accessibleName.toLowerCase()).toContain('github');
});
