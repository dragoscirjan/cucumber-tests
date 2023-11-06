import {
  ChromiumBrowser,
  FirefoxBrowser,
  WebKitBrowser,
  Page,
} from "@playwright/test";

declare global {
  // eslint-disable-next-line no-var
  var cy: any;
}

export type PlaywrightBrowser =
  | ChromiumBrowser
  | FirefoxBrowser
  | WebKitBrowser;

export type PageOptions = {
  playwrightBrowser?: PlaywrightBrowser;
  domain: string;
};

export class GenericPage {
  private page?: Page;

  constructor(private options: PageOptions) {}

  async init(): Promise<undefined> {
    if (!this.page) {
      this.page = await this.options.playwrightBrowser?.newPage();
    }
  }

  visit(page = "/", options?: any): any {
    const url = `${this.options.domain}${page}`;

    if (this.page !== undefined) {
      return this.page?.goto(url, options);
    }

    return cy.visit(url, options);
  }
}
