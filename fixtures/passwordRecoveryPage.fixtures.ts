import { test as baseTest, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { PasswordRecoveryPage } from "../page-objects/PasswordRecoveryPage";
import { CommonComponents } from "../page-objects/CommonComponents";
import { Selectors } from "../page-objects/selectors";

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
}

interface ExampleStrings {
  exampleEmail: string;
  examplePassword: string;
}

const test = baseTest.extend<{
  loginPage: LoginPage;
  passwordRecoveryPage: PasswordRecoveryPage;
  commonComponents: CommonComponents;
  userData: UserData;
  exampleStrings: ExampleStrings;
}>({
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
  passwordRecoveryPage: async ({ page }, use) => {
    const passwordRecoveryPage = new PasswordRecoveryPage(page);
    await page.goto("https://practicesoftwaretesting.com/auth/forgot-password");
    await use(passwordRecoveryPage);
  },
  commonComponents: async ({ page }, use) => {
    const commonComponents = new CommonComponents(page);
    await use(commonComponents);
  },
});

export { test, expect };
