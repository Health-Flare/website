// Cucumber World - shared context for all step definitions
// https://cucumber.io/docs/cucumber/state/

import { setWorldConstructor, World } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from 'playwright';
import { playwrightConfig } from '../../playwright.config.js';

/**
 * Custom World class that provides browser automation context
 * to all step definitions.
 */
class PlaywrightWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.config = playwrightConfig;
  }

  /**
   * Get the browser launcher based on configuration
   */
  getBrowserType() {
    const browsers = { chromium, firefox, webkit };
    return browsers[this.config.browserType] || chromium;
  }

  /**
   * Launch browser and create a new page
   */
  async launchBrowser(options = {}) {
    const browserType = this.getBrowserType();

    this.browser = await browserType.launch({
      headless: this.config.headless,
      slowMo: this.config.slowMo,
    });

    this.context = await this.browser.newContext({
      viewport: options.viewport || this.config.viewport,
      javaScriptEnabled: options.javaScriptEnabled !== false,
      reducedMotion: options.reducedMotion || 'no-preference',
      colorScheme: options.colorScheme || 'light',
    });

    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(this.config.timeout);
    this.page.setDefaultNavigationTimeout(this.config.navigationTimeout);

    return this.page;
  }

  /**
   * Navigate to the landing page
   */
  async navigateToLandingPage() {
    if (!this.page) {
      await this.launchBrowser();
    }
    await this.page.goto(this.config.baseURL, {
      waitUntil: 'networkidle',
    });
  }

  /**
   * Set viewport size
   */
  async setViewport(width, height = 720) {
    if (this.page) {
      await this.page.setViewportSize({ width, height });
    }
  }

  /**
   * Take a screenshot for debugging
   */
  async takeScreenshot(name) {
    if (this.page) {
      const timestamp = Date.now();
      await this.page.screenshot({
        path: `reports/screenshots/${name}-${timestamp}.png`,
        fullPage: true,
      });
    }
  }

  /**
   * Close browser and cleanup
   */
  async closeBrowser() {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

setWorldConstructor(PlaywrightWorld);
