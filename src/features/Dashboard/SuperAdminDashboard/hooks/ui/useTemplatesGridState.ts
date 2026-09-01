import { useState } from "react";
import useDebounce from "../../../../../hooks/useDebounce";
import { SEARCH_DEBOUNCE_MS } from "../../constants";
import type { WebsiteTemplatesQueryParams, WebsiteTemplateSortField } from "../../types";

const PAGE_SIZE = 20;

const useTemplatesGridState = () => {
    const [searchInput, setSearchInput] = useState("");
    const [businessDomainId, setBusinessDomainId] = useState<string | undefined>(undefined);
    const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
    const [hasBusinesses, setHasBusinesses] = useState<boolean | undefined>(undefined);
    const [isCustomizable, setIsCustomizable] = useState<boolean | undefined>(undefined);
    const [sortBy, setSortBy] = useState<WebsiteTemplateSortField>("DisplayOrder");
    const [sortDescending, setSortDescending] = useState(false);
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebounce({ value: searchInput, debounceTimeMs: SEARCH_DEBOUNCE_MS });

    const query: WebsiteTemplatesQueryParams = {
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch.trim() || undefined,
        businessDomainId,
        isActive,
        hasBusinesses,
        isCustomizable,
        sortBy,
        sortDescending,
    };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        setPage(1);
    };

    const handleDomainChange = (value: string) => {
        setBusinessDomainId(value || undefined);
        setPage(1);
    };

    const handleActiveChange = (value: boolean | undefined) => {
        setIsActive(value);
        setPage(1);
    };

    const handleHasBusinessesChange = (value: boolean | undefined) => {
        setHasBusinesses(value);
        setPage(1);
    };

    const handleIsCustomizableChange = (value: boolean | undefined) => {
        setIsCustomizable(value);
        setPage(1);
    };

    const handleSortChange = (field: WebsiteTemplateSortField) => {
        setSortDescending(sortBy === field ? !sortDescending : field === "BusinessesUsingIt" || field === "RequestCount");
        setSortBy(field);
        setPage(1);
    };

    const clearFilters = () => {
        setSearchInput("");
        setBusinessDomainId(undefined);
        setIsActive(undefined);
        setHasBusinesses(undefined);
        setIsCustomizable(undefined);
        setPage(1);
    };

    const hasActiveFilters = !!(
        searchInput ||
        businessDomainId ||
        isActive !== undefined ||
        hasBusinesses !== undefined ||
        isCustomizable !== undefined
    );

    return {
        query,
        searchInput,
        businessDomainId,
        isActive,
        hasBusinesses,
        isCustomizable,
        hasActiveFilters,

        handleSearchChange,
        handleDomainChange,
        handleActiveChange,
        handleHasBusinessesChange,
        handleIsCustomizableChange,
        handleSortChange,
        clearFilters,
        setPage,
    };
};

export default useTemplatesGridState;
