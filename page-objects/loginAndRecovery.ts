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
  public maskPasswordBtn: Locator;
  public forgotPasswordURL: string;
  public emailErrorSelector: string;
  public passwordErrorSelector: string;
  public forgotPasswordAPI: string;
  public forgotPasswordEmailInput: Locator;
  public exampleEmail: string;
  public setNewPasswordBtn: Locator;
  public forgotPasswordErrorSelector: string;
  public forgotPasswordBtn: Locator;
  public registerBtn: Locator;
  public registrationURL: string;

  constructor(page: Page, userData: UserData) {
    this.page = page;
    this.userData = userData;
    this.emailInput = page.getByPlaceholder("Your email");
    this.passwordInput = page.getByPlaceholder("Your password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.navMenu = page.locator('[data-test="nav-menu"]');
    this.loginURL = "https://practicesoftwaretesting.com/auth/login";
    this.unmaskPasswordBtn = page.locator('button:has(svg[data-icon="eye"])');
    this.maskPasswordBtn = page.locator(
      'button:has(svg[data-icon="eye-slash"])'
    );
    this.forgotPasswordURL =
      "https://practicesoftwaretesting.com/auth/forgot-password";
    this.emailErrorSelector = "[data-test='email-error']";
    this.passwordErrorSelector = "[data-test='password-error']";
    this.forgotPasswordAPI =
      "https://api.practicesoftwaretesting.com/users/forgot-password";
    this.forgotPasswordEmailInput = page.getByPlaceholder("Your email *");
    this.exampleEmail = "example@gmail.com";
    this.setNewPasswordBtn = page.getByRole("button", {
      name: "Set New Password",
    });
    this.forgotPasswordErrorSelector = "The selected email is invalid";
    this.forgotPasswordBtn = page.getByText("Forgot your Password?");
    this.registerBtn = page.getByRole("link", {
      name: "Register your account",
    });
    this.registrationURL = "https://practicesoftwaretesting.com/auth/register";
  }

  async goto() {
    await this.page.goto(this.loginURL);
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

  async logout() {
    await this.navMenu.click();
    await this.page.locator('[data-test="nav-sign-out"]').click();
  }

  async clickUnmaskPasswordBtn() {
    await this.unmaskPasswordBtn.click();
  }

  async clickMaskPasswordBtn() {
    await this.maskPasswordBtn.click();
  }

  async waitForForgotPasswordRequest() {
    await this.page.waitForRequest(this.forgotPasswordAPI);
  }

  async clickForgotPasswordBtn() {
    await this.forgotPasswordBtn.click();
  }

  async clickRegisterBtn() {
    await this.registerBtn.click();
  }
}
