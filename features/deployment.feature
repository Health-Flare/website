Feature: Hosting and Deployment
  As a maintainer of the HealthFlare website
  I want the built site to be a clean, portable static artefact deployed to GitHub Pages
  So that the site is simple to host and reason about

  # Cloudflare Workers hosting, DNS/custom-domain verification, and hitting
  # the live GitHub Pages URL to check its status code, Content-Type, or
  # HTTPS redirect were removed from this file. GitHub Pages is the only
  # hosting target this repo has ever configured, and this test suite only
  # ever runs against a local static server (never the live domain) — so
  # anything that needs a real request against the deployed site can't be
  # verified from here without faking it. "Old deploy previews... do not
  # leak" was removed too: this repo has no preview/staging deployment
  # mechanism at all, so there is nothing to check.

  Scenario: GitHub Pages serves a custom 404 page for unknown paths
    When the built site is inspected
    Then a custom 404.html page exists at the root of the build output
    And the 404 page includes a link back to the landing page

  Scenario: Built output is a fully static site
    When the build process completes
    Then the output directory contains only HTML, CSS, JavaScript, image, and font files
    And there are no server-side runtime dependencies required to serve the output

  Scenario: Deployment configuration is stored in version control
    When the repository is inspected
    Then a GitHub Pages deploy workflow is present
    And no secrets or API tokens are hard-coded in it
