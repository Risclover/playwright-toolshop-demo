export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserData {
  user1: User;
  user2: User;
  admin: User;
}

/** All valid data for user accounts on practicesoftwaretesting.com so we can run through our tests without issues (for example, testing the account lock feature would be with 1 user and other activities with the other so the account isn't locked out for subsequent/repeat tests) **/
export const userData: UserData = {
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

export interface ExampleStrings {
  exampleEmail: string;
  examplePassword: string;
}

// Email and password for non-existing account
export const exampleStrings: ExampleStrings = {
  exampleEmail: "example@gmail.com",
  examplePassword: "mysecretpassword",
};
