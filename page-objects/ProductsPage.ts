import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
  // Locators
  readonly nextBtn: Locator;
  readonly prevBtn: Locator;
  readonly noResults: Locator;

  // Selectors
  readonly productSelector: string;

  constructor(page: Page) {
    super(page);

    // Locators
    this.nextBtn = page.getByRole("button", { name: "Next" });
    this.prevBtn = page.getByRole("button", { name: "Previous" });
    this.noResults = page.locator('[data-test="no-results"]');

    // Selectors
    this.productSelector = 'a[data-test^="product-"]';
  }

  // Navigate to homepage of website
  async navigateToHomepage() {
    await this.goto("https://practicesoftwaretesting.com");
  }

  // Fetch product info (via JSON) by page
  async fetchProductsByPage(pageNumber: number) {
    const response = await this.page.waitForResponse(
      (response) =>
        response.url().includes("products?") &&
        response.url().includes(`page=${pageNumber}`)
    );
    return response.json();
  }

  // Fetch data for current page
  async fetchCurrentPageData() {
    const response = await this.page.waitForResponse((response) =>
      response.url().includes("products?")
    );
    return response.json();
  }

  // Navigate to specific product page
  async navigateToPage(pageNumber: number) {
    await this.page.getByLabel(`Page-${pageNumber}`).click();
  }

  // Navigate to last pagination page
  async navigateToLastPage() {
    const lastPageItem = this.page
      .locator(".pagination li")
      .filter({ hasNotText: "«" }) // Remove the "Prev" button from the list of possibilities
      .filter({ hasNotText: "»" }) // Remove the "Next" button from the list of possibilities
      .last(); // Specifically select the last element

    await lastPageItem.click();
  }

  // Wait for response after selecting category
  async waitForCategoryResponse() {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes("by_category") && response.status() === 200
    );
  }

  // Wait for response after selecting brand
  async waitForBrandResponse() {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes("by_brand") && response.status() === 200
    );
  }

  // Wait for response after selecting category and brand
  async waitForPageCategoryBrandResponse(pageNumber: number) {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes(`page=${pageNumber}`) &&
        response.url().includes("by_category") &&
        response.url().includes("by_brand") &&
        response.status() === 200
    );
  }

  // Wait for product's selector to appear within DOM
  async waitForProductSelector() {
    await this.page.waitForSelector(this.productSelector);
  }

  // Filter by category
  async chooseCategory(category: string) {
    await this.page.getByLabel(category).click();
  }

  // Filter by brand
  async chooseBrand(brand: string) {
    await this.page.getByLabel(brand).click();
  }

  // Click 'Next' button
  async clickNext() {
    await this.nextBtn.click();
  }

  // Click 'Prev' button
  async clickPrev() {
    await this.prevBtn.click();
  }

  // Retrieve 'Next' button HTML
  getNextBtn() {
    return this.page.locator(".pagination li").filter({ hasText: "»" });
  }

  // Retrieve 'Prev' button HTML
  getPrevBtn() {
    return this.page.locator(".pagination li").filter({ hasText: "«" });
  }
}
