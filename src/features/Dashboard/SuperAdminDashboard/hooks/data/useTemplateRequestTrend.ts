import { useQuery } from "@tanstack/react-query";
import { getTemplateRequestTrendService } from "../../../../../services/api/dashboard.api";

const useTemplateRequestTrend = (days: number) => {
    return useQuery({
        queryKey: ["dashboard", "template-request-trend", days],
        queryFn: () => getTemplateRequestTrendService(days),
    });
};

export default useTemplateRequestTrend;
