import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDashboardSubscriptionsService } from "../../../../../services/api/dashboard.api";
import type { SubscriptionsQueryParams } from "../../types";

const useDashboardSubscriptions = (query: SubscriptionsQueryParams) => {
    return useQuery({
        queryKey: ["dashboard", "subscriptions", query],
        queryFn: () => getDashboardSubscriptionsService(query),
        placeholderData: keepPreviousData,
    });
};

export default useDashboardSubscriptions;
