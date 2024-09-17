// page-objects/BasePage.ts
import { Page } from "@playwright/test";

export class BasePage {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }
}
