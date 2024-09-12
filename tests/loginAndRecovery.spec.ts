import { test, expect } from "@playwright/test";
import { LoginAndRecovery } from "../page-objects/loginAndRecovery";

test.describe("Login and recovery", async () => {
  let loginAndRecovery: LoginAndRecovery;

  const userData = {
    user1: {
      email: "customer@practicesoftwaretesting.com",
      password: "welcome01",
      firstName: "Jane",
      lastName: "Doe",
    },

    user2: {
      email: "customer2@practicesoftwaretesting.com",
      password: "welcome01",
      firstName: "Jack",
      lastName: "Howe",
    },
  };

  test.beforeEach(async ({ page }) => {
    loginAndRecovery = new LoginAndRecovery(page, userData);
    await loginAndRecovery.goto();
  });

  test("Logs in successfully with valid credentials", async ({ page }) => {
    await loginAndRecovery.login(userData.user2.email, userData.user2.password);

    await expect(
      page.getByRole("button", {
        name: `${userData.user2.firstName} + " " + ${userData.user2.lastName}`,
      })
    ).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "My account" })
    ).toBeVisible();
  });

  test("Login forms are rendered", async () => {
    await expect(loginAndRecovery.emailInput).toBeVisible();
    await expect(loginAndRecovery.passwordInput).toBeVisible();
    await expect(loginAndRecovery.loginButton).toBeVisible();
  });

  test("Invalid login", async ({ page }) => {
    await loginAndRecovery.clickLoginButton();
    await expect(page.locator(loginAndRecovery.emailErrorSelector)).toHaveText(
      "Email is required"
    );

    await expect(page.locator("[data-test='password-error']")).toHaveText(
      "Password is required"
    );
  });
});
