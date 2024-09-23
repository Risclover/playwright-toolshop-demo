// page-objects/ProductsPage.ts
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductsPage extends BasePage {
  readonly nextBtn: Locator;
  readonly prevBtn: Locator;
  readonly productSelector: string;
  readonly noResults: Locator;

  constructor(page: Page) {
    super(page);
    this.nextBtn = page.getByRole("button", { name: "Next" });
    this.prevBtn = page.getByRole("button", { name: "Previous" });
    this.productSelector = 'a[data-test^="product-"]';
    this.noResults = page.locator('[data-test="no-results"]');
  }

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

  async fetchCurrentPageData() {
    const response = await this.page.waitForResponse((response) =>
      response.url().includes("products?")
    );
    return response.json();
  }

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

  async waitForCategoryResponse() {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes("by_category") && response.status() === 200
    );
  }

  async waitForBrandResponse() {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes("by_brand") && response.status() === 200
    );
  }

  async waitForPageCategoryBrandResponse(pageNumber: number) {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes(`page=${pageNumber}`) &&
        response.url().includes("by_category") &&
        response.url().includes("by_brand") &&
        response.status() === 200
    );
  }

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

  async clickNext() {
    await this.nextBtn.click();
  }

  async clickPrev() {
    await this.prevBtn.click();
  }

  getNextBtn() {
    return this.page.locator(".pagination li").filter({ hasText: "»" });
  }

  getPrevBtn() {
    return this.page.locator(".pagination li").filter({ hasText: "«" });
  }
}
