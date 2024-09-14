import { test, expect } from "../fixtures";
import { LoginAndRecovery } from "../page-objects/loginAndRecovery";
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
    page,
    userData,
  }) => {
    await loginAndRecovery.login(userData.user2.email, userData.user2.password);

    await expect(
      page.getByRole("button", {
        name: `${userData.user2.firstName} ${userData.user2.lastName}`,
      })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "My account" })
    ).toBeVisible();
  });

  test("Login forms are rendered", async ({ loginAndRecovery }) => {
    await expect(loginAndRecovery.emailInput).toBeVisible({ timeout: 60000 });
    await expect(loginAndRecovery.passwordInput).toBeVisible();
    await expect(loginAndRecovery.loginButton).toBeVisible();
  });

  test("Invalid login", async ({ page, loginAndRecovery }) => {
    await loginAndRecovery.clickLoginButton();
    await expect(page.locator(loginAndRecovery.emailErrorSelector)).toHaveText(
      "Email is required"
    );
    await expect(
      page.locator(loginAndRecovery.passwordErrorSelector)
    ).toHaveText("Password is required");
  });

  test("Entering a password with less than 3 characters results in error", async ({
    page,
    loginAndRecovery,
  }) => {
    await loginAndRecovery.enterPassword("aa");
    await loginAndRecovery.clickLoginButton();

    await expect(
      page.locator(loginAndRecovery.passwordErrorSelector)
    ).toHaveText("Password length is invalid");
  });

  test("Entering a password with 3 characters or more doesn't result in an error", async ({
    page,
    loginAndRecovery,
  }) => {
    await loginAndRecovery.enterPassword("aaa");
    await loginAndRecovery.clickLoginButton();
    await expect(
      page.locator(loginAndRecovery.passwordErrorSelector)
    ).not.toBeVisible();
  });

  test("Entering an invalid email format results in error", async ({
    page,
    loginAndRecovery,
  }) => {
    await loginAndRecovery.enterEmail("aaa");
    await loginAndRecovery.clickLoginButton();

    await expect(page.locator(loginAndRecovery.emailErrorSelector)).toHaveText(
      "Email format is invalid"
    );
  });

  test("Entering a valid email format does not result in error", async ({
    page,
    loginAndRecovery,
  }) => {
    await loginAndRecovery.enterEmail("example@gmail.com");
    await loginAndRecovery.clickLoginButton();

    await expect(
      page.locator(loginAndRecovery.emailErrorSelector)
    ).not.toBeVisible();
  });

  test("Clicking the 'register your account' button brings the user to the registration page", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "Register your account" }).click();

    await expect(page).toHaveURL(
      "https://practicesoftwaretesting.com/auth/register"
    );
  });

  test("Clicking the 'view password' button unmasks the password", async ({
    page,
    loginAndRecovery,
  }) => {
    const passwordInput = loginAndRecovery.passwordInput;
    await passwordInput.fill("mysecretpassword");

    await expect(passwordInput).toHaveAttribute("type", "password");

    const viewPasswordButton = page.locator('button:has(svg[data-icon="eye"])');
    await viewPasswordButton.click();

    await expect(passwordInput).toHaveAttribute("type", "text");

    await page.locator('button:has(svg[data-icon="eye-slash"])').click();

    await expect(passwordInput).toHaveAttribute("type", "password");
  });
});
