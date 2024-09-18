// page-objects/ProductsPage.ts
import { Page, Locator, Response } from "@playwright/test";
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

  async goto() {
    await this.page.goto("https://practicesoftwaretesting.com");
  }

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

  async navigateToLastPage() {
    const lastPageItem = this.page
      .locator(".pagination li")
      .filter({ hasNotText: "«" })
      .filter({ hasNotText: "»" })
      .last();

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

  async chooseCategory(category: string) {
    await this.page.getByLabel(category).click();
  }

  async chooseBrand(brand: string) {
    await this.page.getByLabel(brand).click();
  }

  async clickNext() {
    await this.nextBtn.click();
  }

  async clickPrev() {
    await this.prevBtn.click();
  }

  getNextListItem() {
    return this.page.locator(".pagination li").filter({ hasText: "»" });
  }

  getPrevListItem() {
    return this.page.locator(".pagination li").filter({ hasText: "«" });
  }
}
