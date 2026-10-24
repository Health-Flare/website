Feature: Thanks page
  As someone who helped with Health Flare without writing code
  I want my work credited somewhere people will see it
  So that the help is visible, not just a commit graph

  # Names come from src/_data/contributors.json. Only people who agreed
  # to be named, under the name they chose, with no health or family
  # details. Remove anyone who asks.

  Scenario: The thanks page explains how to help and links to code credits
    Given the "/thanks/" page is loaded in a browser
    Then the page has exactly one h1
    And the page links back to "https://github.com/Health-Flare/.github/blob/main/CONTRIBUTING.md"
    And the page links back to "https://github.com/Health-Flare/app/graphs/contributors"
    And the page links back to "https://github.com/Health-Flare/InnerFlare/graphs/contributors"

  Scenario: Thanks copy uses no dashes as punctuation
    Given the "/thanks/" page is loaded in a browser
    Then the main content contains no em dashes or en dashes

  Scenario: The landing page footer links to the thanks page
    Given the HealthFlare landing page is loaded in a browser
    Then the footer links to "/thanks/"
