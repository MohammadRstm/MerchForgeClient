import StatCards from "../../../../components/DashboardWidgets/StatCards";
import { formatCurrency } from "../utils/formatCurrency";
import type { CustomerBusinessOrderSummary } from "../types";

type CustomerOrderSummaryProps = {
    businesses: CustomerBusinessOrderSummary[];
};

/** Every figure here is derived from the per-business breakdown, order count summed (currency-independent), spend shown for the single largest currency bucket - never collapsed across currencies. */
const CustomerOrderSummary = ({ businesses }: CustomerOrderSummaryProps) => {
    if (businesses.length === 0) {
        return null;
    }

    const totalOrders = businesses.reduce((sum, b) => sum + b.orderCount, 0);

    const byCurrency = new Map<string, { total: number; orders: number }>();
    for (const b of businesses) {
        const entry = byCurrency.get(b.currency) ?? { total: 0, orders: 0 };
        entry.total += b.totalSpent;
        entry.orders += b.orderCount;
        byCurrency.set(b.currency, entry);
    }

    const [topCurrency, topCurrencyStats] =
        [...byCurrency.entries()].sort((a, b) => b[1].total - a[1].total)[0] ?? [];

    const avgOrderValue = topCurrencyStats && topCurrencyStats.orders > 0 ? topCurrencyStats.total / topCurrencyStats.orders : null;

    const firstOrderAt = businesses
        .map((b) => b.firstOrderAt)
        .filter((d): d is string => !!d)
        .sort()[0];

    const lastOrderDates = businesses.map((b) => b.lastOrderAt).filter((d): d is string => !!d).sort();
    const lastOrderAt = lastOrderDates[lastOrderDates.length - 1];

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Order Summary</h3>
            </div>
            <StatCards
                cards={[
                    { label: "Total Orders", value: totalOrders },
                    {
                        label: `Total Recorded Spending${topCurrency ? ` (${topCurrency})` : ""}`,
                        value: topCurrencyStats ? formatCurrency(topCurrencyStats.total, topCurrency) : "—",
                    },
                    {
                        label: "Average Order Value",
                        value: avgOrderValue !== null ? formatCurrency(avgOrderValue, topCurrency) : "—",
                    },
                    { label: "First Order", value: firstOrderAt ? new Date(firstOrderAt).toLocaleDateString() : "—" },
                    { label: "Most Recent Order", value: lastOrderAt ? new Date(lastOrderAt).toLocaleDateString() : "—" },
                ]}
            />
        </section>
    );
};

export default CustomerOrderSummary;
