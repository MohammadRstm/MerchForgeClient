import { useState } from "react";
import { useSearchParams } from "react-router";
import useDebounce from "../../../../../hooks/useDebounce";
import { INITIAL_CUSTOMERS_QUERY, SEARCH_DEBOUNCE_MS } from "../../constants";
import type { CustomersQueryParams, CustomersSortField } from "../../types";

const useCustomersTableState = () => {
    // Optional deep-link filter from the Business Detail page's Customers
    // cross-link (?businessId=...) - absent on a normal visit, so the page's
    // default behavior is unchanged. Also settable directly via the business
    // filter dropdown below, which keeps the URL in sync the same way.
    const [searchParams, setSearchParams] = useSearchParams();
    const businessId = searchParams.get("businessId") ?? undefined;
    const businessName = searchParams.get("businessName") ?? undefined;

    const [searchInput, setSearchInput] = useState("");
    const [hasOrders, setHasOrders] = useState<boolean | undefined>(undefined);
    const [registeredFrom, setRegisteredFrom] = useState("");
    const [registeredTo, setRegisteredTo] = useState("");
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
        hasOrders,
        registeredFrom: registeredFrom ? new Date(`${registeredFrom}T00:00:00`).toISOString() : undefined,
        registeredTo: registeredTo ? new Date(`${registeredTo}T23:59:59`).toISOString() : undefined,
        sortBy,
        sortDescending,
    };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        setPage(1);
    };

    const handleBusinessChange = (id: string, name: string) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (id) {
                next.set("businessId", id);
                next.set("businessName", name);
            } else {
                next.delete("businessId");
                next.delete("businessName");
            }
            return next;
        });
        setPage(1);
    };

    const clearBusinessFilter = () => handleBusinessChange("", "");

    const handleHasOrdersChange = (value: boolean | undefined) => {
        setHasOrders(value);
        setPage(1);
    };

    const handleRegisteredFromChange = (value: string) => {
        setRegisteredFrom(value);
        setPage(1);
    };

    const handleRegisteredToChange = (value: string) => {
        setRegisteredTo(value);
        setPage(1);
    };

    const handleSortChange = (field: CustomersSortField) => {
        setSortDescending(sortBy === field ? !sortDescending : true);
        setSortBy(field);
        setPage(1);
    };

    const clearFilters = () => {
        setSearchInput("");
        setHasOrders(undefined);
        setRegisteredFrom("");
        setRegisteredTo("");
        clearBusinessFilter();
        setPage(1);
    };

    const hasActiveFilters = !!(searchInput || businessId || hasOrders !== undefined || registeredFrom || registeredTo);

    return {
        query,
        searchInput,
        businessId,
        businessName,
        hasOrders,
        registeredFrom,
        registeredTo,
        hasActiveFilters,

        handleSearchChange,
        handleBusinessChange,
        clearBusinessFilter,
        handleHasOrdersChange,
        handleRegisteredFromChange,
        handleRegisteredToChange,
        handleSortChange,
        clearFilters,
        setPage,
    };
};

export default useCustomersTableState;
