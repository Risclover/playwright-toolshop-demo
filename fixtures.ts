import { test as baseTest, expect } from "@playwright/test";
import { LoginAndRecovery } from "./page-objects/loginAndRecovery";

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
  loginAndRecovery: LoginAndRecovery;
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
  loginAndRecovery: async ({ page, userData }, use) => {
    const loginAndRecovery = new LoginAndRecovery(page, userData);
    await loginAndRecovery.goto();
    await use(loginAndRecovery);
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
