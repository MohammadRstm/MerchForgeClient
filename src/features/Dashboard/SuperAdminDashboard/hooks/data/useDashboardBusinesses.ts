import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDashboardBusinessesService } from "../../../../../services/api/dashboard.api";
import type { BusinessesQueryParams } from "../../types";

const useDashboardBusinesses = (query: BusinessesQueryParams) => {
    return useQuery({
        queryKey: ["dashboard", "businesses", query],
        queryFn: () => getDashboardBusinessesService(query),
        placeholderData: keepPreviousData,
    });
};

export default useDashboardBusinesses;
