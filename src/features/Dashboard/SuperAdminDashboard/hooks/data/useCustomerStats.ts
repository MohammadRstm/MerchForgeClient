import { useQuery } from "@tanstack/react-query";
import { getCustomerStatsService } from "../../../../../services/api/dashboard.api";

const useCustomerStats = (newCustomersPeriodDays: number) => {
    return useQuery({
        queryKey: ["dashboard", "customer-stats", newCustomersPeriodDays],
        queryFn: () => getCustomerStatsService(newCustomersPeriodDays),
    });
};

export default useCustomerStats;
