import { useQuery } from "@tanstack/react-query";
import { getCustomerGrowthService } from "../../../../../services/api/dashboard.api";

const useCustomerGrowth = (days: number) => {
    return useQuery({
        queryKey: ["dashboard", "customer-growth", days],
        queryFn: () => getCustomerGrowthService(days),
    });
};

export default useCustomerGrowth;
