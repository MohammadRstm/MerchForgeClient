import type { ProductsQueryParams } from "./types";

export const DEFAULT_PAGE_SIZE = 10;

export const INITIAL_PRODUCTS_QUERY: ProductsQueryParams = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "CreatedAt",
    sortDescending: true,
};

export const SEARCH_DEBOUNCE_MS = 400;
