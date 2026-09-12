// Step definitions for deployment.feature
// Verifies the built static output and the real deploy workflow file.

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

const DEPLOY_YAML_PATH = '.github/workflows/deploy.yml';
const SECRET_LITERAL_PATTERN = /(password|token|secret|api[_-]?key)\s*:\s*['"]?[A-Za-z0-9/+=_-]{8,}/i;
const ALLOWED_EXTENSIONS = new Set([
  '.html', '.css', '.js', '.mjs', '.json',
  '.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.ico',
  '.woff', '.woff2', '.ttf', '.otf',
]);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

Then('a custom 404.html page exists at the root of the build output', function () {
  expect(existsSync('dist/404.html')).toBe(true);
});

Then('the 404 page includes a link back to the landing page', function () {
  const html = readFileSync('dist/404.html', 'utf8');
  expect(html).toMatch(/href="\/?"|href="\/index\.html"/);
});

When('the build process completes', function () {
  this.distFiles = walk('dist');
});

Then('the output directory contains only HTML, CSS, JavaScript, image, and font files', function () {
  const disallowed = this.distFiles.filter((f) => !ALLOWED_EXTENSIONS.has(extname(f).toLowerCase()));
  expect(disallowed, `Unexpected file types in build output:\n${disallowed.join('\n')}`).toHaveLength(0);
});

Then('there are no server-side runtime dependencies required to serve the output', function () {
  const serverFiles = this.distFiles.filter((f) => /\.(php|py|rb|jsp|asp|aspx)$/i.test(f));
  expect(serverFiles).toHaveLength(0);
  const packageJsonInOutput = this.distFiles.some((f) => f.endsWith('package.json'));
  expect(packageJsonInOutput).toBe(false);
});

When('the repository is inspected', function () {
  // No action needed - checks below read files directly
});

Then('a GitHub Pages deploy workflow is present', function () {
  expect(existsSync(DEPLOY_YAML_PATH)).toBe(true);
  const yaml = readFileSync(DEPLOY_YAML_PATH, 'utf8');
  expect(yaml).toMatch(/deploy-pages/);
});

Then('no secrets or API tokens are hard-coded in it', function () {
  const yaml = readFileSync(DEPLOY_YAML_PATH, 'utf8');
  expect(yaml).not.toMatch(SECRET_LITERAL_PATTERN);
});
