// page-objects/PasswordRecoveryPage.ts
import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PasswordRecoveryPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly emailError: Locator;

  // URLs
  private readonly forgotPasswordURL: string;
  private readonly forgotPasswordAPI: string;

  constructor(page: Page) {
    super(page);

    // Locators
    this.emailInput = page.locator('[data-test="email"]');
    this.submitButton = page.locator('[data-test="forgot-password-submit"]');
    this.emailError = page.locator('[data-test="email-error"]');

    // URLs
    this.forgotPasswordURL =
      "https://practicesoftwaretesting.com/auth/forgot-password";
    this.forgotPasswordAPI =
      "https://api.practicesoftwaretesting.com/users/forgot-password";
  }

  async navigate() {
    await this.page.goto(this.forgotPasswordURL);
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async clickSubmitButton() {
    await this.submitButton.click();
  }

  async requestPasswordReset(email: string) {
    await this.enterEmail(email);
    await this.clickSubmitButton();
  }

  waitForForgotPasswordRequest() {
    return this.page.waitForRequest(this.forgotPasswordAPI);
  }
}
