// fixtures/baseFixtures.ts
import { test as baseTest } from "@playwright/test";

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

const test = baseTest.extend<{
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

export { test };
