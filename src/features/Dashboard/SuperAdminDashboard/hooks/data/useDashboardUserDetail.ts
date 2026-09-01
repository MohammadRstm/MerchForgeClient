import { useQuery } from "@tanstack/react-query";
import { getDashboardUserDetailService } from "../../../../../services/api/dashboard.api";

const useDashboardUserDetail = (userId: string) => {
    return useQuery({
        queryKey: ["dashboard", "user-detail", userId],
        queryFn: () => getDashboardUserDetailService(userId),
        enabled: !!userId,
    });
};

export default useDashboardUserDetail;
