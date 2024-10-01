export interface ProductCategories {
  selectedCategory: string;
  secondCategory: string;
  noResultsCategory: string;
  multiplePagesCategory: string;
}

export interface ProductBrands {
  selectedBrand: string;
  secondBrand: string;
}

// Categories of products
export const productCategories = {
  selectedCategory: "Hammer", // Selected category for filtering tests
  secondCategory: "Wrench", // Second category for multi-filter testing
  noResultsCategory: "Grinder", // Category with no results to test empty product page
  multiplePagesCategory: "Measures", // Category with enough products to span multiple pages
};

// Brands of products
export const productBrands = {
  selectedBrand: "ForgeFlex Tools", // Selected brand for filtering tests
  secondBrand: "MightyCraft Hardware", // Second brand for multi-filter testing
};
