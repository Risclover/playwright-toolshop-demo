// tests/products/products.spec.ts
import { test, expect } from "./products.fixtures";
import {
  productCategories,
  brandCategories,
} from "../../test-data/productData";

test.describe("Products Page", () => {
  test.describe("Pagination", () => {
    test("Clicking on a pagination number navigates to the corresponding product page", async ({
      productsPage,
    }) => {
      const firstPageProducts = await productsPage.fetchProductsByPage(1);
      await productsPage.navigateToPage(3);
      const thirdPageProducts = await productsPage.fetchProductsByPage(3);

      expect(thirdPageProducts.data[0].id).not.toEqual(
        firstPageProducts.data[0].id
      );
    });

    test("Displays the same number of products across multiple pages when the page is full of products", async ({
      productsPage,
    }) => {
      const firstPageData = await productsPage.fetchProductsByPage(1);
      const perPage = firstPageData.per_page;

      expect(firstPageData.data.length).toEqual(perPage);

      await productsPage.navigateToPage(3);
      const thirdPageData = await productsPage.fetchProductsByPage(3);

      expect(thirdPageData.data.length).toEqual(perPage);
      expect(firstPageData.data.length).toEqual(thirdPageData.data.length);
    });

    test("Displays different products on each page during pagination", async ({
      productsPage,
    }) => {
      const firstPageProducts = await productsPage.fetchProductsByPage(1);
      await productsPage.clickNext();

      const secondPageProducts = await productsPage.fetchProductsByPage(2);
      expect(secondPageProducts.data[0].id).not.toEqual(
        firstPageProducts.data[0].id
      );
    });

    test("'Next' button correctly navigates to the next page", async ({
      productsPage,
    }) => {
      await productsPage.clickNext();
      const pageData = await productsPage.fetchCurrentPageData();
      expect(pageData.current_page).toEqual(2);
    });

    test("'Prev' button correctly navigates to the previous page", async ({
      productsPage,
    }) => {
      await productsPage.navigateToPage(2);
      await productsPage.fetchCurrentPageData();

      await productsPage.clickPrev();
      const pageData = await productsPage.fetchCurrentPageData();
      expect(pageData.current_page).toEqual(1);
    });

    test("'Prev' button is disabled when on the first product page", async ({
      productsPage,
    }) => {
      const prevItem = productsPage.getPrevListItem();
      await expect(prevItem).toHaveClass(/disabled/);
    });

    test("'Next' button is disabled when on the last product page", async ({
      productsPage,
    }) => {
      await productsPage.navigateToLastPage();
      const nextItem = productsPage.getNextListItem();
      await expect(nextItem).toHaveClass(/disabled/);
    });
  });

  test.describe("Filters", () => {
    test("Filters products by category and displays the correct results", async ({
      productsPage,
    }) => {
      await productsPage.chooseCategory(productCategories.selectedCategory);

      const response = await productsPage.waitForCategoryResponse();
      await productsPage.waitForProductSelector();
      const responseBody = await response.json();

      const products = responseBody.data;

      const categories = products.map((product: any) => product.category.name);

      categories.forEach((category: string) => {
        expect(category.toLowerCase()).toEqual(
          productCategories.selectedCategory.toLowerCase()
        );
      });
    });

    test("Filters products by brand and displays the correct results", async ({
      productsPage,
    }) => {
      await productsPage.chooseBrand(brandCategories.selectedBrand);
      const response = await productsPage.waitForBrandResponse();
      await productsPage.waitForProductSelector();
      const products = (await response.json()).data;

      const brands = products.map((product: any) => product.brand.name);

      brands.forEach((brand: string) =>
        expect(brand.toLowerCase()).toEqual(
          brandCategories.selectedBrand.toLowerCase()
        )
      );
    });

    test("Filters products by both category and brand and displays the correct results", async ({
      productsPage,
      page,
    }) => {
      await productsPage.chooseCategory(productCategories.selectedCategory);
      await productsPage.waitForCategoryResponse();

      await productsPage.chooseBrand(brandCategories.selectedBrand);
      const response = await productsPage.waitForBrandResponse();
      const products = (await response.json()).data;

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

      const displayedTitles = await page
        .locator('h5[data-test="product-name"]')
        .allTextContents();

      displayedTitles.forEach((title) => {
        expect(title.toLowerCase()).toContain(
          productCategories.selectedCategory.toLowerCase()
        );
      });
    });

    test("Displays a 'no results' message when no products match the filter", async ({
      productsPage,
    }) => {
      await productsPage.chooseCategory(productCategories.noResultsCategory);

      await expect(productsPage.noResults).toContainText(
        "There are no products found."
      );
    });

    test("Filters persist when navigating between paginated pages", async ({
      productsPage,
    }) => {
      await productsPage.chooseCategory(productCategories.selectedCategory);
      await productsPage.waitForCategoryResponse();

      await productsPage.chooseCategory(
        productCategories.multiplePagesCategory
      );
      await productsPage.waitForCategoryResponse();

      await productsPage.chooseBrand(brandCategories.selectedBrand);
      const response = await productsPage.waitForBrandResponse();
      const products = (await response.json()).data;

      await productsPage.navigateToPage(2);
      await productsPage.waitForPageCategoryBrandResponse(2);

      products.forEach((product) => {
        const categoryName = product.category.name.toLowerCase();
        const brandName = product.brand.name.toLowerCase();

        const matchesCategory =
          categoryName === productCategories.selectedCategory.toLowerCase() ||
          categoryName ===
            productCategories.multiplePagesCategory.toLowerCase();
        const matchesBrand =
          brandName === brandCategories.selectedBrand.toLowerCase();

        expect(matchesCategory && matchesBrand).toBe(true);
      });
    });

    test("Unchecking the only active filter restores the full product list", async ({
      productsPage,
    }) => {
      await productsPage.chooseCategory(productCategories.selectedCategory);

      const filteredResponse = await productsPage.waitForCategoryResponse();
      const filteredProducts = (await filteredResponse.json()).data;
      const filteredProductsCount = filteredProducts.length;

      await productsPage.chooseCategory(productCategories.selectedCategory);

      const allProductsResponse = await productsPage.fetchCurrentPageData();
      const allProducts = allProductsResponse.data;
      const allProductsCount = allProducts.length;

      expect(allProductsCount).toBeGreaterThanOrEqual(filteredProductsCount);
    });

    test("Unchecking a category filter while another is still checked displays the correct products", async ({
      productsPage,
    }) => {
      await productsPage.chooseCategory(productCategories.selectedCategory);
      await productsPage.waitForCategoryResponse();

      await productsPage.chooseCategory(productCategories.secondCategory);
      await productsPage.waitForCategoryResponse();

      await productsPage.chooseCategory(productCategories.selectedCategory);
      const response = await productsPage.waitForCategoryResponse();

      const updatedProducts = (await response.json()).data;

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
      await productsPage.chooseCategory(productCategories.selectedCategory);
      await productsPage.waitForCategoryResponse();

      await productsPage.chooseCategory(productCategories.secondCategory);
      const response = await productsPage.waitForCategoryResponse();

      const responseBody = await response.json();
      const productsData = responseBody.data;

      const selectedCategories = [
        productCategories.selectedCategory.toLowerCase(),
        productCategories.secondCategory.toLowerCase(),
      ];

      productsData.forEach((product: any) => {
        const categoryName = product.category.name.toLowerCase();
        expect(selectedCategories).toContain(categoryName);
      });
    });

    test("Selecting multiple brand filters displays products from all selected brands", async ({
      productsPage,
      page,
    }) => {
      await productsPage.chooseBrand(brandCategories.selectedBrand);
      await productsPage.waitForBrandResponse();

      await productsPage.chooseBrand(brandCategories.secondBrand);
      const response = await productsPage.waitForBrandResponse();

      const responseBody = await response.json();
      const productsData = responseBody.data;

      const selectedBrands = [
        brandCategories.selectedBrand.toLowerCase(),
        brandCategories.secondBrand.toLowerCase(),
      ];

      productsData.forEach((product) => {
        const brandName = product.brand.name.toLowerCase();
        expect(selectedBrands).toContain(brandName);
      });
    });
  });
});
