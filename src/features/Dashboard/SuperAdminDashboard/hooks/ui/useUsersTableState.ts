import { useState } from "react";
import useDebounce from "../../../../../hooks/useDebounce";
import { INITIAL_USERS_QUERY, SEARCH_DEBOUNCE_MS } from "../../constants";
import type { SystemRoleFilter, UsersQueryParams, UsersSortField } from "../../types";

const useUsersTableState = () => {
    const [searchInput, setSearchInput] = useState("");
    const [systemRole, setSystemRole] = useState<SystemRoleFilter | undefined>(undefined);
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

    const handleSortChange = (field: UsersSortField) => {
        setSortDescending(sortBy === field ? !sortDescending : true);
        setSortBy(field);
        setPage(1);
    };

    return {
        query,
        searchInput,

        handleSearchChange,
        handleSystemRoleChange,
        handleSortChange,
        setPage,
    };
};

export default useUsersTableState;
