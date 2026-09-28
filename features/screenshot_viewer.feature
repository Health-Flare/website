Feature: Screenshot viewer
  As someone looking at the app before installing it
  I want to open a screenshot at full size
  So that I can read what is on the screen

  # The screenshots on the landing pages are shown small. Each one must open
  # in a viewer that works with a mouse, a keyboard, and a screen reader.

  Scenario Outline: Clicking a screenshot opens it larger
    Given the "<path>" page is loaded in a browser
    Then every screenshot on the page is a button that opens a dialog
    When I click screenshot 2
    Then the screenshot viewer is open
    And the viewer shows screenshot 2 with its caption and description
    And the viewer's close button has focus

    Examples:
      | path          |
      | /             |
      | /inner-flare/ |

  Scenario Outline: The viewer steps through screenshots and closes cleanly
    Given the "<path>" page is loaded in a browser
    When I click screenshot 1
    And I press "ArrowRight"
    Then the viewer shows screenshot 2 with its caption and description
    When I click the viewer's previous button
    And I click the viewer's previous button
    Then the viewer shows the last screenshot
    When I press "Escape"
    Then the screenshot viewer is closed
    And screenshot 1 has focus again

    Examples:
      | path          |
      | /             |
      | /inner-flare/ |

  Scenario Outline: Clicking outside the screenshot closes the viewer
    Given the "<path>" page is loaded in a browser
    When I click screenshot 1
    And I click the viewer's backdrop
    Then the screenshot viewer is closed

    Examples:
      | path          |
      | /             |
      | /inner-flare/ |

  Scenario Outline: Keyboard focus stays inside the open viewer
    Given the "<path>" page is loaded in a browser
    When I click screenshot 1
    And I press "Tab" 4 times
    Then focus is inside the screenshot viewer

    Examples:
      | path          |
      | /             |
      | /inner-flare/ |
