import { useQuery } from "@tanstack/react-query";
import { getDashboardCustomerDetailService } from "../../../../../services/api/dashboard.api";

const useDashboardCustomerDetail = (customerId: string) => {
    return useQuery({
        queryKey: ["dashboard", "customer-detail", customerId],
        queryFn: () => getDashboardCustomerDetailService(customerId),
        enabled: !!customerId,
    });
};

export default useDashboardCustomerDetail;
