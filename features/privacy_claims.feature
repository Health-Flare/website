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
