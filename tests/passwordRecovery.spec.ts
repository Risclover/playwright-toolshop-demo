// tests/passwordRecovery.spec.ts
import { test, expect } from "../fixtures/passwordRecovery.fixtures";

test.describe("Password Recovery Tests", () => {
  test("Password recovery page elements are displayed", async ({
    passwordRecoveryPage,
  }) => {
    await expect(passwordRecoveryPage.emailInput).toBeVisible();
    await expect(passwordRecoveryPage.submitButton).toBeVisible();
    await expect(passwordRecoveryPage.emailError).not.toBeVisible();
  });

  test("Submitting without email shows required error", async ({
    passwordRecoveryPage,
  }) => {
    await passwordRecoveryPage.clickSubmitButton();
    await expect(passwordRecoveryPage.emailError).toHaveText(
      "Email is required"
    );
  });

  test("Valid email in password reset sends request successfully", async ({
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
