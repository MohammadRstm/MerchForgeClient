import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDashboardUsersService } from "../../../../../services/api/dashboard.api";
import type { UsersQueryParams } from "../../types";

const useDashboardUsers = (query: UsersQueryParams) => {
    return useQuery({
        queryKey: ["dashboard", "users", query],
        queryFn: () => getDashboardUsersService(query),
        placeholderData: keepPreviousData,
    });
};

export default useDashboardUsers;
