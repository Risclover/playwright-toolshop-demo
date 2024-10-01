# playwright-toolshop-demo

This is a series of tests for the tool shop demo website https://practicesoftwaretesting.com, which is a website specifically made for developers to use to practice and/or showcase their skills. This testing suite was made to showcase my knowledge with Playwright.

## Installation and Use

1. Clone this repo.

   `git clone blah`

2. Install packages.

   `npm install`

3. To run tests:

   `npm run test`

   OR

   `npx playwright test`

4. To run a specific test file:

   `npx playwright test filename.ts`

## Some Information

This testing suite was created using the Playwright testing framework. I utilized best practice concepts such as fixtures and page object models (POMs). I created tests for the login form, the password recovery form, the registration form, and for the products pages (specifically pagination and filters).

### Project Structure

Using the Login page's tests as an example:

```plaintext
playwright-toolshop-demo/
├─ page-objects/
│  ├─ LoginPage.ts
├─ test-data/
│  ├─ loginData.ts
├─ tests/
│  ├─ login.fixtures.ts
│  ├─ login.spec.ts
```

- `page-objects`: contains each test file's POM, such as `LoginPage.ts` for the login page's tests.
- `test-data`: contains custom data for each test file, such as `loginData.ts` for the login page's tests.
- `tests`: test files and their fixtures
  - `name.fixture.ts`: a test's fixtures (i.e. `login.fixture.ts`)
  - `name.spec.ts`: the test file (i.e. `login.spec.ts`)

### Code Explained

#### POMs

Each POM contains:
1. Initialized variables for hard-coded values such as locator strings and URL strings.
2. A `goto()` function that navigates to a specific page for testing.
3. Functions for:
    - filling in form values
    - clicking buttons
    - filling in a form and submitting it (all in one)
    - network requests
    - fetching API data
    - other test-specific functions

#### Test Data

To ensure that tests are able to be completed correctly and accurately, tests for form pages contain data for filling in those forms. Test data also may include variables for hard-coded values (for example, category names) and form validation error messages.

`practicesoftwaretesting.com` includes access to 3 accounts - 2 user accounts as well as an admin account, for which the username and password are public knowledge.

#### Fixtures

Each test file contains its own fixtures file. From Playwright's docs:

> Test fixtures are used to establish the environment for each test, giving the test everything it needs and nothing else. Test fixtures are isolated between tests. With fixtures, you can group tests based on their meaning, isntead of their common setup.

Each fixture contains:
- intiialization of the POM object for use within the test
- use of the `goto()` POM function (so that it automatically navigates to that page before the tests begin)
