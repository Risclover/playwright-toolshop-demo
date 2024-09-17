// page-objects/AdminPage.ts
import { expect, Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { LoginPage } from "./LoginPage";

export class AdminPage extends BasePage {
  readonly loginPage: LoginPage;
  readonly navMenu: Locator;
  readonly usersNavLink: Locator;
  readonly adminDashboardURL: string;
  readonly adminUsersURL: string;

  constructor(page: Page) {
    super(page);
    this.loginPage = new LoginPage(page);

    // Locators
    this.navMenu = page.locator('[data-test="nav-menu"]');
    this.usersNavLink = page.locator('[data-test="nav-admin-users"]');

    // URLs
    this.adminDashboardURL = `${process.env.BASE_URL}/admin/dashboard`;
    this.adminUsersURL = `${process.env.BASE_URL}/admin/users`;
  }

  // Login as admin using credentials from environment variables
  async loginAsAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error(
        "Admin credentials are not set in environment variables."
      );
    }

    await this.loginPage.navigateToLoginPage();
    await this.loginPage.login(adminEmail, adminPassword);
    await expect(this.page).toHaveURL(this.adminDashboardURL);
  }

  // Navigate to the users page
  async navigateToUsersPage() {
    await this.navMenu.click();
    await this.usersNavLink.click();
    await expect(this.page).toHaveURL(this.adminUsersURL);
  }

  // Delete a user by their email
  async deleteUserByEmail(email: string) {
    await this.navigateToUsersPage();

    await this.page.waitForSelector(`table`);
    const userRow = this.page.locator(`table tbody tr`, {
      has: this.page.getByRole("cell", {
        name: email,
      }),
    });

    if ((await userRow.count()) === 0) {
      throw new Error(`User with email "${email}" not found.`);
    }

    await userRow.locator(`button:has-text("Delete")`).click();

    // Wait for the user row to disappear
    await expect(userRow).toBeHidden();
    await this.page.getByText("User deleted.").waitFor({ state: "visible" });
    await this.page.getByText("User deleted.").waitFor({ state: "hidden" });
  }

  async resetLoginAttempts(email: string) {
    await this.page.waitForSelector(`table`);
    const userRow = this.page.locator(`table tbody tr`, {
      has: this.page.locator(`td`, { hasText: email }),
    });

    if ((await userRow.count()) === 0) {
      throw new Error(`User with email "${email}" not found.`);
    }

    await userRow.locator(`a:has-text("Edit")`).click();

    await this.page
      .locator("[data-test='failed_login_attempts']")
      .scrollIntoViewIfNeeded();

    await this.page.locator("[data-test='failed_login_attempts']").fill("0");
    await this.page.waitForTimeout(1000);

    await this.page.locator('[data-test="user-submit"]').click();

    await this.page.getByText("User saved!").waitFor({ state: "visible" });

    await this.logout();
  }

  // Logout from admin account
  async logout() {
    await this.navMenu.click();
    const logoutButton = this.page.locator('[data-test="nav-sign-out"]');
    await logoutButton.click();
  }
}
