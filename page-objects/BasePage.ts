import { Page } from "@playwright/test";

export class BasePage {
  public page: Page;
  public homepageURL: string;

  constructor(page: Page) {
    this.page = page;
    this.homepageURL = "https://practicesoftwaretesting.com";
  }

  async goto(url: string) {
    await this.page.goto(url);
  }
}
