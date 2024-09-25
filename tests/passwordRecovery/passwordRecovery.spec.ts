// tests/passwordRecovery.spec.ts
import { test, expect } from "./passwordRecovery.fixtures";

test.describe("Password Recovery Tests", () => {
  // Password recovery form elements are rendered
  test("Password recovery page elements are displayed", async ({
    passwordRecoveryPage,
  }) => {
    await expect(passwordRecoveryPage.emailInput).toBeVisible();
    await expect(passwordRecoveryPage.submitButton).toBeVisible();
    await expect(passwordRecoveryPage.emailError).not.toBeVisible();
  });

  // 'Required' error appears when the user clicks the submit button while the email field is empty
  test("Submitting without email shows required error", async ({
    passwordRecoveryPage,
  }) => {
    await passwordRecoveryPage.clickSubmitButton();
    await expect(passwordRecoveryPage.emailError).toHaveText(
      "Email is required"
    );
  });

  // Form submits for email associated with an account
  test("Valid email in password reset form sends request successfully", async ({
    passwordRecoveryPage,
    userData,
  }) => {
    const [request] = await Promise.all([
      passwordRecoveryPage.waitForForgotPasswordRequest(),
      passwordRecoveryPage.requestPasswordReset(userData.user1.email),
    ]);

    const response = await request.response();
    if (response) {
      expect(response.status()).toBe(200);
      const responseBody = await response.json();
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
