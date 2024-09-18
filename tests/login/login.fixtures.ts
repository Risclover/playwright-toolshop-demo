// tests/login/login.fixtures.ts
import { expect } from "@playwright/test";
import { LoginPage } from "../../page-objects/LoginPage";
import { test as base } from "../shared/base.fixtures";

const test = base.extend<{
  loginPage: LoginPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await use(loginPage);
  },
});

export { test, expect };
