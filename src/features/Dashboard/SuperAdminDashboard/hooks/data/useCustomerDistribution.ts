import { useQuery } from "@tanstack/react-query";
import { getCustomerDistributionService } from "../../../../../services/api/dashboard.api";

const useCustomerDistribution = () => {
    return useQuery({
        queryKey: ["dashboard", "customer-distribution"],
        queryFn: getCustomerDistributionService,
    });
};

export default useCustomerDistribution;
