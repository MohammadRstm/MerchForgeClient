import { useQuery } from "@tanstack/react-query";
import { getDomainTemplateSummaryService } from "../../../../../services/api/dashboard.api";

const useDomainTemplateSummary = () => {
    return useQuery({
        queryKey: ["dashboard", "domain-template-summary"],
        queryFn: getDomainTemplateSummaryService,
    });
};

export default useDomainTemplateSummary;
