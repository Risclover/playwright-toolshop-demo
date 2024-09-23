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
  public signOutBtn: Locator;
  public loginError: Locator;
  public signInBtn: Locator;

  // URLs
  public loginURL: string;

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
    this.signInBtn = page.locator('[data-test="nav-sign-in"]');
    this.signOutBtn = page.locator('[data-test="sign-out"]');
    this.loginError = page.locator('[data-test="login-error"]');

    // Initialize URLs
    this.loginURL = "https://practicesoftwaretesting.com/auth/login";
  }

  // Navigate to login form
  async navigateToLoginPage() {
    await this.goto(this.loginURL);
  }

  // Get current menu button element based on user's name
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
  async clickLoginButton() {
    await this.loginButton.click();
  }

  // Log into account using given email and password
  async login(email: string, password: string) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  // Log out of account
  async logout() {
    await this.navMenuBtn.click();
    await this.page.locator('[data-test="nav-sign-out"]').click();
  }

  // Toggle password visibility by clicking button
  async togglePasswordVisibility() {
    const isPasswordVisible =
      (await this.passwordInput.getAttribute("type")) === "text";
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
}
