import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDashboardCustomersService } from "../../../../../services/api/dashboard.api";
import type { CustomersQueryParams } from "../../types";

const useDashboardCustomers = (query: CustomersQueryParams) => {
    return useQuery({
        queryKey: ["dashboard", "customers", query],
        queryFn: () => getDashboardCustomersService(query),
        placeholderData: keepPreviousData,
    });
};

export default useDashboardCustomers;
