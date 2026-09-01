import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getBusinessCustomerSnapshotService } from "../../../../../services/api/dashboard.api";

const useBusinessCustomerSnapshot = (businessId: string, from: string, to: string) => {
    return useQuery({
        queryKey: ["dashboard", "business-customer-snapshot", businessId, from, to],
        queryFn: () => getBusinessCustomerSnapshotService(businessId, from, to),
        enabled: !!businessId && !!from && !!to,
        placeholderData: keepPreviousData,
    });
};

export default useBusinessCustomerSnapshot;
