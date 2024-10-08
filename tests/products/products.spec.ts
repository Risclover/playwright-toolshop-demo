import { test, expect } from "./products.fixtures";

test.describe("Products Page", () => {
  test.describe("Pagination", () => {
    // Test to verify that clicking on a pagination number navigates to the correct page
    test("Clicking on a pagination number navigates to the corresponding product page", async ({
      productsPage,
    }) => {
      // Navigate to the 3rd page
      await productsPage.navigateToPage(3);

      // Fetch expected products for page 3 via API
      const expectedProductsResponse = await productsPage.fetchProductsByPage(
        3
      );
      const expectedProducts = expectedProductsResponse.data;

      // Get the expected product IDs as strings
      const expectedProductIds = expectedProducts.map((product) =>
        product.id.toString()
      );

      // Get the product IDs displayed on the UI
      const displayedProductIds = await productsPage.getDisplayedProducts();

      // Verify that the displayed product IDs match the expected product IDs for page 3
      expect(displayedProductIds).toEqual(expectedProductIds);
    });

    // Test to ensure that different products are shown on different pages during pagination
    test("Displays different products on each page during pagination", async ({
      page,
      productsPage,
    }) => {
      // Ensure the initial page load is complete
      await Promise.all([
        productsPage.waitForPageResponse(1),
        productsPage.navigateToHomepage(),
      ]);

      // Get the product IDs displayed on the first page from the UI
      const firstPageDisplayedProductIds =
        await productsPage.getDisplayedProducts();

      // Navigate to the next page (page 2) and wait for the response simultaneously
      const [response] = await Promise.all([
        productsPage.waitForPageResponse(2),
        productsPage.navigateToPage(2),
      ]);

      await page.waitForLoadState("networkidle");

      // Get the product IDs displayed on the second page from the UI
      const secondPageDisplayedProductIds =
        await productsPage.getDisplayedProducts();

      // Verify that the products on the second page are different from the first page
      expect(secondPageDisplayedProductIds).not.toEqual(
        firstPageDisplayedProductIds
      );

      // Optionally, ensure there is no overlap between the two sets of products
      const overlappingProductIds = firstPageDisplayedProductIds.filter((id) =>
        secondPageDisplayedProductIds.includes(id)
      );
      expect(overlappingProductIds.length).toEqual(0);
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

      // Fetch the current page's data
      const pageData = await productsPage.fetchCurrentPageData();

      // Verify that the current page is 1 as expected
      expect(pageData.current_page).toEqual(1);
    });

    // Test to check that the 'Prev' button is disabled on the first page
    test("'Prev' button is disabled when on the first product page", async ({
      productsPage,
    }) => {
      // Get the locator for the 'Prev' button
      const prevItem = productsPage.getPrevBtn();

      // Verify that the 'Prev' button has the 'disabled' class
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

      // Verify that the 'Next' button has the 'disabled' class
      await expect(nextItem).toHaveClass(/disabled/);
    });
  });

  test.describe("Filters", () => {
    // Test to verify that filtering by category shows the correct results
    test("Filters products by category and displays the correct results", async ({
      productsPage,
      productCategories,
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
      productBrands,
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
      productCategories,
      productBrands,
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
      expect(allProductsMatchFilters).toBe(true);

      // Verify that the displayed product IDs match the filtered products (UI check)
      const displayedProductIds = await productsPage.getDisplayedProducts();
      const expectedProductIds = products.map((product) => product.id);

      expect(displayedProductIds).toEqual(
        expect.arrayContaining(expectedProductIds)
      );
    });

    // A 'no results' message appears when no products match the selected filter
    test("Displays a 'no results' message when no products match the filter", async ({
      productsPage,
      productCategories,
    }) => {
      // Apply a category filter
      await productsPage.chooseCategory(productCategories.noResultsCategory);

      // Verify that a 'no results' message appears
      await expect(productsPage.noResults).toContainText(
        "There are no products found."
      );
    });

    // Verify that selected filters don't change or disappear when user navigates product pages via pagination
    test("Filters persist when navigating between paginated pages", async ({
      productsPage,
      productCategories,
      productBrands,
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

      // Check that filters still apply
      products.forEach((product) => {
        const categoryName = product.category.name.toLowerCase();
        const brandName = product.brand.name.toLowerCase();

        const matchesCategory =
          categoryName === productCategories.selectedCategory.toLowerCase() ||
          categoryName ===
            productCategories.multiplePagesCategory.toLowerCase();
        const matchesBrand =
          brandName === productBrands.selectedBrand.toLowerCase();

        // Check that products' category and brand match the selected category and brand
        expect(matchesCategory && matchesBrand).toBe(true);
      });
    });

    // Test to verify that unchecking the only active filter restores the full product list
    test("Unchecking the only active filter restores the full product list", async ({
      productsPage,
      productCategories,
    }) => {
      // Get the full product list before applying any filters
      const initialResponse = await productsPage.fetchCurrentPageData();
      const initialProducts = initialResponse.data;
      const initialProductsCount = initialProducts.length;

      // Apply a category filter
      await productsPage.chooseCategory(productCategories.selectedCategory);
      const filteredResponse = await productsPage.waitForCategoryResponse();
      const filteredProducts = (await filteredResponse.json()).data;
      const filteredProductsCount = filteredProducts.length;

      // Verify that the product count decreased after filtering
      expect(filteredProductsCount).toBeLessThan(initialProductsCount);

      // Uncheck the category filter
      await productsPage.chooseCategory(productCategories.selectedCategory);
      const finalResponse = await productsPage.fetchCurrentPageData();
      const finalProducts = finalResponse.data;
      const finalProductsCount = finalProducts.length;

      // Verify that the final product list matches the initial full product list
      expect(finalProductsCount).toEqual(initialProductsCount);
      expect(finalProducts).toEqual(initialProducts);
    });

    test("Unchecking a category filter while another is still checked displays the correct products", async ({
      productsPage,
      productCategories,
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

      updatedProducts.forEach((product) => {
        const categoryName = product.category.name.toLowerCase();

        // Verify that the remaining products belong to the second category
        expect(categoryName).toContain(
          productCategories.secondCategory.toLowerCase()
        );

        // ...and that they don't belong to the first (now unchecked) category
        expect(categoryName).not.toContain(
          productCategories.selectedCategory.toLowerCase()
        );
      });
    });

    test("Selecting multiple category filters displays products from all selected categories", async ({
      productsPage,
      productCategories,
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
      productBrands,
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
