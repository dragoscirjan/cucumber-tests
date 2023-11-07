declare global {
  var testController: any;
}

import { Given, When, Then } from "@cucumber/cucumber";
import { Selector } from "testcafe";
import { expect } from "chai";

import selectors from "../../pages/selectors";
import testControllerHolder from "../../cucumber/support/testcafe/holder";

Given("I visit Google", async function () {
  await testController.navigateTo("https://www.google.com");
  await testController.click(Selector(selectors.acceptAllButton));
});

When(
  "I type {string} into the search input",
  async function (search_term: string) {
    const t = await testControllerHolder.get();
    await t.typeText(selectors.searchInput, search_term);
  }
);

Then(
  "I should see the search input filled with {string}",
  async function (search_term: string) {
    const input = Selector(selectors.searchInput);
    const value = await input.value;

    expect(value).to.equal(search_term);
  }
);
