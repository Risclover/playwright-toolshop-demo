import { test as base } from "@playwright/test";
import { ProductsPage } from "../../page-objects/ProductsPage";

type TestFixtures = {
  productsPage: ProductsPage;
};

export const test = base.extend<TestFixtures>({
  // Create an instance of ProductsPage and navigate to the page before each test
  productsPage: async ({ page }, use) => {
    // Create an instance of ProductsPage
    const productsPage = new ProductsPage(page);

    // Navigate to the homepage (which is also the storefront) before each test
    await productsPage.goto();

    // Set up network routing to handle any intercepted requests
    await page.route("**/products?*", (route) => {
      route.continue().catch(() => {});
    });

    // Use the initialized productsPage in the test
    await use(productsPage);
  },
});

export { expect } from "@playwright/test";
