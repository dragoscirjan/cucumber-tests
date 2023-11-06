import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { ICustomWorld } from "../support/custom-world";
import selectors from "../../pages/selectors";

Given("I visit Google", async function (this: ICustomWorld) {
  const { page } = this;
  await page?.goto("https://www.google.com");

  await page?.waitForSelector(selectors.acceptAllButton);
  await page?.click(selectors.acceptAllButton);
});

When(
  "I type {string} into the search input",
  async function (this: ICustomWorld, search_term) {
    const { page } = this;

    await page?.waitForSelector(selectors.searchInput);
    await page?.fill(selectors.searchInput, search_term);
  }
);

Then(
  "I should see the search input filled with {string}",
  async function (this: ICustomWorld, search_term) {
    const { page } = this;
    const value = await page?.inputValue(selectors.searchInput);
    expect(value).toBe(search_term);
  }
);
