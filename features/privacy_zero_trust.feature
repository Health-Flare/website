Feature: Privacy, Zero Trust, and Zero Data Transfer
  As a parent or caregiver who values their family's privacy
  I want the HealthFlare landing page itself to embody the same privacy principles as the app
  So that I can trust the product from my very first interaction with it

  Background:
    Given the HealthFlare landing page is loaded in a browser
    And browser DevTools are open on the Network panel

  # ---------------------------------------------------------------------------
  # No third-party requests
  # ---------------------------------------------------------------------------

  Scenario: Page makes zero requests to third-party domains at load time
    When the page finishes loading
    Then the network request log contains requests only to the hosting origin or its CDN
    And there are no requests to analytics providers such as Google Analytics or Mixpanel
    And there are no requests to advertising networks
    And there are no requests to social media platforms or pixel trackers
    And there are no requests to font hosting services such as Google Fonts or Adobe Fonts

  Scenario: All fonts are served as local assets
    When the page loads its fonts
    Then font files are loaded from the same origin as the page
    And no @font-face rule references an external URL
    And the browser makes no network request to fetch a font from a third party

  Scenario: No third-party scripts are loaded
    When the DOM is fully parsed
    Then every script element references a resource on the hosting origin
    And there are no inline scripts that dynamically inject external script tags
    And there are no tag manager containers (e.g. GTM, Segment) in the page source

  Scenario: No third-party stylesheets are loaded
    When the page styles are applied
    Then every stylesheet link element references a resource on the hosting origin
    And no CSS file imports styles from an external origin via @import

  # ---------------------------------------------------------------------------
  # No cookies or persistent storage
  # ---------------------------------------------------------------------------

  Scenario: No cookies are set on page load
    When the page loads for the first time
    Then the browser's cookie store for the domain contains zero cookies
    And no Set-Cookie header is returned by the server in any response

  Scenario: No data is written to localStorage or sessionStorage
    When the page finishes loading and all scripts have executed
    Then localStorage for the origin is empty
    And sessionStorage for the origin is empty

  Scenario: No IndexedDB or Cache API entries are created without user intent
    When the page loads without a service worker previously installed
    Then no IndexedDB databases are created
    And no Cache API caches are created

  # ---------------------------------------------------------------------------
  # Content Security Policy
  # ---------------------------------------------------------------------------

  Scenario: A strict Content-Security-Policy header is present
    When the server response headers are inspected
    Then a Content-Security-Policy header is present
    And the policy does not include 'unsafe-inline' for script-src
    And the policy does not include 'unsafe-eval' for script-src
    And the policy restricts connect-src to 'none' or the hosting origin only
    And the policy restricts img-src to the hosting origin and data: for inline images only
    And the policy restricts font-src to the hosting origin only
    And the policy includes a report-uri or report-to directive for violation monitoring

  Scenario: Additional security headers are present
    When the server response headers are inspected
    Then an X-Content-Type-Options header with value "nosniff" is present
    And an X-Frame-Options header with value "DENY" is present
    And a Referrer-Policy header with value "no-referrer" is present
    And a Permissions-Policy header is present that disables camera, microphone, and geolocation

  # ---------------------------------------------------------------------------
  # Service worker and offline behaviour
  # ---------------------------------------------------------------------------

  Scenario: Service worker does not cache personal or sensitive data
    Given a service worker is registered for offline support
    When the service worker is inspected
    Then it caches only static assets (HTML, CSS, JS, images, fonts)
    And it does not cache any URL query parameters that could contain personal data
    And it does not forward any data to an external endpoint

  Scenario: Page is functional without a service worker
    Given service workers are not supported or have been disabled
    When the page loads
    Then all content is accessible
    And no error messages related to service worker registration are shown to the user

  # ---------------------------------------------------------------------------
  # Zero-trust messaging clarity
  # ---------------------------------------------------------------------------

  Scenario: The page explains zero-trust architecture in plain language
    When I read the privacy section
    Then there is a clear explanation that the website itself does not track visitors
    And there is a clear explanation that the app never sends data to a server
    And the explanation avoids jargon and is understandable to a non-technical parent
    And no weasel words such as "we take your privacy seriously" appear without substantiation

  Scenario: Privacy claims are verifiable by the user
    When I look for evidence of the privacy claims
    Then there is a link to the app's open-source repository or a public privacy policy
    And the privacy policy, if present, is written in plain language
    And the privacy policy confirms zero data collection by both the website and the app

  # ---------------------------------------------------------------------------
  # Subresource integrity
  # ---------------------------------------------------------------------------

  Scenario: All externally referenced subresources use Subresource Integrity
    Given any script or stylesheet is loaded from a CDN origin controlled by HealthFlare
    When the element is inspected
    Then it carries an integrity attribute with a valid SHA-384 or SHA-512 hash
    And it carries a crossorigin attribute set to "anonymous"

  # ---------------------------------------------------------------------------
  # HTTPS enforcement
  # ---------------------------------------------------------------------------

  Scenario: All traffic is served over HTTPS
    When I attempt to access the page via HTTP
    Then the server responds with a 301 or 308 redirect to the HTTPS equivalent
    And the redirect response itself does not set any cookies

  Scenario: HSTS header is present with a long max-age
    When the HTTPS response headers are inspected
    Then a Strict-Transport-Security header is present
    And the max-age directive is at least 31536000 (one year)
    And the includeSubDomains directive is present
    And the preload directive is present
