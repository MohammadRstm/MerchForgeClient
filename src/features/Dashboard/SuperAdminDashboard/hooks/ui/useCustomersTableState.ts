import { useState } from "react";
import { useSearchParams } from "react-router";
import useDebounce from "../../../../../hooks/useDebounce";
import { INITIAL_CUSTOMERS_QUERY, SEARCH_DEBOUNCE_MS } from "../../constants";
import type { CustomersQueryParams, CustomersSortField } from "../../types";

const useCustomersTableState = () => {
    // Optional deep-link filter from the Business Detail page's Customers
    // cross-link (?businessId=...) - absent on a normal visit, so the page's
    // default behavior is unchanged.
    const [searchParams] = useSearchParams();
    const businessId = searchParams.get("businessId") ?? undefined;
    const businessName = searchParams.get("businessName") ?? undefined;

    const [searchInput, setSearchInput] = useState("");
    const [sortBy, setSortBy] = useState<CustomersSortField>(INITIAL_CUSTOMERS_QUERY.sortBy);
    const [sortDescending, setSortDescending] = useState(INITIAL_CUSTOMERS_QUERY.sortDescending);
    const [page, setPage] = useState(INITIAL_CUSTOMERS_QUERY.page);

    const debouncedSearch = useDebounce({
        value: searchInput,
        debounceTimeMs: SEARCH_DEBOUNCE_MS,
    });

    const query: CustomersQueryParams = {
        page,
        pageSize: INITIAL_CUSTOMERS_QUERY.pageSize,
        search: debouncedSearch.trim() || undefined,
        businessId,
        sortBy,
        sortDescending,
    };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        setPage(1);
    };

    const handleSortChange = (field: CustomersSortField) => {
        setSortDescending(sortBy === field ? !sortDescending : true);
        setSortBy(field);
        setPage(1);
    };

    return {
        query,
        searchInput,
        businessId,
        businessName,

        handleSearchChange,
        handleSortChange,
        setPage,
    };
};

export default useCustomersTableState;
