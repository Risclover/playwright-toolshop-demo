# playwright-toolshop-demo

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

- **Node.js**: Version 14.x or higher. [Download Node.js]()
- **npm**: Comes bundled with Node.js. Verify installation with `npm -v`.
- **Git**: For cloning the repository. [Download Git]()

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
