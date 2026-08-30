import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCustomerSnapshotService } from "../../../../../services/api/businessDashboard.api";

const useCustomerSnapshot = (businessId: string, from: string, to: string) => {
    return useQuery({
        queryKey: ["business-dashboard", "customer-snapshot", businessId, from, to],
        queryFn: () => getCustomerSnapshotService(businessId, from, to),
        enabled: !!businessId && !!from && !!to,
        placeholderData: keepPreviousData,
    });
};

export default useCustomerSnapshot;
