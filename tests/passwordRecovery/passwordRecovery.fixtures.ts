import { test as base, expect } from "@playwright/test";
import { PasswordRecoveryPage } from "../../page-objects/PasswordRecoveryPage";

const test = base.extend<{
  passwordRecoveryPage: PasswordRecoveryPage;
}>({
  passwordRecoveryPage: async ({ page }, use) => {
    // Create instance of PasswordRecoveryPage (password recovery tests' POM)
    const passwordRecoveryPage = new PasswordRecoveryPage(page);

    // Navigate to password recovery page
    await passwordRecoveryPage.navigate();

    // Allow use of passwordRecoveryPage in tests
    await use(passwordRecoveryPage);
  },
});

export { test, expect };
