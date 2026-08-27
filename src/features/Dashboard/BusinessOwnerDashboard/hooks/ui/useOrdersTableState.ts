import { useState } from "react";
import useDebounce from "../../../../../hooks/useDebounce";
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../../constants";
import type { OrderStatus, OrdersQueryParams } from "../../types";

const useOrdersTableState = () => {
    const [searchInput, setSearchInput] = useState("");
    const [status, setStatus] = useState<OrderStatus | undefined>(undefined);
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebounce({
        value: searchInput,
        debounceTimeMs: SEARCH_DEBOUNCE_MS,
    });

    const query: OrdersQueryParams = {
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
        status,
    };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        setPage(1);
    };

    const handleStatusChange = (value: OrderStatus | undefined) => {
        setStatus(value);
        setPage(1);
    };

    return {
        query,
        searchInput,

        handleSearchChange,
        handleStatusChange,
        setPage,
    };
};

export default useOrdersTableState;
