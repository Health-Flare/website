Feature: About the Project and Author
  As a visitor to the HealthFlare landing page
  I want to understand who built the app and why
  So that I can decide whether to trust the project and its values

  Background:
    Given the HealthFlare landing page is loaded in a browser
    And the page has fully rendered with no pending network requests

  # ---------------------------------------------------------------------------
  # Presence and structure
  # ---------------------------------------------------------------------------

  Scenario: About section is present and reachable
    When I scroll to the about section
    Then I see a section describing the author or project background
    And the section has an accessible heading

  # ---------------------------------------------------------------------------
  # Author background
  # ---------------------------------------------------------------------------

  Scenario: Author's personal connection to chronic illness is stated
    When I read the about section
    Then I see a mention of a child or family member with a chronic condition
    And I see a reference to lived experience or personal motivation

  Scenario: Author's technical background is stated
    When I read the about section
    Then I see a reference to experience in software development or technology

  # ---------------------------------------------------------------------------
  # Inspiration and lineage
  # ---------------------------------------------------------------------------

  Scenario: Flaredown is acknowledged as an inspiration
    When I read the about section
    Then I see a reference to Flaredown
    And the reference includes a link to flaredown.com
    And the link opens in a new tab
    And the link has a descriptive accessible name

  # ---------------------------------------------------------------------------
  # Values
  # ---------------------------------------------------------------------------

  Scenario: Author values are clearly stated
    When I read the about section
    Then I see privacy listed as a core value
    And I see transparency listed as a core value

  # ---------------------------------------------------------------------------
  # AI / LLM disclosure
  # ---------------------------------------------------------------------------

  Scenario: Use of AI in development is disclosed
    When I read the about section
    Then I see a disclosure that AI or LLMs are used in development
    And the disclosure makes clear that all generated code is reviewed and tested by the author

  # ---------------------------------------------------------------------------
  # GitHub link
  # ---------------------------------------------------------------------------

  Scenario: GitHub profile is linked from the about section
    When I read the about section
    Then I see a link to the author's GitHub profile
    And the link opens in a new tab
    And the link has a descriptive accessible name indicating it goes to GitHub
