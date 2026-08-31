import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../../components/DashboardWidgets/StatCards";
import type { PlanSubscriptionStats } from "../types";

type PlanSubscriptionKpisProps = {
    stats?: PlanSubscriptionStats;
    isLoading: boolean;
    isError: boolean;
};

const PlanSubscriptionKpis = ({ stats, isLoading, isError }: PlanSubscriptionKpisProps) => {
    if (isLoading) {
        return (
            <div className="dashboard-stats-loading">
                <Spinner size={24} />
            </div>
        );
    }

    if (isError || !stats) {
        return (
            <p className="dashboard-table-message dashboard-table-message--error">
                Unable to load platform plan statistics.
            </p>
        );
    }

    return (
        <StatCards
            cards={[
                { label: "Total Plans", value: stats.totalPlans },
                { label: "Active Plans", value: stats.activePlans },
                { label: "Subscribed Businesses", value: stats.subscribedBusinesses },
                { label: "Monthly Subscriptions", value: stats.monthlySubscriptions },
                { label: "Yearly Subscriptions", value: stats.yearlySubscriptions },
            ]}
        />
    );
};

export default PlanSubscriptionKpis;
