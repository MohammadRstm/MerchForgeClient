import { useQuery } from "@tanstack/react-query";
import { getCustomerSpendOverTimeService } from "../../../../../services/api/dashboard.api";

const useCustomerSpendOverTime = (customerId: string) => {
    return useQuery({
        queryKey: ["dashboard", "customer-spend-over-time", customerId],
        queryFn: () => getCustomerSpendOverTimeService(customerId),
        enabled: !!customerId,
    });
};

export default useCustomerSpendOverTime;
