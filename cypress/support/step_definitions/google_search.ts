import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

import selectors from "../../../pages/selectors";

Given("I visit Google", () => {
  cy.visit("https://www.google.com");
  cy.get(selectors.acceptAllButton).click();
});

When("I type {string} into the search input", (search_term: string) => {
  cy.get(selectors.searchInput).type(search_term);
});

Then(
  "I should see the search input filled with {string}",
  (search_term: string) => {
    cy.get(selectors.searchInput).should("have.value", search_term);
  }
);
