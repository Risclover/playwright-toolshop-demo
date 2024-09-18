import { test as base } from "@playwright/test";
import { ProductsPage } from "../../page-objects/ProductsPage";

type TestFixtures = {
  productsPage: ProductsPage;
};

export const test = base.extend<TestFixtures>({
  productsPage: async ({ page }, use) => {
    const productsPage = new ProductsPage(page);
    await productsPage.goto();

    await page.route("**/products?*", (route) => {
      route.continue().catch(() => {});
    });

    await use(productsPage);
  },
});

export { expect } from "@playwright/test";
