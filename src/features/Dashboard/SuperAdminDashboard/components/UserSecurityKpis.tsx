import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../../components/DashboardWidgets/StatCards";
import type { DashboardStatsResponse } from "../types";

type UserSecurityKpisProps = {
    stats?: DashboardStatsResponse;
    isLoading: boolean;
    isError: boolean;
    activeUsersCount?: number;
    activeUsersLoading: boolean;
};

const UserSecurityKpis = ({ stats, isLoading, isError, activeUsersCount, activeUsersLoading }: UserSecurityKpisProps) => {
    if (isLoading || activeUsersLoading) {
        return (
            <div className="dashboard-stats-loading">
                <Spinner size={24} />
            </div>
        );
    }

    if (isError || !stats) {
        return (
            <p className="dashboard-table-message dashboard-table-message--error">
                Unable to load platform user statistics.
            </p>
        );
    }

    const superAdmins = stats.usersBySystemRole.find((r) => r.key === "SuperAdmin")?.count ?? 0;
    const admins = stats.usersBySystemRole.find((r) => r.key === "Admin")?.count ?? 0;

    return (
        <StatCards
            cards={[
                { label: "Total Users", value: stats.totalUsers },
                { label: "Active Users", value: activeUsersCount ?? stats.totalUsers },
                { label: "Active Sessions", value: stats.activeSessionCount },
                { label: "Super Admins", value: superAdmins },
                { label: "Admins", value: admins },
            ]}
        />
    );
};

export default UserSecurityKpis;
