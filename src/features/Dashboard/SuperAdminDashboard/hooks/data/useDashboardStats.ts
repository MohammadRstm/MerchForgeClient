import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsService } from "../../../../../services/api/dashboard.api";

const useDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboard", "stats"],
        queryFn: getDashboardStatsService,
    });
};

export default useDashboardStats;
