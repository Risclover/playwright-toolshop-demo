import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { userData } from "../test-data/loginData";

export class LoginPage extends BasePage {
  // Inputs
  readonly emailInput: Locator;
  readonly passwordInput: Locator;

  // Links
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;

  // Buttons
  readonly loginBtn: Locator;
  readonly unmaskPasswordBtn: Locator;
  readonly maskPasswordBtn: Locator;

  // Errors
  readonly loginError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  // Misc.
  readonly myAccountHeading: Locator;

  // URLs
  readonly loginURL: string;
  readonly forgotPasswordURL: string;

  constructor(page: Page) {
    super(page);

    // Inputs
    this.emailInput = page.getByPlaceholder("Your email");
    this.passwordInput = page.getByPlaceholder("Your password");

    // Links
    this.forgotPasswordLink = page.getByText("Forgot your Password?");
    this.registerLink = page.getByRole("link", {
      name: "Register your account",
    });

    // Buttons
    this.loginBtn = page.getByRole("button", { name: "Login" });
    this.unmaskPasswordBtn = page.locator('button:has(svg[data-icon="eye"])');
    this.maskPasswordBtn = page.locator(
      'button:has(svg[data-icon="eye-slash"])'
    );

    // Errors
    this.emailError = page.locator("[data-test='email-error']");
    this.passwordError = page.locator("[data-test='password-error']");
    this.loginError = page.locator('[data-test="login-error"]');

    // Misc.
    this.myAccountHeading = page.getByRole("heading", { name: "My account" });

    // URLS
    this.loginURL = `${this.homepageURL}/auth/login`;
  }

  // Navigate to login form
  async navigate() {
    await this.goto(this.loginURL);
  }

  // Get current menu button element based on logged-in user's name
  getCurrentUserMenuBtn(firstName: string, lastName: string): Locator {
    return this.page.getByRole("button", { name: `${firstName} ${lastName}` });
  }

  // Enter email into email field
  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  // Enter password into password field
  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  // Click submit button
  async clickloginBtn() {
    await this.loginBtn.click();
  }

  // Log into account using given email and password
  async login(email: string, password: string) {
    // Enter given email
    await this.enterEmail(email);

    // Enter given password
    await this.enterPassword(password);

    // Submit login form
    await this.clickloginBtn();
  }

  // Log out of account
  async logout() {
    // Click navigation menu button to open menu
    await this.navMenuBtn.click();

    // Click sign out button
    await this.page.locator('[data-test="nav-sign-out"]').click();
  }

  // Toggle password visibility by clicking button
  async togglePasswordVisibility() {
    // If password input field's type is 'text', then isPasswordVisible is true
    const isPasswordVisible =
      (await this.passwordInput.getAttribute("type")) === "text";

    // Toggle password visibility (based on whether password input field's type is 'text' or not [otherwise would be type 'password'])
    if (isPasswordVisible) {
      await this.maskPasswordBtn.click();
    } else {
      await this.unmaskPasswordBtn.click();
    }
  }

  // Navigate to password recovery page from login page
  async clickForgotPasswordLink() {
    await this.forgotPasswordLink.click();
  }

  // Navigate to registration page from login page
  async clickRegisterLink() {
    await this.registerLink.click();
  }

  // Reset user login attempts to allow infinite testing
  async resetUserLoginAttempts(email: string) {
    // Login to admin account
    await this.login(userData.admin.email, userData.admin.password);

    // Open nav menu
    await this.navMenuBtn.click();

    // Navigate to Users page
    await this.usersPageBtn.click();

    // Locate the correct user row containing the target email
    const userRow = this.page.locator("table tbody tr").filter({
      has: this.page.locator(`td:has-text("${email}")`),
    });
    await this.page.waitForSelector("table");

    // Ensure the user row is found
    const rowCount = await userRow.count();
    if (rowCount === 0) {
      throw new Error(`User with email ${email} not found.`);
    }

    // Find the 'Edit' button within that row
    const editButton = userRow.locator("a", { hasText: "Edit" });

    // Click the 'Edit' button and wait for the 'Failed login attempts' field to appear
    await Promise.all([
      this.page.waitForSelector('input[data-test="failed_login_attempts"]', {
        state: "visible",
      }),
      editButton.click(),
    ]);
    // Wait for form to properly load
    await this.page.waitForTimeout(2000);
    await this.page
      .locator('[data-test="failed_login_attempts"]')
      .waitFor({ state: "visible" });
    await this.page
      .locator("[data-test='failed_login_attempts']")
      .scrollIntoViewIfNeeded();

    // Replace login attempts with 0
    await this.page.locator("[data-test='failed_login_attempts']").fill("0");

    // Save the changes

    await this.page.click('button[data-test="user-submit"]');

    // Confirm success
    await this.page.waitForSelector(".alert-success", { state: "visible" });
    await expect(this.page.getByText("User saved!")).toBeVisible();

    // Log out of admin account
    await this.logout();
  }
}
