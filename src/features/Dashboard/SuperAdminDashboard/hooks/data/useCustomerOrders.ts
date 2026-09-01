import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCustomerOrdersService } from "../../../../../services/api/dashboard.api";
import type { CustomerOrdersQueryParams } from "../../types";

const useCustomerOrders = (customerId: string, query: CustomerOrdersQueryParams) => {
    return useQuery({
        queryKey: ["dashboard", "customer-orders", customerId, query],
        queryFn: () => getCustomerOrdersService(customerId, query),
        enabled: !!customerId,
        placeholderData: keepPreviousData,
    });
};

export default useCustomerOrders;
