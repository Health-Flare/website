# HealthFlare Website — Feature Specifications

Gherkin feature files describing the behaviour of the HealthFlare landing page website.

## Files

| File | Description |
|---|---|
| `landing_page.feature` | Core content, value proposition, responsive layout, and performance |
| `accessibility.feature` | WCAG 2.2 AA conformance, keyboard navigation, screen reader, contrast |
| `privacy_zero_trust.feature` | Zero data transfer, no third-party requests, CSP, HTTPS, HSTS |
| `deployment.feature` | GitHub Pages and Cloudflare Workers hosting requirements |
| `ci_cd.feature` | GitHub Actions and Gitea Actions build and deploy pipelines |

## Design constraints captured in these features

- **Zero data transfer** — the website makes no third-party network requests and sets no cookies
- **Zero trust** — strict CSP, SRI, security headers, and HTTPS enforcement are specified
- **Fully accessible** — WCAG 2.2 AA is a hard requirement verified in CI
- **Family friendly** — copy is plain-language, warm, and avoids medical claims
- **Static output** — build artefact is pure HTML/CSS/JS, deployable to any static host
- **Dual CI/CD** — both GitHub Actions and Gitea Actions workflows are required

## Running the scenarios

These scenarios are written in Gherkin and are intended to be executed with a BDD framework such as [Cucumber](https://cucumber.io/) or [Playwright BDD](https://playwright-bdd.github.io/).

Step definitions should be implemented once the site technology stack is selected.
