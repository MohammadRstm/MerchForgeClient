import type { ProductsQueryParams } from "./types";

export const DEFAULT_PAGE_SIZE = 10;

export const INITIAL_PRODUCTS_QUERY: ProductsQueryParams = {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "CreatedAt",
    sortDescending: true,
};

/** Smaller than DEFAULT_PAGE_SIZE: reviews are listed inside the product detail
 *  modal, which is capped at 85vh and already long by the time it gets there. */
export const REVIEWS_PAGE_SIZE = 5;

export const SEARCH_DEBOUNCE_MS = 400;
