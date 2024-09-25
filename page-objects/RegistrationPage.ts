import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { generateUniqueUserData } from "../test-data/registrationData";
import { DefaultUserData } from "../test-data/registrationData";

export interface TestCase {
  value: string;
  message: string;
}

export class RegistrationPage extends BasePage {
  // Locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly addressInput: Locator;
  readonly postcodeInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly countryInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerBtn: Locator;
  readonly registerError: Locator;

  // URLs
  readonly registrationURL: string;
  public accountPageURL: string;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.dateOfBirthInput = page.locator('[data-test="dob"]');
    this.addressInput = page.locator('[data-test="address"]');
    this.postcodeInput = page.locator('[data-test="postcode"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.countryInput = page.locator('[data-test="country"]');
    this.phoneInput = page.locator('[data-test="phone"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.registerBtn = page.locator('[data-test="register-submit"]');
    this.registerError = page.locator('[data-test="register-error"]');

    // Initialize URLs
    this.registrationURL = "https://practicesoftwaretesting.com/auth/register";
    this.accountPageURL = "https://practicesoftwaretesting.com/account";
  }

  // Navigate to the registration page
  async navigate() {
    await this.goto(this.registrationURL);
  }

  // Fill in registration form fields
  async fillForm(data: Partial<DefaultUserData>) {
    for (const [key, value] of Object.entries(data)) {
      const fieldLocator = this.getFieldLocator(key as keyof DefaultUserData);

      if (fieldLocator) { // If field locator exists:
        if (key === "country" && value) { // If field is "country" and `value` is defined:
          await this.countryInput.selectOption(value as string); // Select country from dropdown
        } else { // Otherwise:
          await fieldLocator.fill(value || ""); // Input value into form field
        }
      }
    }
  }

  // Submit the registration form
  async submitForm(data: DefaultUserData) {
    // Fill out registration form
    await this.fillForm(data);

    // Submit registration form
    await this.registerBtn.click();
  }

  // Get locator for a given field
  getFieldLocator(fieldName: keyof DefaultUserData): Locator | undefined {
    const fieldLocators: { [key in keyof DefaultUserData]: Locator } = {
      firstName: this.firstNameInput,
      lastName: this.lastNameInput,
      dateOfBirth: this.dateOfBirthInput,
      address: this.addressInput,
      postcode: this.postcodeInput,
      city: this.cityInput,
      state: this.stateInput,
      country: this.countryInput,
      phone: this.phoneInput,
      email: this.emailInput,
      password: this.passwordInput,
    };
    return fieldLocators[fieldName];
  }

  // Test invalid values for a field
  async testInvalidValues(
    fieldName: keyof DefaultUserData,
    testCases: TestCase[],
    errorDataTest: string
  ) {
    for (const { value, message } of testCases) {
      await this.navigate(); // Ensure the form is reset by "refreshing" the page
      const userData = generateUniqueUserData(); // Generate unique user data
      const testData = { ...userData, [fieldName]: value };
      await this.fillForm(testData); // Fill in form using test data

      // Submit registration form
      await this.registerBtn.click();

      // Retrieve error locator via given `errorDataTest` value
      const errorLocator = this.page.locator(`[data-test="${errorDataTest}"]`);

      // Expect locator to contain given `message`
      await expect(errorLocator).toContainText(message);
    }
  }
}
