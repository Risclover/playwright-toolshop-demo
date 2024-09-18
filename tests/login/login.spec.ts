// tests/login/login.spec.ts
import { test, expect } from "./login.fixtures";

test.describe("Login Page Tests", () => {
  test("Logs in successfully with valid credentials", async ({
    loginPage,
    userData,
  }) => {
    // Log in with user2's email and password
    await loginPage.login(userData.user2.email, userData.user2.password);

    // Identify menu button by user2's full name
    const currentUserMenuBtn = loginPage.getCurrentUserMenuBtn(
      userData.user2.firstName,
      userData.user2.lastName
    );

    // Expect user2's menu button to be visible
    await expect(currentUserMenuBtn).toBeVisible();

    // Expect 'My Account' to be visible
    await expect(loginPage.myAccountHeading).toBeVisible();
  });

  // Ensure all elements are rendered
  test("Login form elements are rendered", async ({ loginPage }) => {
    // Email input
    await expect(loginPage.emailInput).toBeVisible();
    // Password input
    await expect(loginPage.passwordInput).toBeVisible();
    // Login button
    await expect(loginPage.loginButton).toBeVisible();
  });

  test("Invalid login shows error messages", async ({ loginPage }) => {
    // Click the 'Login' button without filling out the form fields
    await loginPage.clickLoginButton();

    // Both email and password should be required, according to error messages
    await expect(loginPage.emailError).toHaveText("Email is required");
    await expect(loginPage.passwordError).toHaveText("Password is required");
  });

  test("Short password results in error", async ({ loginPage }) => {
    // Enter short password
    await loginPage.enterPassword("aa");

    // Click login button
    await loginPage.clickLoginButton();

    // Expect relevant error messagee
    await expect(loginPage.passwordError).toHaveText(
      "Password length is invalid"
    );
  });

  test("Valid password does not show error", async ({
    loginPage,
    exampleStrings,
  }) => {
    // Enter valid password
    await loginPage.enterPassword(exampleStrings.examplePassword);

    // Click login button
    await loginPage.clickLoginButton();

    // Expect error element not to be visible
    await expect(loginPage.passwordError).not.toBeVisible();
  });

  test("Invalid email format results in error", async ({ loginPage }) => {
    // Enter email that is formatted incorrectly
    await loginPage.enterEmail("aaa");

    // Click login button
    await loginPage.clickLoginButton();

    // Expect relevant error
    await expect(loginPage.emailError).toHaveText("Email format is invalid");
  });

  test("Valid email format does not show error", async ({
    loginPage,
    exampleStrings,
  }) => {
    // Enter valid email
    await loginPage.enterEmail(exampleStrings.exampleEmail);
    // Click login button
    await loginPage.clickLoginButton();

    // Expect error element not to be visible
    await expect(loginPage.emailError).not.toBeVisible();
  });

  test("Register link navigates to registration page", async ({
    page,
    loginPage,
  }) => {
    // Click link to go to registration page
    await loginPage.clickRegisterLink();

    // Expect URL to match registration URL
    await expect(page).toHaveURL(
      "https://practicesoftwaretesting.com/auth/register"
    );
  });

  test("Password visibility toggle works correctly", async ({
    loginPage,
    exampleStrings,
  }) => {
    // Enter password
    await loginPage.enterPassword(exampleStrings.examplePassword);

    // Password field should have 'password' type (password is censored)
    await expect(loginPage.passwordInput).toHaveAttribute("type", "password");

    // Click password visibility toggle
    await loginPage.togglePasswordVisibility();

    // Password field should have 'text' type (password is not censored)
    await expect(loginPage.passwordInput).toHaveAttribute("type", "text");

    // Click password visibility toggle
    await loginPage.togglePasswordVisibility();

    // Password field should be back to 'password' type (censored)
    await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
  });

  test("Forgot password link navigates to reset page", async ({
    page,
    loginPage,
  }) => {
    // Click 'forgot password' link
    await loginPage.clickForgotPasswordLink();

    // Expect URL to match 'forgot password' URL
    await expect(page).toHaveURL(
      "https://practicesoftwaretesting.com/auth/forgot-password"
    );
  });

  test("Account locks after multiple failed login attempts", async ({
    loginPage,
    userData,
  }) => {
    // Attempt login 3 times using a valid email and incorrect password
    for (let i = 0; i < 4; i++) {
      await loginPage.login(userData.user1.email, "wrongpassword");
    }

    // Expect "account locked" error message
    await expect(loginPage.loginError).toHaveText(
      "Account locked, too many failed attempts. Please contact the administrator."
    );
  });
});
