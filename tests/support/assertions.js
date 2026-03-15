// Custom assertions and helpers for testing
// These extend the World with reusable assertion methods

import { expect } from '@playwright/test';

/**
 * Assert that an element is visible on the page
 * @param {import('playwright').Page} page - Playwright page
 * @param {string} selector - CSS selector
 * @param {object} options - Additional options
 */
export async function assertVisible(page, selector, options = {}) {
  const element = page.locator(selector);
  await expect(element).toBeVisible({ timeout: options.timeout || 5000 });
  return element;
}

/**
 * Assert that text is present on the page
 * @param {import('playwright').Page} page - Playwright page
 * @param {string|RegExp} text - Text to find
 */
export async function assertTextPresent(page, text) {
  const locator = page.getByText(text);
  await expect(locator).toBeVisible();
  return locator;
}

/**
 * Assert that an element has focus
 * @param {import('playwright').Page} page - Playwright page
 * @param {string} selector - CSS selector
 */
export async function assertFocused(page, selector) {
  const element = page.locator(selector);
  await expect(element).toBeFocused();
  return element;
}

/**
 * Assert no accessibility violations using axe-core
 * @param {import('playwright').Page} page - Playwright page
 * @param {object} options - axe-core options
 */
export async function assertNoA11yViolations(page, options = {}) {
  const { AxeBuilder } = await import('@axe-core/playwright');

  const results = await new AxeBuilder({ page })
    .withTags(options.tags || ['wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();

  if (results.violations.length > 0) {
    const violations = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
    }));
    throw new Error(
      `Accessibility violations found:\n${JSON.stringify(violations, null, 2)}`
    );
  }

  return results;
}

/**
 * Assert that no third-party requests were made
 * @param {Array} requests - Array of recorded requests
 * @param {string} allowedOrigin - The allowed origin
 */
export function assertNoThirdPartyRequests(requests, allowedOrigin) {
  const thirdPartyRequests = requests.filter((req) => {
    const url = new URL(req.url);
    return !url.origin.includes(allowedOrigin);
  });

  if (thirdPartyRequests.length > 0) {
    throw new Error(
      `Third-party requests detected:\n${thirdPartyRequests.map((r) => r.url).join('\n')}`
    );
  }
}

/**
 * Assert that an element meets contrast requirements
 * @param {import('playwright').Page} page - Playwright page
 * @param {string} selector - CSS selector
 * @param {number} minRatio - Minimum contrast ratio
 */
export async function assertContrastRatio(page, selector, minRatio = 4.5) {
  // This is a simplified check - full contrast checking requires
  // computing actual colors which is complex. For now, we rely on
  // axe-core's contrast checks.
  const { AxeBuilder } = await import('@axe-core/playwright');

  const results = await new AxeBuilder({ page })
    .withTags(['color-contrast'])
    .analyze();

  const contrastViolations = results.violations.filter(
    (v) => v.id === 'color-contrast'
  );

  if (contrastViolations.length > 0) {
    throw new Error(
      `Contrast violations found:\n${JSON.stringify(contrastViolations, null, 2)}`
    );
  }
}
