Feature: Hosting and Deployment Targets
  As a maintainer of the HealthFlare website
  I want the site to be deployable to both GitHub Pages and Cloudflare Workers
  So that I can choose the hosting target that best suits the project's needs at any time

  # ---------------------------------------------------------------------------
  # GitHub Pages deployment
  # ---------------------------------------------------------------------------

  Scenario: Site is served correctly from GitHub Pages
    Given the built site artefacts are committed to the gh-pages branch or the docs/ folder
    When a browser navigates to the GitHub Pages URL for the repository
    Then the landing page loads with a 200 status code
    And the Content-Type of the HTML response is "text/html; charset=utf-8"
    And all relative asset paths resolve correctly under the repository sub-path if applicable

  Scenario: Custom domain is configured for GitHub Pages
    Given a CNAME file is present in the repository root or docs/ folder
    And the DNS A records or CNAME record for the custom domain point to GitHub Pages
    When a browser navigates to the custom domain
    Then the landing page is served over HTTPS with a valid certificate
    And the certificate is issued by Let's Encrypt or another trusted CA via GitHub Pages

  Scenario: GitHub Pages serves a 404 page for unknown paths
    When a browser navigates to a path that does not exist on the site
    Then the server returns a 404 status code
    And the custom 404.html page is shown rather than the GitHub default
    And the 404 page includes a link back to the landing page

  Scenario: GitHub Pages enforces HTTPS
    Given the "Enforce HTTPS" option is enabled in the repository Pages settings
    When a request is made over HTTP to the GitHub Pages domain
    Then the response is a redirect to the HTTPS equivalent

  # ---------------------------------------------------------------------------
  # Cloudflare Workers deployment
  # ---------------------------------------------------------------------------

  Scenario: Site is served correctly via a Cloudflare Worker
    Given the Cloudflare Worker is deployed with the built site assets bound as a KV namespace or via Workers Assets
    When a browser navigates to the Cloudflare Workers URL or custom domain
    Then the landing page is served with a 200 status code
    And all security headers defined in the privacy feature are present in the response
    And the response is served from the Cloudflare edge closest to the visitor

  Scenario: Cloudflare Worker returns correct security headers
    When the HTTP response headers from the Worker are inspected
    Then the Content-Security-Policy header is present with the policy defined in the project
    And the Strict-Transport-Security header is present
    And the X-Content-Type-Options header is present
    And the X-Frame-Options header is present
    And the Referrer-Policy header is present
    And the Permissions-Policy header is present

  Scenario: Cloudflare Worker serves a 404 page for unknown paths
    When a request is made to a path that is not part of the site
    Then the Worker responds with a 404 status code
    And the custom 404 HTML content is returned
    And the response body is not the default Cloudflare error page

  Scenario: Cloudflare Worker handles SPA-style routing if required
    Given the site uses client-side routing
    When a browser navigates directly to a deep-link path
    Then the Worker returns the root index.html with a 200 status code
    And the correct page content is rendered by the client

  Scenario: Cloudflare Worker does not log or retain visitor data
    When the Worker configuration is inspected
    Then no KV writes or Durable Object writes capture request metadata
    And no third-party logging integrations are configured in the Worker
    And Cloudflare Analytics script is not injected by the Worker

  # ---------------------------------------------------------------------------
  # Shared deployment requirements
  # ---------------------------------------------------------------------------

  Scenario: Built output is a fully static site
    When the build process completes
    Then the output directory contains only HTML, CSS, JavaScript, image, and font files
    And there are no server-side runtime dependencies required to serve the output
    And the output can be served by any static file host without modification

  Scenario: Old deploy previews or staging URLs do not leak to the public
    When a staging or preview deployment is created
    Then the URL is not indexed by search engines (X-Robots-Tag: noindex or robots meta tag)
    And the URL requires either a secret path segment or authentication to access

  Scenario: Deployment configuration is stored in version control
    When the repository is inspected
    Then a wrangler.toml or equivalent Cloudflare Workers configuration file is present
    And a GitHub Pages configuration is present either as a CNAME file, docs/ folder, or workflow configuration
    And no secrets or API tokens are hard-coded in any configuration file
