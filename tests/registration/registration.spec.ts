import { test, expect } from "./registration.fixtures";
import {
  errorMessages,
  fieldValidationTests,
} from "../../test-data/registrationData";

test.describe("Registration Page Tests", () => {
  // Form elements are rendered
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

  // Confirm that each form field gives 'required' error if blank upon form submission
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

  // Loop through field validation test data and verify proper field validation for each form field (based on given criteria from field validation test data)
  for (const { field, testCases, errorDataTest } of fieldValidationTests) {
    test(`Validates ${field} field`, async ({ registrationPage }) => {
      await registrationPage.testInvalidValues(field, testCases, errorDataTest);
    });
  }

  // Verify that a user can successfully register for a new account and subsequently log into that account
  test("Successful registration and login", async ({
    registrationPage,
    loginPage,
    defaultUserData,
  }) => {
    // Submit the registration form with given info from userData
    await registrationPage.submitForm(defaultUserData);

    // Verify redirection to login page
    await expect(registrationPage.page).toHaveURL(loginPage.loginURL);

    // Log in with new user credentials
    await loginPage.login(defaultUserData.email, defaultUserData.password);

    // Verify redirection to user account page
    await expect(loginPage.page).toHaveURL(registrationPage.accountPageURL);

    // Verify user name in navigation menu
    await expect(loginPage.navMenuBtn).toContainText(defaultUserData.firstName);
    await expect(loginPage.navMenuBtn).toContainText(defaultUserData.lastName);

    // Log out user
    await loginPage.logout();

    // Verify redirection to login page and visibility of 'Sign in' button
    await expect(loginPage.page).toHaveURL(loginPage.loginURL);
    await expect(loginPage.signInBtn).toBeVisible();

    // Verify navigation menu is not visible
    await expect(loginPage.navMenuBtn).not.toBeVisible();
  });
});
