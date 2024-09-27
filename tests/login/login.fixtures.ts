import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../../page-objects/LoginPage";
import { RegistrationPage } from "../../page-objects/RegistrationPage";
import { PasswordRecoveryPage } from "../../page-objects/PasswordRecoveryPage";

type TestFixtures = {
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
  passwordRecoveryPage: PasswordRecoveryPage;
};

const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
  },

  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page);
    await use(registrationPage);
  },

  passwordRecoveryPage: async ({ page }, use) => {
    const passwordRecoveryPage = new PasswordRecoveryPage(page);
    await use(passwordRecoveryPage);
  },
});

export { test, expect };
