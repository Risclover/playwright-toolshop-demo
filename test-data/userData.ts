// test-data/userData.ts
import { UserData } from "../page-objects/RegistrationPage";

export const defaultUserData: UserData = {
  firstName: "John",
  lastName: "Doe",
  dateOfBirth: "1990-01-01",
  address: "123 Main St",
  postcode: "12345",
  city: "Anytown",
  state: "State",
  country: "US",
  phone: "5551234567",
  email: "user@example.com",
  password: "Psswd1?!",
};

export function generateUniqueUserData(): UserData {
  const timestamp = Date.now();
  return {
    ...defaultUserData,
    email: `user${timestamp}@example.com`,
  };
}
