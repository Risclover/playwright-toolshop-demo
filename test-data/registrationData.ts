// test-data/userData.ts
import { UserData } from "../page-objects/RegistrationPage";

// All info required to register for an account
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

// Generate unique email (to allow for infinite testing)
export function generateUniqueUserData(): UserData {
  const timestamp = Date.now();
  return {
    ...defaultUserData,
    email: `user${timestamp}@example.com`,
  };
}

// Error messages for form fields
export const errorMessages = {
  requiredFields: {
    "first-name-error": "First name is required",
    "last-name-error": "fields.last-name.required",
    "dob-error": "Date of Birth is required",
    "address-error": "Address is required",
    "postcode-error": "Postcode is required",
    "city-error": "City is required",
    "state-error": "State is required",
    "country-error": "Country is required",
    "phone-error": " Phone is required.",
    "email-error": "Email is required",
    "password-error": "Password is required",
  },

  validationErrors: {
    firstNameTooLong:
      "The first name field must not be greater than 40 characters.",
    lastNameTooLong:
      "The last name field must not be greater than 20 characters.",
    userTooYoung: "Customer must be 18 years old.",
    userTooOld: "Customer must be younger than 75 years old.",
    addressTooLong: "The address field must not be greater than 70 characters.",
    cityTooLong: "The city field must not be greater than 40 characters.",
    stateTooLong: "The state field must not be greater than 40 characters.",
    postcodeTooLong:
      "The postcode field must not be greater than 10 characters.",
    emailExists: "A customer with this email address already exists.",
    passwordTooShort: "The password field must be at least 8 characters.",
    passwordCaseRequirement:
      "The password field must contain at least one uppercase and one lowercase letter.",
    passwordSymbolRequirement:
      "The password field must contain at least one symbol.",
    passwordNumberRequirement:
      "The password field must contain at least one number.",
    phoneNumbersOnly: "Only numbers are allowed.",
    phoneTooLong: "The phone field must not be greater than 24 characters.",
  },
};
