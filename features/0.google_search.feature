Feature: Google Search

  Scenario: Searching on Google
    Given I visit Google
    When I type "<search_term>" into the search input
    # Then I should see the search input filled with "<search_term>"

  Examples:
    | search_term |
    | hello world |
    # | cucumber    |
    # | ruby        |
