import { useQuery } from "@tanstack/react-query";
import { getSecurityAlertsService } from "../../../../../services/api/dashboard.api";

const useSecurityAlerts = () => {
    return useQuery({
        queryKey: ["dashboard", "security-alerts"],
        queryFn: getSecurityAlertsService,
    });
};

export default useSecurityAlerts;
