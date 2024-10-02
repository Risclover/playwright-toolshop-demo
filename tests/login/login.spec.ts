import { test, expect } from "./login.fixtures";

test.describe("Login Page Tests", () => {
  test("Logs in successfully with valid credentials", async ({
    page,
    loginPage,
    userData,
  }) => {
    // Log in using user2's email and password
    await loginPage.login(userData.user2.email, userData.user2.password);

    // Identify the menu button via current user's full name
    const currentUserMenuBtn = loginPage.getCurrentUserMenuBtn(
      userData.user2.firstName,
      userData.user2.lastName
    );

    // Make sure the current user's menu button is visible
    await page.waitForSelector(".nav-link.dropdown-toggle", {
      state: "visible",
    });
    await expect(currentUserMenuBtn).toBeVisible();

    // Verify that the 'My Account' heading is visible
    await expect(loginPage.myAccountHeading).toBeVisible();
  });

  test("Login form elements are rendered", async ({ loginPage }) => {
    // Check that each form element is rendered
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginBtn).toBeVisible();
  });

  test("Invalid login shows error messages", async ({ loginPage }) => {
    // Click the 'Login' button (without filling out the form fields)
    await loginPage.clickloginBtn();

    // Check that submission with a blank email field results in 'email required' error
    await expect(loginPage.emailError).toHaveText("Email is required");

    // Check that submission with a blank password field results in 'password required' error
    await expect(loginPage.passwordError).toHaveText("Password is required");
  });

  test("Short password results in error", async ({ loginPage }) => {
    // Fill in password field with a short password
    await loginPage.enterPassword("aa");

    // Submit form
    await loginPage.clickloginBtn();

    // Check that password error appears and has correct text
    await expect(loginPage.passwordError).toBeVisible();
    await expect(loginPage.passwordError).toHaveText(
      "Password length is invalid"
    );
  });

  test("Valid password does not show error", async ({
    loginPage,
    exampleStrings,
  }) => {
    // Fill in password field with valid password
    await loginPage.enterPassword(exampleStrings.examplePassword);

    // Submit form
    await loginPage.clickloginBtn();

    // Check that password error is not visible
    await expect(loginPage.passwordError).not.toBeVisible();
  });

  test("Invalid email format results in error", async ({ loginPage }) => {
    // Fill in email field with an invalid email format
    await loginPage.enterEmail("aaa");

    // Submit form
    await loginPage.clickloginBtn();

    // Check that email error appears and has correct text
    await expect(loginPage.emailError).toBeVisible();
    await expect(loginPage.emailError).toHaveText("Email format is invalid");
  });

  test("Valid email format does not show error", async ({
    loginPage,
    exampleStrings,
  }) => {
    // Fill in email field with valid email format
    await loginPage.enterEmail(exampleStrings.exampleEmail);

    // Submit form
    await loginPage.clickloginBtn();

    // Check that email error is not visible
    await expect(loginPage.emailError).not.toBeVisible();
  });

  test("Register link navigates to registration page", async ({
    page,
    loginPage,
    registrationPage,
  }) => {
    // Navigate to registration page (from login page)
    await loginPage.clickRegisterLink();

    // Check that browser URL matches the registration page's URL
    await expect(page).toHaveURL(registrationPage.registrationURL);
  });

  test("Password visibility toggle works correctly", async ({
    loginPage,
    exampleStrings,
  }) => {
    // Fill in password field with example password
    await loginPage.enterPassword(exampleStrings.examplePassword);

    // Check that the password input field has a type of 'password' (aka password is masked)
    await expect(loginPage.passwordInput).toHaveAttribute("type", "password");

    // Click password visibility toggle button
    await loginPage.togglePasswordVisibility();

    // Check that the password field now has a type of 'text' (aka password is unmasked)
    await expect(loginPage.passwordInput).toHaveAttribute("type", "text");

    // Click password visibility toggle button
    await loginPage.togglePasswordVisibility();

    // Check that the password field has a type of 'password' again (aka password is masked)
    await expect(loginPage.passwordInput).toHaveAttribute("type", "password");
  });

  test("Forgot password link navigates to reset page", async ({
    page,
    loginPage,
    passwordRecoveryPage,
  }) => {
    // Navigate to the password recovery page (from the login page)
    await loginPage.clickForgotPasswordLink();

    // Check that the browser's URL matches the password recovery page's URL
    await expect(page).toHaveURL(passwordRecoveryPage.forgotPasswordURL);
  });

  test("Account locks after multiple failed login attempts", async ({
    page,
    loginPage,
    userData,
  }) => {
    // Attempt invalid login 4 times to trigger 'Account locked' message
    for (let i = 0; i < 4; i++) {
      // Attempt login with valid email and invalid password
      await loginPage.login(userData.user1.email, "wrongpassword");

      // Allow website enough time to register each attempt
      await page.waitForTimeout(1000);
    }

    // Check that 'Account locked' error message appears
    await expect(loginPage.loginError).toHaveText(
      "Account locked, too many failed attempts. Please contact the administrator."
    );

    // Reset login attempts (so that future tests aren't affected)
    await loginPage.resetUserLoginAttempts(userData.user1.email);
  });
});
