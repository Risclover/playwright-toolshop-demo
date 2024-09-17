import { expect, Page } from "@playwright/test";
import { Selectors } from "./selectors";

export class CommonComponents {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async validateUserMenuVisible(user: string) {
    await expect(
      this.page.locator(Selectors.currentUserMenuBtn(user))
    ).toBeVisible();
  }

  async validateMyAccountHeading() {
    await expect(this.page.locator(Selectors.myAccountHeading)).toBeVisible();
  }

  async clickForgotPasswordBtn() {
    await this.page.locator(Selectors.forgotPasswordBtn).click();
  }

  async clickRegisterBtn() {
    await this.page.locator(Selectors.registerBtn).click();
  }
}
