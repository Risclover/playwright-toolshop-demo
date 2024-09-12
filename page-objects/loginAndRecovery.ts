import { Locator, Page } from "@playwright/test";

interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UserData {
  user1: User;
  user2: User;
}

export class LoginAndRecovery {
  public page: Page;
  public userData: UserData;
  public emailInput: Locator;
  public passwordInput: Locator;
  public loginButton: Locator;
  public navMenu: Locator;
  public loginURL: string;
  public unmaskPasswordBtn: Locator;
  public forgotPasswordURL: string;
  public emailErrorSelector: string;
  public passwordErrorSelector: string;

  constructor(page: Page, userData: UserData) {
    this.page = page;
    this.userData = userData;
    this.emailInput = page.getByPlaceholder("Your email");
    this.passwordInput = page.getByPlaceholder("Your password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.navMenu = page.locator('[data-test="nav-menu"]');
    this.loginURL = "https://practicesoftwaretesting.com/auth/login";
    this.unmaskPasswordBtn = page.locator('[data-test="login-form"] button');
    this.forgotPasswordURL =
      "https://practicesoftwaretesting.com/auth/forgot-password";
    this.emailErrorSelector = "[data-test='email-error']";
    this.passwordErrorSelector = "[data-test='password-error']";
  }

  async goto() {
    await this.page.goto(this.loginURL);
  }

  async enterEmail(email) {
    await this.emailInput.fill(email);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async login(email, password) {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async logout() {
    await this.navMenu.click();

    await this.page.locator('[data-test="nav-sign-out"]').click();
  }

  async clickUnmaskPassword() {
    await this.unmaskPasswordBtn.click();
  }
}
