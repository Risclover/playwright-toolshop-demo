import { Page } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  readonly homepageURL: string;
  readonly apiURL: string;

  constructor(page: Page) {
    this.page = page;
    this.homepageURL = "https://practicesoftwaretesting.com";
    this.apiURL = "https://api.practicesoftwaretesting.com";
  }

  async goto(url: string) {
    await this.page.goto(url);
  }
}
