import { useQuery } from "@tanstack/react-query";
import { getBusinessOptionsService } from "../../../../../services/api/dashboard.api";

/** The cheap {id, name} list for a business-filter dropdown - never the full paginated businesses table. */
const useBusinessOptions = () => {
    return useQuery({
        queryKey: ["dashboard", "business-options"],
        queryFn: getBusinessOptionsService,
        staleTime: 5 * 60_000,
    });
};

export default useBusinessOptions;
