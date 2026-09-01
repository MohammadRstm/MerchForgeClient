import { useQuery } from "@tanstack/react-query";
import { getSecurityOverviewService } from "../../../../../services/api/dashboard.api";

const useSecurityOverview = () => {
    return useQuery({
        queryKey: ["dashboard", "security-overview"],
        queryFn: getSecurityOverviewService,
    });
};

export default useSecurityOverview;
