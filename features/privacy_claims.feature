Feature: Privacy claims match the app
  As someone trusting Health Flare with health records
  I want every privacy claim on the site to be true of the shipped app
  So that I'm not relying on a promise the code doesn't keep

  # The app stores its database in its private sandbox and relies on the
  # phone's own storage encryption. It does not use a hardware-backed key
  # (Secure Enclave / StrongBox) for the database, and an exported file
  # can't be recalled. If the app starts doing either, change this file
  # in the same PR as the copy.

  Scenario Outline: No page claims hardware-backed database encryption or revocable sharing
    Given the site page "<path>" is open
    Then the main content does not mention "Secure Enclave"
    And the main content does not mention "StrongBox"
    And the main content does not mention "revoke" in relation to sharing

    Examples:
      | path                                 |
      | /                                    |
      | /privacy                             |
      | /blog/free-offline-and-not-for-sale/ |

  Scenario: The privacy policy explains password-locked backups
    Given the site page "/privacy" is open
    Then the main content mentions that a backup can be locked with a password

  # The app's records are included in the phone's own backup (iCloud, Google),
  # and optional weather sends an approximate location to Open-Meteo. No page
  # may say data never leaves the device. See Health-Flare/app#98.
  Scenario Outline: No page claims data never leaves the device
    Given the site page "<path>" is open
    Then the main content does not mention "never leaves your device"
    And the main content does not mention "stays on your device"
    And the main content does not mention "everything stays on your phone"
    And the main content does not mention "does not collect, transmit"

    Examples:
      | path                                 |
      | /                                    |
      | /privacy                             |
      | /blog/free-offline-and-not-for-sale/ |
      | /for/tracking-your-own-illness/      |
      | /for/tracking-for-your-child/        |
      | /for/caring-for-family-and-yourself/ |

  Scenario: The privacy policy explains phone backups and how they are protected
    Given the site page "/privacy" is open
    Then the main content mentions "included in your phone's own backup"
    And the main content mentions "Advanced Data Protection"
    And the main content mentions "screen lock"

  Scenario: The privacy policy explains what the weather lookup sends
    Given the site page "/privacy" is open
    Then the main content mentions "approximate location"
    And the main content mentions "Open-Meteo"
