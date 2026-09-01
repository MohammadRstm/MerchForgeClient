import { useSearchParams } from "react-router";
import useDashboardStats from "./data/useDashboardStats";
import useDashboardUsers from "./data/useDashboardUsers";
import useAuditLogs from "./data/useAuditLogs";
import useSecurityOverview from "./data/useSecurityOverview";
import useFailedLoginStats from "./data/useFailedLoginStats";
import useSecurityAlerts from "./data/useSecurityAlerts";
import useUsersTableState from "./ui/useUsersTableState";
import useRevokeConfirmation from "./ui/useRevokeConfirmation";
import useUserDetailModal from "./ui/useUserDetailModal";
import useRevokeAllSessionsModal from "./ui/useRevokeAllSessionsModal";
import useAuditLogTableState from "./ui/useAuditLogTableState";

export type AdminUsersTab = "users" | "security";

const useAdminUsersPage = (currentUserId: string) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tab: AdminUsersTab = searchParams.get("tab") === "security" ? "security" : "users";

    const setTab = (nextTab: AdminUsersTab) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (nextTab === "users") {
                next.delete("tab");
            } else {
                next.set("tab", nextTab);
            }
            return next;
        });
    };

    const { data: stats, isLoading: statsLoading, isError: statsError } = useDashboardStats();

    const usersTable = useUsersTableState();
    const {
        data: usersPage,
        isLoading: usersLoading,
        isFetching: usersFetching,
        isError: usersError,
    } = useDashboardUsers(usersTable.query);

    // A lightweight reuse of the same filtered list endpoint, just for its
    // TotalCount - not a second bespoke stats endpoint for one number.
    const { data: activeUsersPage, isLoading: activeUsersLoading } = useDashboardUsers({
        page: 1,
        pageSize: 1,
        isDisabled: false,
        sortBy: "CreatedAt",
        sortDescending: true,
    });

    const revokeConfirmation = useRevokeConfirmation();
    const userDetailModal = useUserDetailModal(currentUserId);
    const revokeAllSessionsModal = useRevokeAllSessionsModal();

    const auditTable = useAuditLogTableState();
    const {
        data: auditLogsPage,
        isLoading: auditLogsLoading,
        isFetching: auditLogsFetching,
        isError: auditLogsError,
    } = useAuditLogs(auditTable.query);

    const {
        data: securityOverview,
        isLoading: securityOverviewLoading,
        isError: securityOverviewError,
    } = useSecurityOverview();

    const {
        data: failedLoginStats,
        isLoading: failedLoginStatsLoading,
        isError: failedLoginStatsError,
    } = useFailedLoginStats();

    const {
        data: securityAlerts,
        isLoading: securityAlertsLoading,
        isError: securityAlertsError,
    } = useSecurityAlerts();

    const goToUserRole = (systemRole: NonNullable<typeof usersTable.query.systemRole>) => {
        usersTable.handleSystemRoleChange(systemRole);
    };

    return {
        tab,
        setTab,

        stats,
        statsLoading,
        statsError,
        activeUsersCount: activeUsersPage?.totalCount,
        activeUsersLoading,

        usersPage,
        usersLoading,
        usersFetching,
        usersError,
        usersTable,
        revokeConfirmation,
        userDetailModal,
        revokeAllSessionsModal,
        goToUserRole,

        auditTable,
        auditLogsPage,
        auditLogsLoading,
        auditLogsFetching,
        auditLogsError,

        securityOverview,
        securityOverviewLoading,
        securityOverviewError,
        failedLoginStats,
        failedLoginStatsLoading,
        failedLoginStatsError,
        securityAlerts,
        securityAlertsLoading,
        securityAlertsError,
    };
};

export default useAdminUsersPage;
