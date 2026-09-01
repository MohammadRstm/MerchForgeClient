import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDashboardWebsiteTemplatesService } from "../../../../../services/api/dashboard.api";
import type { WebsiteTemplatesQueryParams } from "../../types";

const useDashboardWebsiteTemplates = (query: WebsiteTemplatesQueryParams) => {
    return useQuery({
        queryKey: ["dashboard", "website-templates", query],
        queryFn: () => getDashboardWebsiteTemplatesService(query),
        placeholderData: keepPreviousData,
    });
};

export default useDashboardWebsiteTemplates;
