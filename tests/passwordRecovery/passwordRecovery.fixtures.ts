import { test as base, expect } from "@playwright/test";
import { PasswordRecoveryPage } from "../../page-objects/PasswordRecoveryPage";

const test = base.extend<{
  passwordRecoveryPage: PasswordRecoveryPage;
}>({
  passwordRecoveryPage: async ({ page }, use) => {
    const passwordRecoveryPage = new PasswordRecoveryPage(page);
    await passwordRecoveryPage.navigate();
    await use(passwordRecoveryPage);
  },
});

export { test, expect };
