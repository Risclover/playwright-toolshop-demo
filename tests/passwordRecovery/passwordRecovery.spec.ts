import { test, expect } from "./passwordRecovery.fixtures";
import { userData } from "../../test-data/loginData";

test.describe("Password Recovery Tests", () => {
  // Password recovery form elements are rendered
  test("Password recovery page elements are displayed", async ({
    passwordRecoveryPage,
  }) => {
    // Email field should be rendered
    await expect(passwordRecoveryPage.emailInput).toBeVisible();

    // Submit button should be rendered
    await expect(passwordRecoveryPage.submitButton).toBeVisible();
  });

  // Email error element is not rendered upon initial page load
  test("Email error element is not displayed", async ({
    passwordRecoveryPage,
  }) => {
    // Email error element should not be rendered
    await expect(passwordRecoveryPage.emailError).not.toBeVisible();
  });

  // Email field's 'Required' error appears when the user clicks the submit button while the email field is empty
  test("Submitting without email shows required error", async ({
    passwordRecoveryPage,
  }) => {
    await passwordRecoveryPage.clickSubmitButton();
    await expect(passwordRecoveryPage.emailError).toHaveText(
      "Email is required"
    );
  });

  // Form submits successfully when email field contains an email associated with an existing account
  test("Valid email in password reset form sends request successfully", async ({
    passwordRecoveryPage,
  }) => {
    const [request] = await Promise.all([
      passwordRecoveryPage.waitForForgotPasswordRequest(),
      passwordRecoveryPage.requestPasswordReset(userData.user1.email),
    ]);

    const response = await request.response();
    if (response) {
      // Expect 200 status code
      expect(response.status()).toBe(200);

      const responseBody = await response.json();

      // Expect response to be object containing `success: true`
      expect(responseBody).toEqual(
        expect.objectContaining({
          success: true,
        })
      );
    } else {
      throw new Error("No response received for the forgot-password request");
    }
  });
});
