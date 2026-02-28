Feature: Landing Page Content and Presentation
  As a parent or caregiver of a child with a complex or chronic health condition
  I want to understand what HealthFlare does and why it is trustworthy
  So that I feel confident downloading and using it for my family

  Background:
    Given the HealthFlare landing page is loaded in a browser
    And the page has fully rendered with no pending network requests

  # ---------------------------------------------------------------------------
  # Hero section
  # ---------------------------------------------------------------------------

  Scenario: Hero section communicates the core value proposition
    When I view the top of the page
    Then I see the HealthFlare logo
    And I see a headline that describes the app as a private health companion for families
    And I see a sub-headline that mentions chronic or complex conditions
    And I see a primary call-to-action button labelled "Download" or "Learn More"
    And I do not see any cookie banners, consent dialogs, or tracking notices

  Scenario: Hero section works without JavaScript
    Given JavaScript is disabled in the browser
    When the page loads
    Then the hero section content is fully visible
    And the call-to-action link is functional

  # ---------------------------------------------------------------------------
  # App description
  # ---------------------------------------------------------------------------

  Scenario: App description covers all core tracking areas
    When I scroll to the features section
    Then I see a description of symptom logging
    And I see a description of vitals tracking
    And I see a description of medication management
    And I see a description of meal and trigger logging
    And I see a description of freeform journal entries
    And I see a description of multi-profile support for the whole family

  Scenario: App description mentions report export capabilities
    When I read the features section
    Then I see that reports can be exported as PDF or CSV
    And I see that exports are for sharing with doctors or specialists
    And the copy makes clear that exporting is a deliberate, user-initiated act

  Scenario: App description includes platform availability
    When I read the availability section
    Then I see that Android is currently supported
    And I see that iOS is currently supported
    And I see that additional platforms are planned

  # ---------------------------------------------------------------------------
  # Privacy and trust messaging
  # ---------------------------------------------------------------------------

  Scenario: Zero data transfer is communicated prominently
    When I read the privacy section
    Then I see a clear statement that no account or login is required
    And I see a clear statement that all data is stored on-device only
    And I see a clear statement that no data leaves the device unless the user exports it
    And I see a clear statement that there are no analytics, telemetry, or third-party SDKs
    And I see a clear statement that all fonts and assets are bundled locally

  Scenario: Family-friendly trust signals are present
    When I view the page
    Then I see language appropriate for parents and non-technical caregivers
    And I see no medical claims or diagnostic promises
    And the copy includes a disclaimer that the app is not a medical device
    And the tone is calm, warm, and reassuring throughout

  # ---------------------------------------------------------------------------
  # Calls to action and contact
  # ---------------------------------------------------------------------------

  Scenario: Download links are clearly labelled by platform
    When I locate the download section
    Then I see a link or badge for the Android version
    And I see a link or badge for the iOS version
    And each link opens in a new tab with a visible external-link indicator
    And each link has a descriptive accessible name indicating its destination platform

  Scenario: Contact and feedback channel is available
    When I scroll to the footer
    Then I see a way to reach the project for general inquiries
    And I see a way to disclose security concerns responsibly
    And I see a way to express interest in early access or beta testing
    And there is no email address exposed as plain text in the DOM

  # ---------------------------------------------------------------------------
  # Responsive layout
  # ---------------------------------------------------------------------------

  Scenario Outline: Page is usable at common viewport widths
    Given the browser viewport is <width> pixels wide
    When the page loads
    Then all text is readable without horizontal scrolling
    And all interactive elements are reachable by touch or keyboard
    And the navigation is accessible via a visible or disclosed menu

    Examples:
      | width |
      | 320   |
      | 375   |
      | 768   |
      | 1024  |
      | 1440  |

  # ---------------------------------------------------------------------------
  # Performance
  # ---------------------------------------------------------------------------

  Scenario: Page loads with no external runtime dependencies
    When the browser DevTools network panel is open
    And the page is loaded with cache disabled
    Then zero requests are made to third-party domains
    And zero requests are made to analytics or telemetry endpoints
    And all resources are served from the same origin or a CDN under HealthFlare's control

  Scenario: Page achieves acceptable Lighthouse performance score
    When a Lighthouse audit is run against the production URL
    Then the Performance score is 90 or above
    And the Accessibility score is 100
    And the Best Practices score is 100
    And the SEO score is 90 or above
