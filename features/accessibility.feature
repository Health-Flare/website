Feature: Accessibility
  As a person with a disability, or as a parent whose child has accessibility needs
  I want the HealthFlare landing page to be fully usable with assistive technology
  So that the product's values of inclusivity are demonstrated from first contact

  Background:
    Given the HealthFlare landing page is loaded in a browser
    And the page has fully rendered

  # ---------------------------------------------------------------------------
  # WCAG 2.2 AA conformance
  # ---------------------------------------------------------------------------

  Scenario: Page conforms to WCAG 2.2 Level AA
    When an automated accessibility audit is run using axe-core or Lighthouse
    Then zero violations of WCAG 2.2 Level AA are reported
    And zero violations of WCAG 2.2 Level A are reported

  # ---------------------------------------------------------------------------
  # Keyboard navigation
  # ---------------------------------------------------------------------------

  Scenario: All interactive elements are reachable by keyboard
    Given a mouse is not used
    When I press Tab repeatedly from the top of the page
    Then every link, button, and form control receives visible focus in logical document order
    And focus is never trapped in a non-modal context
    And the focus indicator meets a minimum 3:1 contrast ratio against its background

  Scenario: Skip navigation link is available
    When I press Tab as the very first keystroke on the page
    Then a "Skip to main content" link becomes visible
    And activating it moves focus to the main content landmark
    And the link is not visible when focus moves away from it

  Scenario: Keyboard-activated menu is fully operable without a mouse
    Given the viewport is 375 pixels wide
    And a hamburger or disclosure menu is present
    When I activate the menu toggle with Enter or Space
    Then the menu opens and focus moves to the first menu item
    And I can navigate all menu items with arrow keys
    And pressing Escape closes the menu and returns focus to the toggle

  # ---------------------------------------------------------------------------
  # Screen reader compatibility
  # ---------------------------------------------------------------------------

  Scenario: Page uses correct semantic landmarks
    When a screen reader navigates by landmark
    Then there is exactly one main landmark
    And there is exactly one banner landmark
    And there is exactly one contentinfo landmark
    And every navigational group is wrapped in a nav landmark with a unique accessible name

  Scenario: All images have appropriate alternative text
    When a screen reader encounters an image
    Then decorative images have an empty alt attribute
    And informative images have a concise, descriptive alt attribute
    And the HealthFlare logo image has alt text that includes the product name

  Scenario: All icons without visible labels have accessible names
    When an icon-only button or link is encountered
    Then it has an aria-label or aria-labelledby that describes its purpose
    And the label is announced correctly by a screen reader

  Scenario: Heading hierarchy is logical and complete
    When the heading structure of the page is inspected
    Then there is exactly one h1 element
    And heading levels do not skip (e.g. h1 is not followed directly by h3)
    And every major section begins with a heading that describes its content

  # ---------------------------------------------------------------------------
  # Colour and contrast
  # ---------------------------------------------------------------------------

  Scenario: Normal body text meets minimum contrast ratio
    When the colour contrast of body text is measured
    Then the contrast ratio of all text smaller than 18pt is at least 4.5:1 against its background

  Scenario: Large text and UI components meet contrast ratio
    When the colour contrast of headings and interactive elements is measured
    Then text at 18pt or larger has a contrast ratio of at least 3:1
    And focus indicators have a contrast ratio of at least 3:1
    And non-text UI components (icons, borders) have a contrast ratio of at least 3:1

  Scenario: Page content does not rely on colour alone
    When information is conveyed visually
    Then colour is supplemented by text, pattern, or icon to distinguish meaning
    And error states, status indicators, and highlights are distinguishable without colour perception

  # ---------------------------------------------------------------------------
  # Motion and animation
  # ---------------------------------------------------------------------------

  Scenario: Animations are suppressed when the user prefers reduced motion
    Given the operating system is set to "reduce motion"
    When the page loads
    Then all CSS transitions and animations are disabled or replaced with instant state changes
    And no auto-playing video or animated content runs

  # ---------------------------------------------------------------------------
  # Text and readability
  # ---------------------------------------------------------------------------

  Scenario: Text can be resized without loss of content
    Given the browser default font size is increased to 200%
    When the page is viewed
    Then no text is clipped, overlapping, or truncated
    And all content remains accessible without horizontal scrolling at 320px width

  Scenario: Page language is declared correctly
    When the page HTML is inspected
    Then the html element has a lang attribute set to the correct BCP 47 language tag
    And any sections in a different language have an appropriate lang attribute on a containing element

  # ---------------------------------------------------------------------------
  # Forms and interactive widgets
  # ---------------------------------------------------------------------------

  Scenario: Any form controls have visible, persistent labels
    When a form or input field is present on the page
    Then every input has an associated label that is visible in the default state
    And the label is connected to its input via for/id or aria-labelledby
    And placeholder text is not used as the only label

  Scenario: Error messages are announced to screen readers
    Given a form with validation is present
    When the user submits the form with invalid data
    Then an error message is displayed adjacent to the offending field
    And the error message is associated with the input via aria-describedby or role="alert"
    And focus moves to the first field with an error
