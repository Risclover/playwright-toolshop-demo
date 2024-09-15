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
  public currentUserMenuBtn: Locator;
  public myAccountHeading: Locator;
  public emailInput: Locator;
  public passwordInput: Locator;
  public loginButton: Locator;
  public navMenu: Locator;
  public loginURL: string;
  public unmaskPasswordBtn: Locator;
  public maskPasswordBtn: Locator;
  public forgotPasswordURL: string;
  public emailError: Locator;
  public passwordError: Locator;
  public forgotPasswordAPI: string;
  public forgotPasswordEmailInput: Locator;
  public exampleEmail: string;
  public setNewPasswordBtn: Locator;
  public forgotPasswordError: Locator;
  public forgotPasswordBtn: Locator;
  public registerBtn: Locator;
  public registrationURL: string;

  constructor(page: Page, userData: UserData) {
    this.page = page;
    this.userData = userData;
    this.currentUserMenuBtn = page.getByRole("button", {
      name: `${userData.user2.firstName} ${userData.user2.lastName}`,
    });
    this.myAccountHeading = page.getByRole("heading", { name: "My account" });
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
    this.emailError = page.locator("[data-test='email-error']");
    this.passwordError = page.locator("[data-test='password-error']");
    this.forgotPasswordAPI =
      "https://api.practicesoftwaretesting.com/users/forgot-password";
    this.forgotPasswordEmailInput = page.getByPlaceholder("Your email *");
    this.setNewPasswordBtn = page.getByRole("button", {
      name: "Set New Password",
    });
    this.forgotPasswordError = page.getByText("The selected email is invalid");
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
    return this.page.waitForRequest(this.forgotPasswordAPI);
  }

  async clickForgotPasswordBtn() {
    await this.forgotPasswordBtn.click();
  }

  async clickRegisterBtn() {
    await this.registerBtn.click();
  }

  async clickSetNewPasswordBtn() {
    await this.setNewPasswordBtn.click();
  }

  async enterForgotPasswordEmail(email: string) {
    await this.forgotPasswordEmailInput.fill(email);
  }
}
