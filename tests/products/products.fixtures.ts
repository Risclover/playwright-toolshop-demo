import { test as base } from "@playwright/test";
import { ProductsPage } from "../../page-objects/ProductsPage";
import {
  productCategories,
  productBrands,
  ProductCategories,
  ProductBrands,
} from "../../test-data/productData";

type TestFixtures = {
  productsPage: ProductsPage;
  productCategories: ProductCategories;
  productBrands: ProductBrands;
};

export const test = base.extend<TestFixtures>({
  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await productsPage.navigateToHomepage();

    await page.route("**/products?*", (route) => {
      route.continue().catch(() => {});
    });

    await use(productsPage);
  },

  productCategories: async ({}, use) => {
    await use(productCategories);
  },

  productBrands: async ({}, use) => {
    await use(productBrands);
  },
});

export { expect } from "@playwright/test";
