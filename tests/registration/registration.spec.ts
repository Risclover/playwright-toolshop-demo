import { test, expect } from "./registration.fixtures";
import {
  errorMessages,
  fieldValidationTests,
} from "../../test-data/registrationData";

test.describe("Registration Page Tests", () => {
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

    // Go through each form field element and expect each one to be on the page
    for (const input of inputs) {
      await expect(input).toBeVisible();
    }

    // Verify that the submit button is rendered
    await expect(registrationPage.registerBtn).toBeVisible();
  });

  test("Validates required fields", async ({ registrationPage }) => {
    // Click the submit button without filling out the form
    await registrationPage.registerBtn.click();

    // Loop through the required fields and verify that the given `errorLocator` contains the given `message`
    for (const [dataTest, message] of Object.entries(
      errorMessages.requiredFields
    )) {
      const errorLocator = registrationPage.page.locator(
        `[data-test="${dataTest}"]`
      );
      await expect(errorLocator).toContainText(message);
    }
  });

  // Loop through fieldValidationTests and verify proper field validation for each form field (based on given criteria within fieldValidationTests)
  for (const { field, testCases, errorDataTest } of fieldValidationTests) {
    test(`Validates ${field} field`, async ({ registrationPage }) => {
      await registrationPage.testInvalidValues(field, testCases, errorDataTest);
    });
  }

  // Verify that a user can successfully register for a new account and subsequently log into that account
  test("Successful registration and login", async ({
    registrationPage,
    loginPage,
    userData,
  }) => {
    // Submit the registration form with given info from userData
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
