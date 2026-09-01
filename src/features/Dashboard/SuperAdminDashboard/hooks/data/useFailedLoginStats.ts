import { useQuery } from "@tanstack/react-query";
import { getFailedLoginStatsService } from "../../../../../services/api/dashboard.api";

const useFailedLoginStats = () => {
    return useQuery({
        queryKey: ["dashboard", "failed-login-stats"],
        queryFn: getFailedLoginStatsService,
    });
};

export default useFailedLoginStats;
