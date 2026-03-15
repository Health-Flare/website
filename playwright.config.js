// Playwright configuration for browser automation
// Used by Cucumber step definitions

export const playwrightConfig = {
  // Base URL for the site under test
  baseURL: process.env.BASE_URL || 'http://localhost:3000',

  // Browser options
  headless: process.env.HEADED !== 'true',
  slowMo: process.env.DEBUG === 'true' ? 100 : 0,

  // Viewport defaults
  viewport: {
    width: 1280,
    height: 720,
  },

  // Screenshot on failure
  screenshot: 'only-on-failure',

  // Timeout settings
  timeout: 30000,
  navigationTimeout: 15000,

  // Browser to use
  browserType: process.env.BROWSER || 'chromium',
};
