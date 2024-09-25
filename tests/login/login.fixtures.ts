// tests/login/login.fixtures.ts
import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../../page-objects/LoginPage";

const test = base.extend<{
  loginPage: LoginPage;
}>({
  loginPage: async ({ page }, use) => {
    // Create an instance of loginPage
    const loginPage = new LoginPage(page);

    // Navigate to login page
    await loginPage.navigateToLoginPage();

    // use loginPage in tests
    await use(loginPage);
  },
});

export { test, expect };
