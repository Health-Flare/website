Feature: Use-case pages
  As someone deciding whether Health Flare fits my situation
  I want a page that shows how people like me set it up and use it
  So that I can picture it working for me before I install it

  # These pages describe the app. Every claim on them has to be true of
  # the shipped app (github.com/Health-Flare/app, docs/features/). When a
  # feature changes, update the page in the same release.

  Scenario: The index lists every use case
    Given the "/for/" page is loaded in a browser
    Then I see a link to "/for/tracking-your-own-illness/"
    And I see a link to "/for/tracking-for-your-child/"
    And I see a link to "/for/caring-for-family-and-yourself/"

  Scenario Outline: Each use-case page is complete
    Given the "<path>" page is loaded in a browser
    Then the page has exactly one h1
    And the page says the example person is made up
    And the page links to the App Store and Google Play in new tabs
    And the page says Health Flare is not a medical device
    And the page links back to "/for/"

    Examples:
      | path                                 |
      | /for/tracking-your-own-illness/      |
      | /for/tracking-for-your-child/        |
      | /for/caring-for-family-and-yourself/ |

  Scenario Outline: Use-case copy uses no dashes as punctuation
    Given the "<path>" page is loaded in a browser
    Then the main content contains no em dashes or en dashes

    Examples:
      | path                                 |
      | /for/                                |
      | /for/tracking-your-own-illness/      |
      | /for/tracking-for-your-child/        |
      | /for/caring-for-family-and-yourself/ |

  Scenario: The landing page links to the use cases
    Given the HealthFlare landing page is loaded in a browser
    Then the footer links to "/for/"
    And the families feature links to "/for/"
