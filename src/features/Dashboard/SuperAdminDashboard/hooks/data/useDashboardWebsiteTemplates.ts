import { useQuery } from "@tanstack/react-query";
import { getDashboardWebsiteTemplatesService } from "../../../../../services/api/dashboard.api";

const useDashboardWebsiteTemplates = () => {
    return useQuery({
        queryKey: ["dashboard", "website-templates"],
        queryFn: getDashboardWebsiteTemplatesService,
    });
};

export default useDashboardWebsiteTemplates;
