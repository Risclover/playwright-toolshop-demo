// tests/registration/registration.spec.ts
import { test, expect } from "./registration.fixtures";
import { errorMessages } from "./data/errorMessages";
import { UserData } from "../../page-objects/RegistrationPage";
import { generateUniqueUserData } from "../../test-data/userData";

test.describe("Registration Page Tests", () => {
  let defaultUserData = {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "1990-01-01",
    address: "123 Main St",
    postcode: "12345",
    city: "Anytown",
    state: "State",
    country: "US",
    phone: "5551234567",
    email: `user29@example.com`,
    password: "Pswrd12!",
  };

  test("Renders form elements correctly", async ({ registrationPage }) => {
    const inputs = [
      registrationPage.firstNameInput,
      registrationPage.lastNameInput,
      registrationPage.dateOfBirthInput,
      registrationPage.addressInput,
      registrationPage.postcodeInput,
      registrationPage.cityInput,
      registrationPage.stateInput,
      registrationPage.countryInput,
      registrationPage.phoneInput,
      registrationPage.emailInput,
      registrationPage.passwordInput,
    ];

    for (const input of inputs) {
      await expect(input).toBeVisible();
    }

    await expect(registrationPage.registerBtn).toBeVisible();
  });

  test("Validates required fields", async ({ registrationPage }) => {
    await registrationPage.goto();
    await registrationPage.registerBtn.click();

    for (const [dataTest, message] of Object.entries(
      errorMessages.requiredFields
    )) {
      const errorLocator = registrationPage.page.locator(
        `[data-test="${dataTest}"]`
      );
      await expect(errorLocator).toContainText(message);
    }
  });

  test.describe("Field Validation Tests", () => {
    const fieldValidationTests = [
      {
        field: "firstName" as keyof UserData,
        testCases: [
          {
            value: "a".repeat(41),
            message: errorMessages.validationErrors.firstNameTooLong,
          },
        ],
        errorDataTest: "register-error",
      },
      {
        field: "lastName" as keyof UserData,
        testCases: [
          {
            value: "a".repeat(41),
            message: errorMessages.validationErrors.lastNameTooLong,
          },
        ],
        errorDataTest: "register-error",
      },
      {
        field: "dateOfBirth" as keyof UserData,
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
        field: "address" as keyof UserData,
        testCases: [
          {
            value: "a".repeat(71),
            message: errorMessages.validationErrors.addressTooLong,
          },
        ],
        errorDataTest: "register-error",
      },
      {
        field: "postcode" as keyof UserData,
        testCases: [
          {
            value: "a".repeat(11),
            message: errorMessages.validationErrors.postcodeTooLong,
          },
        ],
        errorDataTest: "register-error",
      },
      {
        field: "city" as keyof UserData,
        testCases: [
          {
            value: "a".repeat(41),
            message: errorMessages.validationErrors.cityTooLong,
          },
        ],
        errorDataTest: "register-error",
      },
      {
        field: "state" as keyof UserData,
        testCases: [
          {
            value: "a".repeat(41),
            message: errorMessages.validationErrors.stateTooLong,
          },
        ],
        errorDataTest: "register-error",
      },
      {
        field: "email" as keyof UserData,
        testCases: [
          {
            value: "customer@practicesoftwaretesting.com",
            message: errorMessages.validationErrors.emailExists,
          },
        ],
        errorDataTest: "register-error",
      },
      {
        field: "password" as keyof UserData,
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
        field: "phone" as keyof UserData,
        testCases: [
          {
            value: "111-111-1111",
            message: errorMessages.validationErrors.phoneNumbersOnly,
          },
        ],
        errorDataTest: "phone-error",
      },
      // Add other fields and their test cases here
    ];

    for (const { field, testCases, errorDataTest } of fieldValidationTests) {
      test(`Validates ${field}`, async ({ registrationPage }) => {
        await registrationPage.testInvalidValues(
          field,
          testCases,
          errorDataTest
        );
      });
    }
  });

  test("Successful registration and login", async ({
    adminPage,
    registrationPage,
    loginPage,
    userData,
  }) => {
    await registrationPage.submitForm(userData);

    // Verify redirection to login page
    await expect(registrationPage.page).toHaveURL(loginPage.loginURL);

    // Log in with new user credentials
    await loginPage.login(userData.email, userData.password);

    // Verify redirection to user account page
    await expect(loginPage.page).toHaveURL(`${process.env.BASE_URL}/account`);

    // Verify user name in navigation menu
    await expect(loginPage.navMenuBtn).toContainText(userData.firstName);
    await expect(loginPage.navMenuBtn).toContainText(userData.lastName);

    // Log out user
    await loginPage.logout();

    // Verify redirection to login page and visibility of 'Sign in' button
    await expect(loginPage.page).toHaveURL(loginPage.loginURL);
    await expect(loginPage.signInBtn).toBeVisible();

    // Verify navigation menu is not visible
    await expect(loginPage.navMenuBtn).not.toBeVisible();
  });
});
