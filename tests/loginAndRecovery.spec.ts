import { test, expect } from "../fixtures";
import { webkit } from "@playwright/test";

let browser;
let context;
let page;

test.describe("Login and recovery", () => {
  test.beforeEach(async () => {
    browser = await webkit.launch();
    context = await browser.newContext();
  });

  test.afterEach(async () => {
    await browser.close();
  });

  test("Logs in successfully with valid credentials", async ({
    loginAndRecovery,
    userData,
  }) => {
    await loginAndRecovery.login(userData.user2.email, userData.user2.password);

    await expect(loginAndRecovery.currentUserMenuBtn).toBeVisible();
    await expect(loginAndRecovery.myAccountHeading).toBeVisible();
  });

  test("Login forms are rendered", async ({ loginAndRecovery }) => {
    await expect(loginAndRecovery.emailInput).toBeVisible({ timeout: 60000 });
    await expect(loginAndRecovery.passwordInput).toBeVisible();
    await expect(loginAndRecovery.loginButton).toBeVisible();
  });

  test("Invalid login", async ({ loginAndRecovery }) => {
    await loginAndRecovery.clickLoginButton();

    await expect(loginAndRecovery.emailError).toHaveText("Email is required");
    await expect(loginAndRecovery.passwordError).toHaveText(
      "Password is required"
    );
  });

  test("Entering a password with less than 3 characters results in error", async ({
    loginAndRecovery,
  }) => {
    await loginAndRecovery.enterPassword("aa");
    await loginAndRecovery.clickLoginButton();

    await expect(loginAndRecovery.passwordError).toHaveText(
      "Password length is invalid"
    );
  });

  test("Entering a password with 3 characters or more doesn't result in an error", async ({
    loginAndRecovery,
    exampleStrings,
  }) => {
    await loginAndRecovery.enterPassword(exampleStrings.examplePassword);
    await loginAndRecovery.clickLoginButton();

    await expect(loginAndRecovery.passwordError).not.toBeVisible();
  });

  test("Entering an invalid email format results in error", async ({
    loginAndRecovery,
  }) => {
    await loginAndRecovery.enterEmail("aaa");
    await loginAndRecovery.clickLoginButton();

    await expect(loginAndRecovery.emailError).toHaveText(
      "Email format is invalid"
    );
  });

  test("Entering a valid email format does not result in error", async ({
    loginAndRecovery,
    exampleStrings,
  }) => {
    await loginAndRecovery.enterEmail(exampleStrings.exampleEmail);
    await loginAndRecovery.clickLoginButton();

    await expect(loginAndRecovery.emailError).not.toBeVisible();
  });

  test("Clicking the 'register your account' button brings the user to the registration page", async ({
    page,
    loginAndRecovery,
  }) => {
    await loginAndRecovery.clickRegisterBtn();

    await expect(page).toHaveURL(loginAndRecovery.registrationURL);
  });

  test("Clicking the 'view password' button unmasks the password", async ({
    loginAndRecovery,
    exampleStrings,
  }) => {
    const passwordInput = loginAndRecovery.passwordInput;
    await passwordInput.fill(exampleStrings.examplePassword);

    await expect(passwordInput).toHaveAttribute("type", "password");

    await loginAndRecovery.clickUnmaskPasswordBtn();

    await expect(passwordInput).toHaveAttribute("type", "text");

    await loginAndRecovery.clickMaskPasswordBtn();

    await expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("Clicking 'Forgot your password?' takes the user to the password reset page", async ({
    page,
    loginAndRecovery,
  }) => {
    await loginAndRecovery.clickForgotPasswordBtn();

    await expect(page).toHaveURL(loginAndRecovery.forgotPasswordURL);
  });

  test("Entering an invalid email into the password reset form results in an error", async ({
    page,
    loginAndRecovery,
    exampleStrings,
  }) => {
    await page.goto(loginAndRecovery.forgotPasswordURL);
    await loginAndRecovery.enterForgotPasswordEmail(
      exampleStrings.exampleEmail
    );
    await loginAndRecovery.clickSetNewPasswordBtn();

    await expect(loginAndRecovery.forgotPasswordError).toBeVisible();
  });

  test("Entering a valid email into the password reset form results in a success message", async ({
    page,
    loginAndRecovery,
    userData,
  }) => {
    await page.goto(loginAndRecovery.forgotPasswordURL);

    const [request] = await Promise.all([
      loginAndRecovery.waitForForgotPasswordRequest(),
      loginAndRecovery.forgotPasswordEmailInput.fill(userData.user1.email),
      page.click('input[type="submit"]'),
    ]);

    const response = await request.response();

    if (response) {
      const responseBody = await response.json();
      expect(responseBody.success).toBe(true);
    } else {
      throw new Error("No response received for the forgot-password request");
    }
  });
});
