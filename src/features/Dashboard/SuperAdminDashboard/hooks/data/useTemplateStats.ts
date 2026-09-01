import { useQuery } from "@tanstack/react-query";
import { getTemplateStatsService } from "../../../../../services/api/dashboard.api";

const useTemplateStats = () => {
    return useQuery({
        queryKey: ["dashboard", "template-stats"],
        queryFn: getTemplateStatsService,
    });
};

export default useTemplateStats;
