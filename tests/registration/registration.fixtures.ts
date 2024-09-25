import { test as base } from "@playwright/test";
import { RegistrationPage } from "../../page-objects/RegistrationPage";
import { LoginPage } from "../../page-objects/LoginPage";
import { generateUniqueUserData } from "../../test-data/registrationData";
import { UserData } from "../../page-objects/RegistrationPage";

type TestFixtures = {
  registrationPage: RegistrationPage;
  loginPage: LoginPage;
  userData: UserData;
};

export const test = base.extend<TestFixtures>({
  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.navigate();
    await use(registrationPage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  userData: async ({}, use) => {
    const userData = generateUniqueUserData();
    await use(userData);
  },
});

export { expect } from "@playwright/test";
