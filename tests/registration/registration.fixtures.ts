import { test as base } from "@playwright/test";
import { RegistrationPage } from "../../page-objects/RegistrationPage";
import { LoginPage } from "../../page-objects/LoginPage";
import {
  generateUniqueUserData,
  DefaultUserData,
  errorMessages,
  ErrorMessages,
} from "../../test-data/registrationData";

type TestFixtures = {
  registrationPage: RegistrationPage;
  loginPage: LoginPage;
  defaultUserData: DefaultUserData;
  errorMessages: ErrorMessages;
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

  defaultUserData: async ({}, use) => {
    const userData = generateUniqueUserData();
    await use(userData);
  },

  errorMessages: async ({}, use) => {
    await use(errorMessages);
  },
});

export { expect } from "@playwright/test";
