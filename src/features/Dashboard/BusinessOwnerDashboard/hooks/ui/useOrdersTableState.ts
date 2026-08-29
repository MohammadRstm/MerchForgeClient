import { useMemo, useState } from "react";
import useDebounce from "../../../../../hooks/useDebounce";
import { DEFAULT_PAGE_SIZE, SEARCH_DEBOUNCE_MS } from "../../constants";
import { resolveOrderDateRange } from "../../utils/orderDateRange";
import type { OrderDateFilterPreset, OrderStatus, OrdersQueryParams } from "../../types";

const useOrdersTableState = () => {
    const [searchInput, setSearchInput] = useState("");
    const [status, setStatus] = useState<OrderStatus | undefined>(undefined);
    const [datePreset, setDatePreset] = useState<OrderDateFilterPreset>("all");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebounce({
        value: searchInput,
        debounceTimeMs: SEARCH_DEBOUNCE_MS,
    });

    const { from, to } = useMemo(
        () => resolveOrderDateRange(datePreset, customFrom, customTo),
        [datePreset, customFrom, customTo]
    );

    const query: OrdersQueryParams = {
        page,
        pageSize: DEFAULT_PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
        status,
        from,
        to,
    };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        setPage(1);
    };

    const handleStatusChange = (value: OrderStatus | undefined) => {
        setStatus(value);
        setPage(1);
    };

    const handleDatePresetChange = (value: OrderDateFilterPreset) => {
        setDatePreset(value);
        if (value !== "custom") {
            setCustomFrom("");
            setCustomTo("");
        }
        setPage(1);
    };

    const handleCustomDateChange = (field: "from" | "to", value: string) => {
        if (field === "from") setCustomFrom(value);
        else setCustomTo(value);
        setPage(1);
    };

    const hasActiveFilters = Boolean(searchInput || status || datePreset !== "all");

    const clearFilters = () => {
        setSearchInput("");
        setStatus(undefined);
        setDatePreset("all");
        setCustomFrom("");
        setCustomTo("");
        setPage(1);
    };

    return {
        query,
        searchInput,
        status,
        datePreset,
        customFrom,
        customTo,
        hasActiveFilters,

        handleSearchChange,
        handleStatusChange,
        handleDatePresetChange,
        handleCustomDateChange,
        clearFilters,
        setPage,
    };
};

export default useOrdersTableState;
