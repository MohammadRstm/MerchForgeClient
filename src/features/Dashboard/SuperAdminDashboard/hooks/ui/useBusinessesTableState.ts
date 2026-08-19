import { useState } from "react";
import useDebounce from "../../../../../hooks/useDebounce";
import { INITIAL_BUSINESSES_QUERY, SEARCH_DEBOUNCE_MS } from "../../constants";
import type { BusinessesQueryParams, BusinessesSortField } from "../../types";

const useBusinessesTableState = () => {
    const [searchInput, setSearchInput] = useState("");
    const [sortBy, setSortBy] = useState<BusinessesSortField>(INITIAL_BUSINESSES_QUERY.sortBy);
    const [sortDescending, setSortDescending] = useState(INITIAL_BUSINESSES_QUERY.sortDescending);
    const [page, setPage] = useState(INITIAL_BUSINESSES_QUERY.page);

    const debouncedSearch = useDebounce({
        value: searchInput,
        debounceTimeMs: SEARCH_DEBOUNCE_MS,
    });

    const query: BusinessesQueryParams = {
        page,
        pageSize: INITIAL_BUSINESSES_QUERY.pageSize,
        search: debouncedSearch.trim() || undefined,
        sortBy,
        sortDescending,
    };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        setPage(1);
    };

    const handleSortChange = (field: BusinessesSortField) => {
        setSortDescending(sortBy === field ? !sortDescending : true);
        setSortBy(field);
        setPage(1);
    };

    return {
        query,
        searchInput,

        handleSearchChange,
        handleSortChange,
        setPage,
    };
};

export default useBusinessesTableState;
