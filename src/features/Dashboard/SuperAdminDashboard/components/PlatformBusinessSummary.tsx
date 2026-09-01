import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../../components/DashboardWidgets/StatCards";
import { formatCurrency } from "../utils/formatCurrency";
import type { DashboardStatsResponse } from "../types";

type PlatformBusinessSummaryProps = {
    stats?: DashboardStatsResponse;
    isLoading: boolean;
    isError: boolean;
};

const PlatformBusinessSummary = ({ stats, isLoading, isError }: PlatformBusinessSummaryProps) => {
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
                Unable to load the platform summary.
            </p>
        );
    }

    const revenueEntries = [...stats.recordedOrderRevenue].sort((a, b) => b.total - a.total);
    const primaryRevenue = revenueEntries[0];
    // Recorded order totals, never described as money collected - no payment gateway exists yet.
    const revenueLabel =
        revenueEntries.length > 1
            ? `Recorded Order Revenue (+${revenueEntries.length - 1} more)`
            : "Recorded Order Revenue";

    return (
        <StatCards
            cards={[
                { label: "Total Businesses", value: stats.totalBusinesses },
                { label: "Added Last 30 Days", value: stats.businessesAddedRecently },
                { label: "Total Products", value: stats.totalProducts },
                { label: "Total Orders", value: stats.totalOrders },
                {
                    label: revenueLabel,
                    value: primaryRevenue ? formatCurrency(primaryRevenue.total, primaryRevenue.currency) : "—",
                },
            ]}
        />
    );
};

export default PlatformBusinessSummary;
