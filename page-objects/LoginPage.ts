// page-objects/LoginPage.ts
import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  // Locators
  public emailInput: Locator;
  public passwordInput: Locator;
  public loginButton: Locator;
  public emailError: Locator;
  public passwordError: Locator;
  public forgotPasswordLink: Locator;
  public registerLink: Locator;
  public unmaskPasswordBtn: Locator;
  public maskPasswordBtn: Locator;
  public myAccountHeading: Locator;
  public navMenuBtn: Locator;
  public usersPageBtn: Locator;
  public signoutBtn: Locator;
  public loginError: Locator;

  // URL
  private loginURL: string;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.emailInput = page.getByPlaceholder("Your email");
    this.passwordInput = page.getByPlaceholder("Your password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.emailError = page.locator("[data-test='email-error']");
    this.passwordError = page.locator("[data-test='password-error']");
    this.forgotPasswordLink = page.getByText("Forgot your Password?");
    this.registerLink = page.getByRole("link", {
      name: "Register your account",
    });
    this.unmaskPasswordBtn = page.locator('button:has(svg[data-icon="eye"])');
    this.maskPasswordBtn = page.locator(
      'button:has(svg[data-icon="eye-slash"])'
    );
    this.myAccountHeading = page.getByRole("heading", { name: "My account" });
    this.navMenuBtn = page.locator('[data-test="nav-menu"]');
    this.usersPageBtn = page.locator('[data-test="nav-admin-users"]');
    this.signoutBtn = page.locator('[data-test="sign-out"]');
    this.loginError = page.locator('[data-test="login-error"]');

    // Initialize URL
    this.loginURL = "https://practicesoftwaretesting.com/auth/login";
  }

  async navigateToLoginPage() {
    await this.goto(this.loginURL);
  }

  getCurrentUserMenuBtn(firstName: string, lastName: string): Locator {
    return this.page.getByRole("button", { name: `${firstName} ${lastName}` });
  }

  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async login(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async togglePasswordVisibility() {
    const isPasswordVisible =
      (await this.passwordInput.getAttribute("type")) === "text";
    if (isPasswordVisible) {
      await this.maskPasswordBtn.click();
    } else {
      await this.unmaskPasswordBtn.click();
    }
  }

  async clickForgotPasswordLink() {
    await this.forgotPasswordLink.click();
  }

  async clickRegisterLink() {
    await this.registerLink.click();
  }

  async resetLoginAttempts(email: string) {
    // Log in to admin account
    // await this.login("admin@practicesoftwaretesting.com", "welcome01");

    // // Navigate to 'Users' page
    // await this.navMenuBtn.click();
    // await this.page.locator('[data-test="nav-admin-users"]').click();
    await this.page.waitForSelector(`table`);
    const userRow = this.page.locator(`table tbody tr`, {
      has: this.page.locator(`td`, { hasText: email }),
    });

    if ((await userRow.count()) === 0) {
      throw new Error(`User with email "${email}" not found.`);
    }

    await userRow.locator(`a:has-text("Edit")`).click();

    // Locate row containing the email from `userData`

    // Ensure the input field is visible and enabled

    // Scroll to the input field if necessary
    await this.page
      .locator("[data-test='failed_login_attempts']")
      .scrollIntoViewIfNeeded();

    // Fill the input field with 50
    await this.page.locator("[data-test='failed_login_attempts']").fill("50");
    await this.page.waitForTimeout(1000);
    // Ensure the Save button is enabled before clicking

    await this.page.locator('[data-test="user-submit"]').click();

    // Wait for confirmation message
    await this.page.getByText("User saved!").waitFor({ state: "visible" });

    // Optional: Check that the "User saved!" message is visible

    // Log out
    await this.navMenuBtn.click();
    await this.page.locator('[data-test="nav-sign-out"]').click();
  }

  async waitForButtonToBeEnabled(buttonLocator) {
    await this.page.waitForFunction(async (locator) => {
      const button = document.querySelector(locator);
      return button && !button.disabled;
    }, buttonLocator);
  }
}
