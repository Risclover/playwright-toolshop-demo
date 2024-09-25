export interface DefaultUserData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  password: string;
}

// Example user info, for filling out registration form
export const defaultUserData: DefaultUserData = {
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
export function generateUniqueUserData(): DefaultUserData {
  const timestamp = Date.now(); // Use current timestamp to generate unique email

  // Return object with defaultUserData's info, but replace email with our email generated from timestamp
  return {
    ...defaultUserData,
    email: `user${timestamp}@example.com`,
  };
}

// Error messages for form fields
export const errorMessages = {
  // Errors for each field when field is blank ('required' error messages)
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

  // Specific validation errors
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

// Data for field validation testing
export const fieldValidationTests = [
  {
    field: "firstName" as keyof DefaultUserData,
    testCases: [
      {
        value: "a".repeat(41),
        message: errorMessages.validationErrors.firstNameTooLong,
      },
    ],
    errorDataTest: "register-error",
  },
  {
    field: "lastName" as keyof DefaultUserData,
    testCases: [
      {
        value: "a".repeat(41),
        message: errorMessages.validationErrors.lastNameTooLong,
      },
    ],
    errorDataTest: "register-error",
  },
  {
    field: "dateOfBirth" as keyof DefaultUserData,
    testCases: [
      {
        value: "2024-01-01",
        message: errorMessages.validationErrors.userTooYoung,
      },
      {
        value: "1900-01-01",
        message: errorMessages.validationErrors.userTooOld,
      },
    ],
    errorDataTest: "register-error",
  },
  {
    field: "address" as keyof DefaultUserData,
    testCases: [
      {
        value: "a".repeat(71),
        message: errorMessages.validationErrors.addressTooLong,
      },
    ],
    errorDataTest: "register-error",
  },
  {
    field: "postcode" as keyof DefaultUserData,
    testCases: [
      {
        value: "a".repeat(11),
        message: errorMessages.validationErrors.postcodeTooLong,
      },
    ],
    errorDataTest: "register-error",
  },
  {
    field: "city" as keyof DefaultUserData,
    testCases: [
      {
        value: "a".repeat(41),
        message: errorMessages.validationErrors.cityTooLong,
      },
    ],
    errorDataTest: "register-error",
  },
  {
    field: "state" as keyof DefaultUserData,
    testCases: [
      {
        value: "a".repeat(41),
        message: errorMessages.validationErrors.stateTooLong,
      },
    ],
    errorDataTest: "register-error",
  },
  {
    field: "email" as keyof DefaultUserData,
    testCases: [
      {
        value: "customer@practicesoftwaretesting.com",
        message: errorMessages.validationErrors.emailExists,
      },
    ],
    errorDataTest: "register-error",
  },
  {
    field: "password" as keyof DefaultUserData,
    testCases: [
      {
        value: "Aaaa1!",
        message: errorMessages.validationErrors.passwordTooShort,
      },
      {
        value: "aaaaaa1!",
        message: errorMessages.validationErrors.passwordCaseRequirement,
      },
      {
        value: "Aaaaaaaa!",
        message: errorMessages.validationErrors.passwordNumberRequirement,
      },
      {
        value: "Aaaaaaaa1",
        message: errorMessages.validationErrors.passwordSymbolRequirement,
      },
    ],
    errorDataTest: "register-error",
  },
  {
    field: "phone" as keyof DefaultUserData,
    testCases: [
      {
        value: "111-111-1111",
        message: errorMessages.validationErrors.phoneNumbersOnly,
      },
    ],
    errorDataTest: "phone-error",
  },
];
