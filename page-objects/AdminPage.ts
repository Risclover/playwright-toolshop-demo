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

  // Login as admin
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

  // Logout from admin account
  async logout() {
    await this.navMenu.click();
    const logoutButton = this.page.locator('[data-test="nav-sign-out"]');
    await logoutButton.click();
  }
}
