import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PasswordRecoveryPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly emailError: Locator;

  // URLs
  readonly forgotPasswordURL: string;
  readonly forgotPasswordAPI: string;

  constructor(page: Page) {
    super(page);

    // Locators
    this.emailInput = page.locator('[data-test="email"]');
    this.submitButton = page.locator('[data-test="forgot-password-submit"]');
    this.emailError = page.locator('[data-test="email-error"]');

    // URLs
    this.forgotPasswordURL = `${this.homepageURL}/auth/forgot-password`;
    this.forgotPasswordAPI = `${this.apiURL}/users/forgot-password`;
  }

  // Navigate to password recovery page
  async navigate() {
    await this.goto(this.forgotPasswordURL);
  }

  // Enter email into email field
  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  // Click form submit button
  async clickSubmitButton() {
    await this.submitButton.click();
  }

  // Fill out form and click submit
  async requestPasswordReset(email: string) {
    // Enter email input with given email
    await this.enterEmail(email);

    // Submit password reset request form
    await this.clickSubmitButton();
  }

  // Wait for request from forgot password API
  waitForForgotPasswordRequest() {
    return this.page.waitForRequest(this.forgotPasswordAPI);
  }
}
