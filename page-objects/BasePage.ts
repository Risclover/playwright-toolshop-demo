import { Locator, Page } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  // URLs
  readonly homepageURL: string;
  readonly apiURL: string;

  // Locators
  readonly navMenuBtn: Locator;
  readonly usersPageBtn: Locator;
  readonly signInBtn: Locator;
  readonly signOutBtn: Locator;

  constructor(page: Page) {
    this.page = page;

    // URLs
    this.homepageURL = "https://practicesoftwaretesting.com";
    this.apiURL = "https://api.practicesoftwaretesting.com";

    // Locators
    this.navMenuBtn = page.locator('[data-test="nav-menu"]');
    this.usersPageBtn = page.locator('[data-test="nav-admin-users"]');
    this.signInBtn = page.locator('[data-test="nav-sign-in"]');
    this.signOutBtn = page.locator('[data-test="sign-out"]');
  }

  async goto(url: string) {
    await this.page.goto(url);
  }
}
