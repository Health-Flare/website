// Cucumber hooks - lifecycle management for tests
// https://cucumber.io/docs/cucumber/api/#hooks

import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { spawn } from 'child_process';
import { mkdir } from 'fs/promises';

let server = null;

/**
 * Start a local server before all tests
 */
BeforeAll(async function () {
  // Ensure reports directories exist
  await mkdir('reports/screenshots', { recursive: true });

  // Start a local server if not already running
  if (process.env.START_SERVER !== 'false') {
    server = spawn('npx', ['serve', '-l', '3000', '-s'], {
      cwd: process.cwd(),
      stdio: 'pipe',
      detached: false,
    });

    // Wait for server to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
});

/**
 * Stop the local server after all tests
 */
AfterAll(async function () {
  if (server) {
    server.kill('SIGTERM');
    server = null;
  }
});

/**
 * Launch browser before each scenario
 */
Before(async function (scenario) {
  // Store scenario info for debugging
  this.scenarioName = scenario.pickle.name;
  this.tags = scenario.pickle.tags.map((t) => t.name);
});

/**
 * Cleanup after each scenario
 */
After(async function (scenario) {
  // Take screenshot on failure
  if (scenario.result?.status === Status.FAILED) {
    const screenshotName = this.scenarioName
      .replace(/[^a-zA-Z0-9]/g, '-')
      .toLowerCase();
    await this.takeScreenshot(screenshotName);
  }

  // Close browser
  await this.closeBrowser();
});
