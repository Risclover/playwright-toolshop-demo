import { expect } from "@playwright/test";
import { LoginPage } from "../../page-objects/LoginPage";
import { test as base } from "../../fixtures/base.fixtures";

interface UserData {
  user1: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  user2: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
  admin: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
}

interface ExampleStrings {
  exampleEmail: string;
  examplePassword: string;
}

const test = base.extend<{
  loginPage: LoginPage;
  userData: UserData;
  exampleStrings: ExampleStrings;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await use(loginPage);
  },
  userData: async ({}, use) => {
    const userData: UserData = {
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
      admin: {
        email: "admin@practicesoftwaretesting.com",
        password: "welcome01",
        firstName: "John",
        lastName: "Doe",
      },
    };
    await use(userData);
  },
  exampleStrings: async ({}, use) => {
    const exampleStrings: ExampleStrings = {
      exampleEmail: "example@gmail.com",
      examplePassword: "mysecretpassword",
    };
    await use(exampleStrings);
  },
});

export { test, expect };
