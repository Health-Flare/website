// Step definitions for ci_cd.feature
// Verifies the real GitHub Actions workflows (.github/workflows/*.yml) and
// the built site output, by reading them directly rather than exercising a
// live pipeline run.

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

const CI_YAML_PATH = '.github/workflows/ci.yml';
const DEPLOY_YAML_PATH = '.github/workflows/deploy.yml';
const SECRET_LITERAL_PATTERN = /(password|token|secret|api[_-]?key)\s*:\s*['"]?[A-Za-z0-9/+=_-]{8,}/i;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

When('the workflow files are inspected', function () {
  this.ciYaml = readFileSync(CI_YAML_PATH, 'utf8');
  this.deployYaml = readFileSync(DEPLOY_YAML_PATH, 'utf8');
});

Then('a workflow triggers on push to the main branch', function () {
  expect(this.deployYaml).toMatch(/on:[\s\S]*?push:[\s\S]*?branches:\s*\[main\]/);
});

Then('the CI workflow triggers on pull requests targeting the main branch', function () {
  expect(this.ciYaml).toMatch(/pull_request:[\s\S]*?branches:\s*\[main\]/);
});

Then('the CI workflow only builds and lints, without a deploy step', function () {
  expect(this.ciYaml).not.toMatch(/deploy-pages|wrangler deploy/);
});

Then('no step in the CI workflow sets continue-on-error', function () {
  expect(this.ciYaml).not.toMatch(/continue-on-error/);
});

Then('no workflow file contains a hard-coded secret value', function () {
  expect(this.ciYaml).not.toMatch(SECRET_LITERAL_PATTERN);
  expect(this.deployYaml).not.toMatch(SECRET_LITERAL_PATTERN);
});

When('the build step runs', function () {
  this.lockfileExists = existsSync('package-lock.json');
});

Then('it installs dependencies from a lockfile', function () {
  expect(this.lockfileExists).toBe(true);
});

Then('the output directory is created and contains at least one HTML file', function () {
  expect(existsSync('dist')).toBe(true);
  const htmlFiles = walk('dist').filter((f) => f.endsWith('.html'));
  expect(htmlFiles.length).toBeGreaterThan(0);
});

Then('the deploy workflow uploads the build output as a Pages artefact', function () {
  expect(this.deployYaml).toMatch(/upload-pages-artifact/);
});

Then('the CI workflow runs an HTML validation step', function () {
  expect(this.ciYaml).toMatch(/lint:html|html-validate/);
});

Then('the CI workflow runs the Cucumber test suite that includes axe-core accessibility scenarios', function () {
  expect(this.ciYaml).toMatch(/test:ci|cucumber-js/);
  expect(existsSync('features/accessibility.feature')).toBe(true);
  const stepFiles = readdirSync('tests/step-definitions').filter((f) => f.endsWith('.js'));
  const usesAxe = stepFiles.some((f) => readFileSync(`tests/step-definitions/${f}`, 'utf8').includes('@axe-core/playwright'));
  expect(usesAxe).toBe(true);
});

When('the built site is inspected', function () {
  this.distFiles = walk('dist');
});

Then('every internal link and asset reference resolves to a file that exists in the build output', function () {
  const htmlFiles = this.distFiles.filter((f) => f.endsWith('.html'));
  const missing = [];

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    const dirOfFile = file.slice(0, file.lastIndexOf('/'));
    const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);

    for (const ref of refs) {
      if (/^(https?:|mailto:|tel:|#|data:)/.test(ref)) continue;

      const cleanRef = ref.split('#')[0].split('?')[0];
      if (!cleanRef) continue;

      const targetPath = cleanRef.startsWith('/') ? join('dist', cleanRef) : join(dirOfFile, cleanRef);
      const candidates = [targetPath, `${targetPath}.html`, join(targetPath, 'index.html')];
      if (!candidates.some((c) => existsSync(c))) {
        missing.push(`${file} -> ${ref}`);
      }
    }
  }

  expect(missing, `Broken references:\n${missing.join('\n')}`).toHaveLength(0);
});

Then('the deploy workflow uses actions\\/deploy-pages', function () {
  expect(this.deployYaml).toMatch(/actions\/deploy-pages/);
});

Then('the deploy job declares a needs dependency on the build job', function () {
  expect(this.deployYaml).toMatch(/needs:\s*build/);
});

Then('the deploy job has an environment block naming the GitHub Pages environment', function () {
  expect(this.deployYaml).toMatch(/environment:[\s\S]*?name:\s*github-pages/);
});

Then('each workflow declares an explicit top-level permissions block', function () {
  expect(this.ciYaml).toMatch(/^permissions:/m);
  expect(this.deployYaml).toMatch(/^permissions:/m);
});

Then('the CI workflow does not request write access to repository contents', function () {
  expect(this.ciYaml).not.toMatch(/contents:\s*write/);
});

Then("each workflow's Node.js setup step enables npm dependency caching", function () {
  expect(this.ciYaml).toMatch(/cache:\s*npm/);
  expect(this.deployYaml).toMatch(/cache:\s*npm/);
});
