import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../../components/DashboardWidgets/StatCards";
import { formatCurrency } from "../utils/formatCurrency";
import type { CustomerStatsResponse } from "../types";

type CustomerInsightsProps = {
    stats?: CustomerStatsResponse;
    isLoading: boolean;
    isError: boolean;
    onSelectNoOrders: () => void;
};

/** Repeat customer = 2+ orders, exactly as the metric's own label says - no fuzzier segmentation. */
const CustomerInsights = ({ stats, isLoading, isError, onSelectNoOrders }: CustomerInsightsProps) => {
    if (isLoading) {
        return (
            <div className="dashboard-stats-loading">
                <Spinner size={24} />
            </div>
        );
    }

    if (isError || !stats) {
        return null;
    }

    const topRevenue = [...stats.revenueByCurrency].sort((a, b) => b.totalSpent - a.totalSpent)[0];
    const avgSpend = topRevenue && topRevenue.customerCount > 0 ? topRevenue.totalSpent / topRevenue.customerCount : null;

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Customer Insights</h3>
            </div>
            <StatCards
                cards={[
                    { label: "Avg. Orders / Customer", value: stats.averageOrdersPerCustomer.toFixed(1) },
                    {
                        label: `Avg. Spend / Customer${topRevenue ? ` (${topRevenue.currency})` : ""}`,
                        value: avgSpend !== null ? formatCurrency(avgSpend, topRevenue.currency) : "—",
                    },
                    {
                        label: "Customers Without Orders",
                        value: stats.customersWithoutOrders,
                        onClick: onSelectNoOrders,
                    },
                    {
                        label: "Repeat Customer Rate",
                        value: stats.repeatCustomerRate !== null ? `${Math.round(stats.repeatCustomerRate * 100)}%` : "—",
                    },
                ]}
            />
        </section>
    );
};

export default CustomerInsights;
