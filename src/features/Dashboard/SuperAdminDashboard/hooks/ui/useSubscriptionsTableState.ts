import { useState } from "react";
import { useSearchParams } from "react-router";
import useDebounce from "../../../../../hooks/useDebounce";
import { INITIAL_SUBSCRIPTIONS_QUERY, SEARCH_DEBOUNCE_MS } from "../../constants";
import type { SubscriptionsQueryParams, SubscriptionsSortField, SubscriptionStatus } from "../../types";

const useSubscriptionsTableState = () => {
    // Deep-link from the Plans tab's "Manage Subscribers" / distribution-chart
    // click (?tab=subscriptions&plan=<tier name>) - absent on a normal visit.
    const [searchParams, setSearchParams] = useSearchParams();
    const planNameFromUrl = searchParams.get("plan") ?? undefined;

    const [searchInput, setSearchInput] = useState("");
    const [planName, setPlanName] = useState<string | undefined>(planNameFromUrl);
    const [billingInterval, setBillingInterval] = useState<"Monthly" | "Yearly" | undefined>(undefined);
    const [status, setStatus] = useState<SubscriptionStatus | undefined>(undefined);
    const [sortBy, setSortBy] = useState<SubscriptionsSortField>(INITIAL_SUBSCRIPTIONS_QUERY.sortBy);
    const [sortDescending, setSortDescending] = useState(INITIAL_SUBSCRIPTIONS_QUERY.sortDescending);
    const [page, setPage] = useState(INITIAL_SUBSCRIPTIONS_QUERY.page);

    const debouncedSearch = useDebounce({
        value: searchInput,
        debounceTimeMs: SEARCH_DEBOUNCE_MS,
    });

    const query: SubscriptionsQueryParams = {
        page,
        pageSize: INITIAL_SUBSCRIPTIONS_QUERY.pageSize,
        search: debouncedSearch.trim() || undefined,
        planName,
        billingInterval,
        status,
        sortBy,
        sortDescending,
    };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        setPage(1);
    };

    const handlePlanNameChange = (value: string) => {
        setPlanName(value || undefined);
        setPage(1);

        // Keep the URL in sync so the filter survives a refresh, and clears the
        // deep-link param once the admin picks something else themselves.
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value) {
                next.set("plan", value);
            } else {
                next.delete("plan");
            }
            return next;
        });
    };

    const clearPlanFilter = () => handlePlanNameChange("");

    const handleBillingIntervalChange = (value: "Monthly" | "Yearly" | "") => {
        setBillingInterval(value || undefined);
        setPage(1);
    };

    const handleStatusChange = (value: SubscriptionStatus | "") => {
        setStatus(value || undefined);
        setPage(1);
    };

    const handleSortChange = (field: SubscriptionsSortField) => {
        setSortDescending(sortBy === field ? !sortDescending : true);
        setSortBy(field);
        setPage(1);
    };

    return {
        query,
        searchInput,
        planName,
        billingInterval,
        status,

        handleSearchChange,
        handlePlanNameChange,
        clearPlanFilter,
        handleBillingIntervalChange,
        handleStatusChange,
        handleSortChange,
        setPage,
    };
};

export default useSubscriptionsTableState;
