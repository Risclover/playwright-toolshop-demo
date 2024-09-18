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

export const exampleStrings: ExampleStrings = {
  exampleEmail: "example@gmail.com",
  examplePassword: "mysecretpassword",
};
