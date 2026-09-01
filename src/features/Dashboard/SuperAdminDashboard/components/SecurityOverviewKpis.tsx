import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../../components/DashboardWidgets/StatCards";
import type { SecurityOverviewResponse } from "../types";

type SecurityOverviewKpisProps = {
    overview?: SecurityOverviewResponse;
    isLoading: boolean;
    isError: boolean;
};

/** All counts are windowed to the last 30 days, per SecurityOverviewResponse's own contract. */
const SecurityOverviewKpis = ({ overview, isLoading, isError }: SecurityOverviewKpisProps) => {
    if (isLoading) {
        return (
            <div className="dashboard-stats-loading">
                <Spinner size={24} />
            </div>
        );
    }

    if (isError || !overview) {
        return (
            <p className="dashboard-table-message dashboard-table-message--error">
                Unable to load the security overview.
            </p>
        );
    }

    return (
        <StatCards
            cards={[
                { label: "Successful Logins", value: overview.successfulLogins },
                { label: "Failed Logins", value: overview.failedLogins },
                { label: "Active Sessions", value: overview.activeSessions },
                { label: "Admin Actions", value: overview.adminActions },
            ]}
        />
    );
};

export default SecurityOverviewKpis;
