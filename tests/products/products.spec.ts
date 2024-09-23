import { test, expect } from "./products.fixtures";
import { productCategories, productBrands } from "../../test-data/productData";

test.describe("Products Page", () => {
  test.describe("Pagination", () => {
    // Test to verify that clicking on a pagination number navigates to the correct page
    test("Clicking on a pagination number navigates to the corresponding product page", async ({
      productsPage,
    }) => {
      // Fetch products from the first page
      const firstPageProducts = await productsPage.fetchProductsByPage(1);

      // Navigate to the 3rd page
      await productsPage.navigateToPage(3);

      // Fetch products from the third page
      const thirdPageProducts = await productsPage.fetchProductsByPage(3);

      // Verify that products on the third page are different from the first page
      expect(thirdPageProducts.data[0].id).not.toEqual(
        firstPageProducts.data[0].id
      );
    });

    // Ensure that different products are shown on different pages during pagination
    test("Displays different products on each page during pagination", async ({
      productsPage,
    }) => {
      // Fetch products from first page
      const firstPageProducts = await productsPage.fetchProductsByPage(1);
      // Navigate to the next page
      await productsPage.clickNext();
      // Fetch products from the second page
      const secondPageProducts = await productsPage.fetchProductsByPage(2);
      // Ensure that the first product on the second page is different from the first product on the first page
      expect(secondPageProducts.data[0].id).not.toEqual(
        firstPageProducts.data[0].id
      );
    });

    // Test to verify that clicking the 'Next' button navigates to the next page
    test("'Next' button correctly navigates to the next page", async ({
      productsPage,
    }) => {
      // Click the 'Next' button
      await productsPage.clickNext();
      // Fetch the data for the current page
      const pageData = await productsPage.fetchCurrentPageData();
      // Ensure that the current page is page 2
      expect(pageData.current_page).toEqual(2);
    });

    // Test to check that the 'Prev' button navigates to the previous page
    test("'Prev' button correctly navigates to the previous page", async ({
      productsPage,
    }) => {
      // Navigate to the second page
      await productsPage.navigateToPage(2);
      // Fetch the data for the current page
      await productsPage.fetchCurrentPageData();
      // Click the 'Prev' button
      await productsPage.clickPrev();
      // Fetch the current page data and ensure it is now the first page
      const pageData = await productsPage.fetchCurrentPageData();
      expect(pageData.current_page).toEqual(1);
    });

    // Test to check that the 'Prev' button is disabled on the first page
    test("'Prev' button is disabled when on the first product page", async ({
      productsPage,
    }) => {
      // Get the locator for the 'Prev' button
      const prevItem = productsPage.getPrevBtn();
      // Ensure the 'Prev' button has the 'disabled' class
      await expect(prevItem).toHaveClass(/disabled/);
    });

    // Test to check that the 'Next' button is disabled on the last page
    test("'Next' button is disabled when on the last product page", async ({
      productsPage,
    }) => {
      // Navigate to the last page
      await productsPage.navigateToLastPage();
      // Get the locator for the 'Next' button
      const nextItem = productsPage.getNextBtn();
      // Ensure the 'Next' button has the 'disabled' class
      await expect(nextItem).toHaveClass(/disabled/);
    });
  });

  test.describe("Filters", () => {
    // Test to verify that filtering by category shows the correct results
    test("Filters products by category and displays the correct results", async ({
      productsPage,
    }) => {
      // Apply a category filter
      await productsPage.chooseCategory(productCategories.selectedCategory);

      // Wait for the category response and products to load
      const response = await productsPage.waitForCategoryResponse();
      await productsPage.waitForProductSelector();
      const responseBody = await response.json();
      const products = responseBody.data;

      // Check if all filtered products belong to the selected category
      const categories = products.map((product: any) => product.category.name);

      categories.forEach((category: string) => {
        expect(category.toLowerCase()).toEqual(
          productCategories.selectedCategory.toLowerCase()
        );
      });
    });

    // Test to verify that filtering by brand shows the correct results
    test("Filters products by brand and displays the correct results", async ({
      productsPage,
    }) => {
      // Apply a brand filter
      await productsPage.chooseBrand(productBrands.selectedBrand);

      // Wait for the brand response and products to load
      const response = await productsPage.waitForBrandResponse();
      await productsPage.waitForProductSelector();
      const products = (await response.json()).data;

      // Check if all filtered products belong to the selected brand
      const brands = products.map((product: any) => product.brand.name);

      brands.forEach((brand: string) =>
        expect(brand.toLowerCase()).toEqual(
          productBrands.selectedBrand.toLowerCase()
        )
      );
    });

    // Verify that products can be filtered by both category and brand correctly
    test("Filters products by both category and brand and displays the correct results", async ({
      productsPage,
      page,
    }) => {
      // Apply a category filter
      await productsPage.chooseCategory(productCategories.selectedCategory);
      await productsPage.waitForCategoryResponse();

      // Apply a brand filter
      await productsPage.chooseBrand(productBrands.selectedBrand);
      const response = await productsPage.waitForBrandResponse();
      const products = (await response.json()).data;

      // Verify that all products in the response match both the selected category and brand
      const allProductsMatchFilters = products.every(
        (product) =>
          product.category.name === productCategories.selectedCategory &&
          product.brand.name === productBrands.selectedBrand
      );

      // Ensure all products in the response have the selected category and brand
      expect(allProductsMatchFilters).toBe(true);

      // Verify that the displayed product IDs match the filtered products (UI check)
      const displayedProductIds = await page
        .locator(productsPage.productSelector)
        .evaluateAll((elements) =>
          elements.map((el) => el.getAttribute("data-test"))
        );

      const expectedProductIds = products.map(
        (product) => `product-${product.id}`
      );

      expect(displayedProductIds).toEqual(
        expect.arrayContaining(expectedProductIds)
      );
    });

    test("Displays a 'no results' message when no products match the filter", async ({
      productsPage,
    }) => {
      // Apply a category filter
      await productsPage.chooseCategory(productCategories.noResultsCategory);

      // Expect a related error message
      await expect(productsPage.noResults).toContainText(
        "There are no products found."
      );
    });

    test("Filters persist when navigating between paginated pages", async ({
      productsPage,
    }) => {
      // Apply a category filter
      await productsPage.chooseCategory(productCategories.selectedCategory);
      await productsPage.waitForCategoryResponse();

      // Apply a second category filter
      await productsPage.chooseCategory(
        productCategories.multiplePagesCategory // ensures that the selected category contains enough products to span multiple pages
      );
      await productsPage.waitForCategoryResponse();

      // Apply a brand filter
      await productsPage.chooseBrand(productBrands.selectedBrand);
      const response = await productsPage.waitForBrandResponse();
      const products = (await response.json()).data;

      // Navigate to page 2
      await productsPage.navigateToPage(2);
      await productsPage.waitForPageCategoryBrandResponse(2);

      // Ensure that filters still apply
      products.forEach((product) => {
        const categoryName = product.category.name.toLowerCase();
        const brandName = product.brand.name.toLowerCase();

        const matchesCategory =
          categoryName === productCategories.selectedCategory.toLowerCase() ||
          categoryName ===
            productCategories.multiplePagesCategory.toLowerCase();
        const matchesBrand =
          brandName === productBrands.selectedBrand.toLowerCase();

        // Ensure products match both category and brand
        expect(matchesCategory && matchesBrand).toBe(true);
      });
    });

    // Test to verify that unchecking the only active filter restores the full product list
    test("Unchecking the only active filter restores the full product list", async ({
      productsPage,
    }) => {
      // Apply a category filter
      await productsPage.chooseCategory(productCategories.selectedCategory);
      const filteredResponse = await productsPage.waitForCategoryResponse();
      const filteredProducts = (await filteredResponse.json()).data;
      const filteredProductsCount = filteredProducts.length;

      // Uncheck the category filter and verify that all products are displayed
      await productsPage.chooseCategory(productCategories.selectedCategory);
      const allProductsResponse = await productsPage.fetchCurrentPageData();
      const allProducts = allProductsResponse.data;
      const allProductsCount = allProducts.length;

      // Ensure the total product count is greater than or equal to the filtered count
      expect(allProductsCount).toBeGreaterThanOrEqual(filteredProductsCount);
    });

    test("Unchecking a category filter while another is still checked displays the correct products", async ({
      productsPage,
    }) => {
      // Apply the first category filter
      await productsPage.chooseCategory(productCategories.selectedCategory);
      await productsPage.waitForCategoryResponse();

      // Apply the second category filter
      await productsPage.chooseCategory(productCategories.secondCategory);
      await productsPage.waitForCategoryResponse();

      // Uncheck the first category filter
      await productsPage.chooseCategory(productCategories.selectedCategory);
      const response = await productsPage.waitForCategoryResponse();

      // Fetch the updated products after unchecking the first filter
      const updatedProducts = (await response.json()).data;

      // Verify that the remaining products belong to the second category
      updatedProducts.forEach((product) => {
        const categoryName = product.category.name.toLowerCase();
        expect(categoryName).toContain(
          productCategories.secondCategory.toLowerCase()
        );
        expect(categoryName).not.toContain(
          productCategories.selectedCategory.toLowerCase()
        );
      });
    });

    test("Selecting multiple category filters displays products from all selected categories", async ({
      productsPage,
      page,
    }) => {
      // Apply the first category filter
      await productsPage.chooseCategory(productCategories.selectedCategory);
      await productsPage.waitForCategoryResponse();

      // Apply the second category filter
      await productsPage.chooseCategory(productCategories.secondCategory);
      const response = await productsPage.waitForCategoryResponse();

      // Fetch the products that match both categories
      const responseBody = await response.json();
      const productsData = responseBody.data;

      // List of the selected categories to match
      const selectedCategories = [
        productCategories.selectedCategory.toLowerCase(),
        productCategories.secondCategory.toLowerCase(),
      ];

      // Verify that all the products belong to one of the selected categories
      productsData.forEach((product: any) => {
        const categoryName = product.category.name.toLowerCase();
        expect(selectedCategories).toContain(categoryName);
      });
    });

    test("Selecting multiple brand filters displays products from all selected brands", async ({
      productsPage,
      page,
    }) => {
      // Apply the first brand filter
      await productsPage.chooseBrand(productBrands.selectedBrand);
      await productsPage.waitForBrandResponse();

      // Apply the second brand filter
      await productsPage.chooseBrand(productBrands.secondBrand);
      const response = await productsPage.waitForBrandResponse();

      // Fetch the products that match both brands
      const responseBody = await response.json();
      const productsData = responseBody.data;

      // List of the selected brands to match
      const selectedBrands = [
        productBrands.selectedBrand.toLowerCase(),
        productBrands.secondBrand.toLowerCase(),
      ];

      // Verify that all the products belong to one of the selected brands
      productsData.forEach((product) => {
        const brandName = product.brand.name.toLowerCase();
        expect(selectedBrands).toContain(brandName);
      });
    });
  });
});
