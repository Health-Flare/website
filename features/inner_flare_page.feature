Feature: Inner Flare page store links
  As someone who wants to try Inner Flare
  I want the page to send me to the right store for my phone
  So that I install Inner Flare, not Health Flare, on iPhone or Android

  # Inner Flare is live on the App Store (id6810504084, 2026-10-27) and
  # Google Play (org.healthflare.app.innerflare). Only link a store once
  # its listing is live.

  Scenario: The page links to both stores
    Given the "/inner-flare/" page is loaded in a browser
    Then the page links to the App Store and Google Play in new tabs
    And every App Store link on the page points to "/id6810504084"
    And every Google Play link on the page points to "id=org.healthflare.app.innerflare"
    And the page does not say "in App Store review"
