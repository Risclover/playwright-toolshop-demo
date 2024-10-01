import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../../page-objects/LoginPage";
import { RegistrationPage } from "../../page-objects/RegistrationPage";
import { PasswordRecoveryPage } from "../../page-objects/PasswordRecoveryPage";
import {
  userData,
  UserData,
  exampleStrings,
  ExampleStrings,
} from "../../test-data/loginData";

type TestFixtures = {
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
  passwordRecoveryPage: PasswordRecoveryPage;
  userData: UserData;
  exampleStrings: ExampleStrings;
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

  userData: async ({}, use) => {
    await use(userData);
  },

  exampleStrings: async ({}, use) => {
    await use(exampleStrings);
  },
});

export { test, expect };
