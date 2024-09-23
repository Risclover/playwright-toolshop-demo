import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import { generateUniqueUserData } from "../test-data/registrationData";

export interface UserData {
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

  // URL
  readonly registrationURL: string;

  constructor(page: Page) {
    super(page);

    // Initialize locators using data-test attributes
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

    // URL
    this.registrationURL = `${process.env.BASE_URL}/auth/register`;
  }

  // Navigate to the registration page
  async goto() {
    await this.page.goto(this.registrationURL);
  }

  // Fill in registration form fields
  async fillForm(data: Partial<UserData>) {
    for (const [key, value] of Object.entries(data)) {
      const fieldLocator = this.getFieldLocator(key as keyof UserData);

      if (fieldLocator) {
        if (key === "country" && value) {
          await this.countryInput.selectOption(value as string);
        } else {
          await fieldLocator.fill(value || "");
        }
      }
    }
  }

  // Submit the registration form
  async submitForm(data: UserData) {
    await this.fillForm(data);
    await this.registerBtn.click();
  }

  // Get locator for a given field
  getFieldLocator(fieldName: keyof UserData): Locator | undefined {
    const fieldLocators: { [key in keyof UserData]: Locator } = {
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
    fieldName: keyof UserData,
    testCases: TestCase[],
    errorDataTest: string
  ) {
    for (const { value, message } of testCases) {
      await this.goto(); // Ensure the form is reset
      const userData = generateUniqueUserData();
      const testData = { ...userData, [fieldName]: value };
      await this.fillForm(testData);
      await this.registerBtn.click();

      const errorLocator = this.page.locator(`[data-test="${errorDataTest}"]`);
      await expect(errorLocator).toContainText(message);
    }
  }
}
