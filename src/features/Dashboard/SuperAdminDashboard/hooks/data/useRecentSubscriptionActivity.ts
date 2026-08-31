import { useQuery } from "@tanstack/react-query";
import { getRecentSubscriptionActivityService } from "../../../../../services/api/dashboard.api";

const useRecentSubscriptionActivity = (take = 10) => {
    return useQuery({
        queryKey: ["dashboard", "recent-subscription-activity", take],
        queryFn: () => getRecentSubscriptionActivityService(take),
    });
};

export default useRecentSubscriptionActivity;
