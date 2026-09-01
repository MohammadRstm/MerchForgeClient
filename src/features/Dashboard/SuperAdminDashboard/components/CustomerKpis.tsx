import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import StatCards from "../../../../components/DashboardWidgets/StatCards";
import { formatCurrency } from "../utils/formatCurrency";
import type { CustomerStatsResponse } from "../types";

type CustomerKpisProps = {
    stats?: CustomerStatsResponse;
    isLoading: boolean;
    isError: boolean;
    periodDays: number;
    onPeriodChange: (days: number) => void;
};

const PERIOD_OPTIONS = [
    { label: "Today", days: 1 },
    { label: "7 Days", days: 7 },
    { label: "30 Days", days: 30 },
];

/** Revenue is shown for the single largest currency bucket - see the KPI's own label for why it's never collapsed across currencies. */
const CustomerKpis = ({ stats, isLoading, isError, periodDays, onPeriodChange }: CustomerKpisProps) => {
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
                Unable to load customer statistics.
            </p>
        );
    }

    const topRevenue = [...stats.revenueByCurrency].sort((a, b) => b.totalSpent - a.totalSpent)[0];

    return (
        <>
            <div className="analytics-header-controls" style={{ marginBottom: 8 }}>
                <span className="dashboard-table-muted">New customers period:</span>
                <div className="order-status-tabs" role="tablist" aria-label="New customers period">
                    {PERIOD_OPTIONS.map((option) => (
                        <button
                            key={option.days}
                            type="button"
                            role="tab"
                            aria-selected={periodDays === option.days}
                            className={`order-status-tab${periodDays === option.days ? " order-status-tab--active" : ""}`}
                            onClick={() => onPeriodChange(option.days)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <StatCards
                cards={[
                    { label: "Total Customers", value: stats.totalCustomers },
                    { label: "New Customers", value: stats.newCustomers },
                    { label: "Customers With Orders", value: stats.customersWithOrders },
                    { label: "Total Customer Orders", value: stats.totalCustomerOrders },
                    {
                        label: "Customer Revenue (recorded)",
                        value: topRevenue ? formatCurrency(topRevenue.totalSpent, topRevenue.currency) : formatCurrency(0, "USD"),
                    },
                ]}
            />
        </>
    );
};

export default CustomerKpis;
