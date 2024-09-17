// tests/login/login.spec.ts
import { test, expect } from "./login.fixtures";

test.describe("Login Page Tests", () => {
  test("Logs in successfully with valid credentials", async ({
    loginPage,
    userData,
  }) => {
    await loginPage.login(userData.user2.email, userData.user2.password);

    const currentUserMenuBtn = loginPage.getCurrentUserMenuBtn(
      userData.user2.firstName,
      userData.user2.lastName
    );
    await expect(currentUserMenuBtn).toBeVisible();
    await expect(loginPage.myAccountHeading).toBeVisible();
  });

  test("Login forms are rendered", async ({ loginPage }) => {
    await expect(loginPage.emailInput).toBeVisible({ timeout: 60000 });
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test("Invalid login shows error messages", async ({ loginPage }) => {
    await loginPage.clickLoginButton();

    await expect(loginPage.emailError).toHaveText("Email is required");
    await expect(loginPage.passwordError).toHaveText("Password is required");
  });

  test("Short password results in error", async ({ loginPage }) => {
    await loginPage.enterPassword("aa");
    await loginPage.clickLoginButton();

    await expect(loginPage.passwordError).toHaveText(
      "Password length is invalid"
    );
  });

  test("Valid password does not show error", async ({
    loginPage,
    exampleStrings,
  }) => {
    await loginPage.enterPassword(exampleStrings.examplePassword);
    await loginPage.clickLoginButton();

    await expect(loginPage.passwordError).not.toBeVisible();
  });

  test("Invalid email format results in error", async ({ loginPage }) => {
    await loginPage.enterEmail("aaa");
    await loginPage.clickLoginButton();

    await expect(loginPage.emailError).toHaveText("Email format is invalid");
  });

  test("Valid email format does not show error", async ({
    loginPage,
    exampleStrings,
  }) => {
    await loginPage.enterEmail(exampleStrings.exampleEmail);
    await loginPage.clickLoginButton();

    await expect(loginPage.emailError).not.toBeVisible();
  });

  test("Register link navigates to registration page", async ({
    page,
    loginPage,
  }) => {
    await loginPage.clickRegisterLink();
    await expect(page).toHaveURL(
      "https://practicesoftwaretesting.com/auth/register"
    );
  });

  test("Password visibility toggle works correctly", async ({
    loginPage,
    exampleStrings,
  }) => {
    await loginPage.enterPassword(exampleStrings.examplePassword);
    await expect(loginPage.passwordInput).toHaveAttribute("type", "password");

    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute("type", "text");

    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
  });

  test("Forgot password link navigates to reset page", async ({
    page,
    loginPage,
  }) => {
    await loginPage.clickForgotPasswordLink();
    await expect(page).toHaveURL(
      "https://practicesoftwaretesting.com/auth/forgot-password"
    );
  });

  test("Account locks after multiple failed login attempts", async ({
    loginPage,
    userData,
  }) => {
    for (let i = 0; i < 4; i++) {
      await loginPage.login(userData.user1.email, "wrongpassword");
    }

    await expect(loginPage.loginError).toHaveText(
      "Account locked, too many failed attempts. Please contact the administrator."
    );
  });

  // test("Reset login attempts", async ({ loginPage, userData }) => {
  //   await loginPage.login(userData.admin.email, userData.admin.password);
  //   const currentUserMenuBtn = loginPage.getCurrentUserMenuBtn(
  //     userData.admin.firstName,
  //     userData.admin.lastName
  //   );
  //   await expect(currentUserMenuBtn).toBeVisible();
  //   await currentUserMenuBtn.click();

  //   await loginPage.usersPageBtn.click();

  //   await loginPage.resetLoginAttempts(userData.user2.email);
  // });
});
