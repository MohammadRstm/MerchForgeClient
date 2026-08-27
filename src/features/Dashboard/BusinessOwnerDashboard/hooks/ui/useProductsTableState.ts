import { useState } from "react";
import useDebounce from "../../../../../hooks/useDebounce";
import { INITIAL_PRODUCTS_QUERY, SEARCH_DEBOUNCE_MS } from "../../constants";
import type { ProductSortField, ProductStockStatus, ProductsQueryParams } from "../../types";

const useProductsTableState = () => {
    const [searchInput, setSearchInput] = useState("");
    const [category, setCategory] = useState<string | undefined>(undefined);
    // Undefined (not "All") so the Products page, which never sets this, sends no
    // stockStatus param at all — the same wire shape it always has.
    const [stockStatus, setStockStatus] = useState<ProductStockStatus | undefined>(undefined);
    const [sortBy, setSortBy] = useState<ProductSortField>(INITIAL_PRODUCTS_QUERY.sortBy);
    const [sortDescending, setSortDescending] = useState(INITIAL_PRODUCTS_QUERY.sortDescending);
    const [page, setPage] = useState(INITIAL_PRODUCTS_QUERY.page);

    const debouncedSearch = useDebounce({
        value: searchInput,
        debounceTimeMs: SEARCH_DEBOUNCE_MS,
    });

    const query: ProductsQueryParams = {
        page,
        pageSize: INITIAL_PRODUCTS_QUERY.pageSize,
        search: debouncedSearch.trim() || undefined,
        category,
        stockStatus,
        sortBy,
        sortDescending,
    };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        setPage(1);
    };

    const handleCategoryChange = (value: string | undefined) => {
        setCategory(value);
        setPage(1);
    };

    const handleStockStatusChange = (value: ProductStockStatus | undefined) => {
        setStockStatus(value);
        setPage(1);
    };

    const handleSortChange = (field: ProductSortField) => {
        setSortDescending(sortBy === field ? !sortDescending : true);
        setSortBy(field);
        setPage(1);
    };

    return {
        query,
        searchInput,

        handleSearchChange,
        handleCategoryChange,
        handleStockStatusChange,
        handleSortChange,
        setPage,
    };
};

export default useProductsTableState;
