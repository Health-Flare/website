# HealthFlare Website — Feature Specifications

Gherkin feature files describing the behaviour of the HealthFlare landing page website. Every scenario here has a real, passing step definition under `tests/step-definitions/` — see "What's not covered" below for the handful of things that were deliberately left out rather than faked.

## Files

| File | Description |
|---|---|
| `landing_page.feature` | Core content, value proposition, responsive layout, and performance |
| `about.feature` | The About section: author background, values, Flaredown credit, AI disclosure, GitHub link |
| `accessibility.feature` | WCAG 2.2 AA conformance, keyboard navigation, screen reader, contrast |
| `privacy_zero_trust.feature` | Zero data transfer: no third-party requests, no cookies, no persistent storage |
| `deployment.feature` | Built-output shape and the GitHub Pages deploy workflow |
| `ci_cd.feature` | The real GitHub Actions build, lint, and deploy pipeline |

## Design constraints captured in these features

- **Zero data transfer** — the website makes no third-party network requests, sets no cookies, and writes no client-side storage
- **Fully accessible** — WCAG 2.2 AA is a hard requirement verified in CI
- **Family friendly** — copy is plain-language, warm, and avoids medical claims
- **Static output** — build artefact is pure HTML/CSS/JS/image/font files, deployable to any static host
- **GitHub Actions** — the build/lint/test pipeline and the GitHub Pages deploy are both verified against the real workflow files

## What's not covered, and why

A few scenarios that used to live here were removed instead of being implemented with fake or always-passing step definitions:

- **Cloudflare Workers hosting and a Gitea Actions pipeline.** Neither has ever existed in this repository — GitHub Actions + GitHub Pages is the only pipeline that has been built. If Cloudflare or Gitea hosting becomes real, the scenarios for it should come back alongside the actual workflow/config files, not before.
- **A strict Content-Security-Policy header, plus HSTS, X-Frame-Options, Permissions-Policy, and an HTTP→HTTPS redirect check.** These need either a real HTTP response header (GitHub Pages does not let a static site set custom headers) or a live request against the deployed domain (this suite only ever runs against a local static server). Both are platform/hosting concerns, not something the site's own code can guarantee.
- **Action-SHA-pinning, exact-runner-version pinning, and cache-invalidation-on-change.** SHA-pinning would mean hard-coding commit SHAs for third-party actions that can't be verified from a sandboxed environment — guessing one would be worse than not pinning at all. The other two either buy little for a static marketing site or aren't meaningfully distinguishable from the dependency-caching scenario that is covered.
- **Custom domain / DNS verification and old preview-deployment leaks.** DNS can't be verified from a test run, and this repo has no preview/staging deployment mechanism to check in the first place.

## Running the scenarios

```bash
npm run build
npx serve dist -l 3000 &
BASE_URL=http://localhost:3000 npm run test:ci
```

Step definitions live under `tests/step-definitions/`, one file per feature (plus `common.steps.js` for shared background/navigation steps).
