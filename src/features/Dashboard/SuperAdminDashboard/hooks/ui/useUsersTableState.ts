import { useState } from "react";
import useDebounce from "../../../../../hooks/useDebounce";
import { INITIAL_USERS_QUERY, SEARCH_DEBOUNCE_MS } from "../../constants";
import type { BusinessRoleFilter, SystemRoleFilter, UsersQueryParams, UsersSortField } from "../../types";

const useUsersTableState = () => {
    const [searchInput, setSearchInput] = useState("");
    const [systemRole, setSystemRole] = useState<SystemRoleFilter | undefined>(undefined);
    const [businessRole, setBusinessRole] = useState<BusinessRoleFilter | undefined>(undefined);
    const [hasActiveSession, setHasActiveSession] = useState<boolean | undefined>(undefined);
    const [isDisabled, setIsDisabled] = useState<boolean | undefined>(undefined);
    const [sortBy, setSortBy] = useState<UsersSortField>(INITIAL_USERS_QUERY.sortBy);
    const [sortDescending, setSortDescending] = useState(INITIAL_USERS_QUERY.sortDescending);
    const [page, setPage] = useState(INITIAL_USERS_QUERY.page);

    const debouncedSearch = useDebounce({
        value: searchInput,
        debounceTimeMs: SEARCH_DEBOUNCE_MS,
    });

    const query: UsersQueryParams = {
        page,
        pageSize: INITIAL_USERS_QUERY.pageSize,
        search: debouncedSearch.trim() || undefined,
        systemRole,
        businessRole,
        hasActiveSession,
        isDisabled,
        sortBy,
        sortDescending,
    };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        setPage(1);
    };

    const handleSystemRoleChange = (value: SystemRoleFilter | undefined) => {
        setSystemRole(value);
        setPage(1);
    };

    const handleBusinessRoleChange = (value: BusinessRoleFilter | undefined) => {
        setBusinessRole(value);
        setPage(1);
    };

    const handleHasActiveSessionChange = (value: boolean | undefined) => {
        setHasActiveSession(value);
        setPage(1);
    };

    const handleIsDisabledChange = (value: boolean | undefined) => {
        setIsDisabled(value);
        setPage(1);
    };

    const handleSortChange = (field: UsersSortField) => {
        setSortDescending(sortBy === field ? !sortDescending : true);
        setSortBy(field);
        setPage(1);
    };

    const clearFilters = () => {
        setSearchInput("");
        setSystemRole(undefined);
        setBusinessRole(undefined);
        setHasActiveSession(undefined);
        setIsDisabled(undefined);
        setPage(1);
    };

    const hasActiveFilters = !!(searchInput || systemRole || businessRole || hasActiveSession !== undefined || isDisabled !== undefined);

    return {
        query,
        searchInput,
        businessRole,
        hasActiveSession,
        isDisabled,
        hasActiveFilters,

        handleSearchChange,
        handleSystemRoleChange,
        handleBusinessRoleChange,
        handleHasActiveSessionChange,
        handleIsDisabledChange,
        handleSortChange,
        clearFilters,
        setPage,
    };
};

export default useUsersTableState;
