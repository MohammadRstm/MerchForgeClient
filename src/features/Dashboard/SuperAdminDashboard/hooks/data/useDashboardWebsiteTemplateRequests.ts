import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDashboardWebsiteTemplateRequestsService } from "../../../../../services/api/dashboard.api";
import type { WebsiteTemplateRequestsQueryParams } from "../../types";

const useDashboardWebsiteTemplateRequests = (query: WebsiteTemplateRequestsQueryParams) => {
    return useQuery({
        queryKey: ["dashboard", "website-template-requests", query],
        queryFn: () => getDashboardWebsiteTemplateRequestsService(query),
        placeholderData: keepPreviousData,
    });
};

export default useDashboardWebsiteTemplateRequests;
