import { Given, When, Then } from "@cucumber/cucumber";
import { Selector } from "testcafe";
import { expect } from "chai";
import selectors from "../../pages/selectors";
import { TestControllerHolder } from "../test-controller-holder";

Given("I visit Google", async function () {
  const t = await TestControllerHolder.get();
  await t.navigateTo("https://www.google.com");
  await t.click(Selector(selectors.acceptAllButton));
});

When(
  "I type {string} into the search input",
  async function (search_term: string) {
    const t = await TestControllerHolder.get();
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
