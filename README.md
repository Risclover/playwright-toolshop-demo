# playwright-toolshop-demo

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Running Tests](#running-tests)
    - [Run All Tests](#run-all-tests)
    - [Run Specific Test File](#run-specific-test-file)
    - [Run Tests in Debug Mode](#run-tests-in-debug-mode)
  - [Generating Test Reports](#generating-test-reports)
- [Testing Suites and Their Solutions](#testing-suites-and-their-solutions)
  - [1. Login Suite](#1-login-suite)
  - [2. Password Recovery Suite](#2-password-recovery-suite)
  - [3. Products - Pagination and Filtering Suite](#3-products---pagination-and-filtering-suite)
  - [4. Registration Suite](#4-registration-suite)
- [Best Practices and Methodologies Implemented](#best-practices-and-methodologies-implemented)
- [Project Structure](#project-structure)
- [Code Explanation](#code-explanation)
  - [Page Object Models (POMs)](#page-object-models-poms)
  - [Test Data](#test-data)
  - [Fixtures](#fixtures)

## Overview

Welcome to **playwright-toolshop-demo**! This repository contains a suite of automated tests for the [Tool Shop Demo](https://practicesoftwaretesting.com) website. Designed specifically for developers, Toolshop Demo serves as a platform to practice and showcase testing skills. This testing suite demonstrates best practices using Playwright, including fixtures, Page Object Models (POMs), and organized test data management.

## Features

- **Focused Test Coverage**: Currently includes tests for the login form, password recovery form, registration form, and product pages (specifically pagination and filters).
- **Modular Design**: Utilizes Page Object Models (POMs) for maintainability and scalability.
- **Data-Driven Testing**: Incorporates separate test data files for flexibility.
- **Isolated Test Environments**: Implements Playwright fixtures to ensure test isolation and reliability.
- **Easy Configuration**: Simple setup and execution commands for quick start.

## Prerequisites

Before setting up the project, ensure you have the following installed on your machine:

- **Node.js**: Version 14.x or higher. [Download Node.js](https://nodejs.org/en/download/package-manager)
- **npm**: Comes bundled with Node.js. Verify installation with `npm -v`.
- **Git**: For cloning the repository. [Download Git](https://github.com/git-guides/install-git)

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Risclover/playwright-toolshop-demo.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd playwright-toolshop-demo
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Install Playwright Browsers**
   Playwright requires browser binaries to run tests. Install them using:
   ```bash
   npx playwright install
   ```

## Usage

### Running Tests

#### Run All Tests

To execute the entire test suite, use:

```bash
npm run test
```

OR

```bash
npx playwright test
```

#### Run Specific Test File

To run a specific test file, specify the file path:

```bash
npx playwright test login.spec.ts
```

#### Run Tests in Debug Mode

For debuging purposes, you can run tests in headed mode with:

```bash
npx playwright test --headed
```

### Generating Test Reports

Playwright generates HTML reports to visualize test results. To generate and open the report:

```bash
npx playwright show-report
```

## Testing Suites and Their Solutions

The testing suite is organized into four main categories:

1. Login Suite
2. Password Recovery Suite
3. Products - Pagination and Filtering Suite
4. Registration Suite

Each suite is meticulously designed to validate different aspects of the application, ensuring a holistic assessment of its functionalities.

### 1. Login Suite

**Objective:** To verify the authentication mechanisms, ensuring that users can log in with valid credentials, handle invalid inputs gracefully, and that security measures like account locking after multiple failed attempts are effective.

**Key Test Cases:**

- **Successful Login**: Validates that users can log in with correct credentials and are redirected appropriately.
- **Form Elements Rendering**: Ensures all login form elements are present and visible.
- **Invalid Inputs Handling**: Checks that appropriate error messages are displayed for invalid or incomplete inputs.
- **Password and Email Validation**: Verifies that the system correctly validates password length and email format.
- **Navigation Links**: Confirms that links like "Register" and "Forgot Password" navigate to their respective pages.
- **Password Visibility Toggle**: Ensures that users can toggle password visibility without issues.
- **Account Locking Mechanism**: Validates that after multiple failed login attempts, the account is locked, and administrators can reset login attempts.

**Challenges & Solutions**:

- **Asynchronous Operations Handling**: Ensured that all asynchronous actions, such as form submissions and network requests, are properly awaited to prevent race conditions and ensure test reliability.
  ```typescript
  await Promise.all([
    this.page.waitForSelector(".alert-success", { state: "visible" }),
    this.page.click('button[data-test="user-submit"]'),
  ]);
  ```
- **Error Handling**: Implemented comprehensive error checks and meaningful error messages to facilitate easier debugging and maintain clarity in test results.
- **Selector Accuracy**: Utilized precise selectors and dynamic locator strategies to interact with UI elements accurately, reducing the chances of flaky tests.

### 2. Password Recovery Suite

**Objective**: To ensure that the password recovery process is intuitive, secure, and functions correctly, allowing users to reset their passwords seamlessly.

**Key Test Cases**:

- **Form Elements Rendering**: Validates the presence and visibility of all elements in the password recovery form.
- **Initial State Verification**: Confirms that error messages are not displayed upon initial page load.
- **Required Fields Validation**: Checks that submitting the form without necessary inputs prompts appropriate error messages.
- **Successful Password Reset Request**: Verifies that valid email submissions trigger successful password reset requests and appropriate backend responses.

**Challenges & Solutions**:

- **Network Request Monitoring**: Utilized Playwright's network interception capabilities to monitor and validate backend responses during password reset requests.

  ```typescript
  const [request] = await Promise.all([
    passwordRecoveryPage.waitForForgotPasswordRequest(),
    passwordRecoveryPage.requestPasswordReset(userData.user1.email),
  ]);
  ```

- **Dynamic Content Handling**: Ensured that the tests account for dynamic content and loading states, using appropriate wait strategies to synchronize test execution with application behavior.

### 3. Products - Pagination and Filtering Suite

**Objective**: To validate the product listing functionalities, including pagination and filtering by various criteria, ensuring that users can navigate and filter products efficiently and accurately.

**Key Test Cases**:

- **Pagination Navigation**: Confirms that clicking on pagination controls navigates to the correct product pages and displays the expected products.
- **Pagination Buttons Functionality**: Ensures that "Next" and "Prev" buttons function correctly, including their disabled states on boundary pages.
- **Filtering by Category and Brand**: Validates that applying filters by category and brand displays the correct subset of products.
- **Combined Filters Handling**: Tests the system's ability to handle multiple simultaneous filters and ensures that results reflect all applied criteria.
- **No Results Handling**: Checks that appropriate messages are displayed when filters result in no matching products.
- **Filter Persistence Across Pagination**: Ensures that applied filters persist when navigating through paginated product lists.

**Challenges & Solutions**:

- **Response Timing and Race Conditions**: Addressed intermittent timeouts by initiating network response listeners before performing actions that trigger requests, using Promise.all to handle concurrent operations.
  ```typescript
  await Promise.all([
    productsPage.waitForPageResponse(1),
    productsPage.navigateToHomepage(),
  ]);
  ```
- **Accurate Data Validation**: Implemented precise data fetching and comparison strategies to ensure that UI displays match backend data, enhancing test accuracy.
- **Overlap Prevention in Pagination**: Ensured that different pages display unique products without overlaps, maintaining data integrity across navigations.

### 4. Registration Suite

**Objective**: To verify the user registration process, ensuring that new users can register successfully, input validations are enforced, and post-registration processes (like logging in) function correctly.

**Key Test Cases**:

- **Form Elements Rendering**: Validates the presence and visibility of all registration form elements.
- **Required Fields Validation**: Ensures that submitting the form without necessary inputs prompts appropriate error messages.
- **Field-Specific Validations**: Tests each form field for correct validation rules (e.g., email format, password strength).
- **Successful Registration and Login**: Confirms that users can register with valid data and subsequently log in using their new credentials.
- **Post-Registration Navigation**: Checks that users are redirected to the appropriate pages after successful registration and login.

**Challenges & Solutions**:

- **Dynamic Field Validation Testing**: Created a dynamic testing approach to iterate through various field validation scenarios, enhancing test coverage and reducing code redundancy.
  ```typescript
  for (const { field, testCases, errorDataTest } of fieldValidationTests) {
    test(`Validates ${field} field`, async ({ registrationPage }) => {
      await registrationPage.testInvalidValues(field, testCases, errorDataTest);
    });
  }
  ```
- **State Management**: Ensured that user state (e.g., logged in/out) is accurately managed across tests to prevent state leakage and maintain test independence.
- **Synchronization with UI Changes**: Utilized appropriate wait strategies to handle UI transitions and ensure that tests interact with elements only when they are ready.

## Best Practices and Methodologies Implemented

Throughout the development of these testing suites, several best practices and methodologies were adhered to, ensuring high-quality, maintainable, and reliable tests:

- **Page Object Model (POM)**: Structured tests using the Page Object Model to encapsulate page-specific behaviors and elements, enhancing code reusability and maintainability.
- **Use of Fixtures**: Implemented Playwright's fixture mechanism to manage test setup and teardown, ensuring consistency and reusability across test suites. Fixtures were utilized to initialize page objects, provide test data, and maintain a clean test environment, enhancing test reliability and maintainability.
- **Asynchronous Operations Handling**: Leveraged async/await and Promise.all to manage asynchronous actions effectively, preventing race conditions and ensuring that tests wait for necessary conditions before proceeding.
- **Precise Selectors**: Utilized robust and specific selectors (e.g., data-test attributes) to interact with UI elements reliably, reducing susceptibility to UI changes.
- **Comprehensive Error Handling**: Implemented thorough error checks and meaningful error messages to facilitate easier debugging and provide clear feedback on test failures.
- **Logging and Debugging**: Incorporated logging statements and leveraged Playwright's debugging tools (such as screenshots and tracing) to gain insights into test executions and swiftly identify issues.
- **Data-Driven Testing**: Employed data-driven testing strategies to handle multiple test scenarios efficiently, improving test coverage without redundant code.
- **Test Isolation**: Ensured that each test is independent, with proper setup and teardown procedures to prevent state leakage and maintain test reliability.
- **Continuous Integration Compatibility**: Designed tests to be easily integrable with Continuous Integration (CI) pipelines, promoting automated and consistent test executions.

## Project Structure

This is an overview of the directory layout, with explanations below.

```plaintext
playwright-toolshop-demo/
├── page-objects/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── PasswordRecoveryPage.ts
│   ├── ProductsPage.ts
│   └── RegistrationPage.ts
├── test-data/
│   ├── loginData.ts
│   ├── productData.ts
│   ├── registrationData.ts
│   └── productData.ts
├── tests/
│   ├── login/
│   │   ├── login.fixtures.ts
│   │   └── login.spec.ts
│   ├── passwordRecovery/
│   │   ├── passwordRecovery.fixtures.ts
│   │   └── passwordRecovery.spec.ts
│   ├── products/
│   │   ├── products.fixtures.ts
│   │   └── products.spec.ts
│   └── registration/
│       ├── registration.fixtures.ts
│       └── registration.spec.ts
├── playwright.config.ts
├── package.json
└── README.md
```

- **page-objects**: Contains POMs for different pages, such as `LoginPage.ts`.
- **test-data**: Houses custom data files for each test, like `loginData.ts`.
- **tests**: Contains test suites and their corresponding fixtures.
  - Each feature (e.g. login, registration, products, password recovery) has its own subdirectory with fixture and spec files.
- **playwright.config.ts**: Playwright configuration file.
- **package.json**: Project metadata and dependencies.

## Code Explanation

### Page Object Models (POMs)

POMs encapsulate the elements and actions of a page, promoting reusability and maintainability.

Each POM includes:

1. **Locators and URLS**: Initialized variables for selectors and page URLs.
2. **Navigation Methods**: Functions like `goto()` to navigate to specific pages.
3. **Action Methods**:
   - Filling out forms
   - Clicking buttons
   - Submitting forms
   - Handling network requests
   - Fetching API data
   - Other test-specific interactions

**Example**: `PasswordRecoveryPage.ts`

```typescript
import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PasswordRecoveryPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly emailError: Locator;

  // URLs
  readonly forgotPasswordURL: string;
  readonly forgotPasswordAPI: string;

  constructor(page: Page) {
    super(page);

    // Locators
    this.emailInput = page.locator('[data-test="email"]');
    this.submitButton = page.locator('[data-test="forgot-password-submit"]');
    this.emailError = page.locator('[data-test="email-error"]');

    // URLs
    this.forgotPasswordURL = `${this.homepageURL}/auth/forgot-password`;
    this.forgotPasswordAPI = `${this.apiURL}/users/forgot-password`;
  }

  // Navigate to password recovery page
  async navigate() {
    await this.goto(this.forgotPasswordURL);
  }

  // Enter email into email field
  async enterEmail(email: string) {
    await this.emailInput.fill(email);
  }

  // Click form submit button
  async clickSubmitButton() {
    await this.submitButton.click();
  }

  // Fill out form and click submit
  async requestPasswordReset(email: string) {
    // Enter email input with given email
    await this.enterEmail(email);

    // Submit password reset request form
    await this.clickSubmitButton();
  }

  // Wait for request from forgot password API
  waitForForgotPasswordRequest() {
    return this.page.waitForRequest(this.forgotPasswordAPI);
  }
}
```

### Test Data

Test data ensures that tests run with consistent and controlled inputs. It includes:

- **Default User Data**: Predefined user information for form submissions.
- **Unique Data Generators**: Functions like `generateUniqueUserData()` to create unique entries (e.g., unique email addresses) for each test run.
- **Validation Messages**: Expected error messages for form validations.

**Example**: `registrationData.ts`

```typescript
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

export function generateUniqueUserData(): DefaultUserData {
  const timestamp = Date.now();
  return {
    ...defaultUserData,
    email: `user${timestamp}@example.com`,
  };
}

export const errorMessages = {
  requiredFields: {
    "first-name-error": "First name is required",
    // ... other error messages
  },
  validationErrors: {
    firstNameTooLong:
      "The first name field must not be greater than 40 characters.",
    // ... other validation errors
  },
};
```

### Fixtures

Fixtures set up the testing environment, ensuring that each test has the necessary context and isolation.

**Key Responsibilities**:

- **Initialize POMs**: Create instances of POMs for use in tests.
- **Navigate to Pages**: Automatically navigate to the relevant page befoer tests run.
- **Provide Test Data**: Supply unique and consistent data for each test case.

**Example**: `login.fixtures.ts`

```typescript
import { test as base } from "@playwright/test";
import { LoginPage } from "../../page-objects/LoginPage";
import { RegistrationPage } from "../../page-objects/RegistrationPage";
import {
  generateUniqueUserData,
  DefaultUserData,
} from "../../test-data/registrationData";

type TestFixtures = {
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
  defaultUserData: DefaultUserData;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page);
    await registrationPage.navigate();
    await use(registrationPage);
  },

  defaultUserData: async ({}, use) => {
    const userData = generateUniqueUserData();
    await use(userData);
  },
});

export { expect } from "@playwright/test";
```
