import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAuditLogsService } from "../../../../../services/api/dashboard.api";
import type { AuditLogQueryParams } from "../../types";

const useAuditLogs = (query: AuditLogQueryParams) => {
    return useQuery({
        queryKey: ["dashboard", "audit-logs", query],
        queryFn: () => getAuditLogsService(query),
        placeholderData: keepPreviousData,
    });
};

export default useAuditLogs;
