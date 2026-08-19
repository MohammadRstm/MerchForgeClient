import { useQuery } from "@tanstack/react-query";
import { getBusinessMembersService } from "../../../../../services/api/businessDashboard.api";

const useBusinessMembers = (businessId: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "members", businessId],
        queryFn: () => getBusinessMembersService(businessId),
        enabled: !!businessId,
    });
};

export default useBusinessMembers;
