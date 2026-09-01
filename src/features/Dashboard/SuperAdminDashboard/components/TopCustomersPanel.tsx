import { Link } from "react-router";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { buildAdminCustomerDetailRoute } from "../../../../config/routes";
import { formatCurrency } from "../utils/formatCurrency";
import type useTopCustomersPanel from "../hooks/ui/useTopCustomersPanel";

type TopCustomersPanelProps = {
    panel: ReturnType<typeof useTopCustomersPanel>;
};

/** Ranked within USD only - see TopCustomerResponse's own doc comment for why cross-currency ranking isn't meaningful. */
const TopCustomersPanel = ({ panel }: TopCustomersPanelProps) => {
    const { rankBy, setRankBy, data, isLoading, isError } = panel;

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Top Customers</h3>
                <div className="order-status-tabs" role="tablist" aria-label="Rank top customers by">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={rankBy === "Spend"}
                        className={`order-status-tab${rankBy === "Spend" ? " order-status-tab--active" : ""}`}
                        onClick={() => setRankBy("Spend")}
                    >
                        Highest Spending
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={rankBy === "Orders"}
                        className={`order-status-tab${rankBy === "Orders" ? " order-status-tab--active" : ""}`}
                        onClick={() => setRankBy("Orders")}
                    >
                        Most Orders
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load top customers.
                </p>
            ) : !data || data.length === 0 ? (
                <p className="dashboard-table-message">No customers with orders yet.</p>
            ) : (
                <ol className="top-customers-list">
                    {data.map((customer, index) => (
                        <li key={customer.customerId}>
                            <span className="top-customers-rank">{index + 1}</span>
                            <div className="top-customers-info">
                                <Link to={buildAdminCustomerDetailRoute(customer.customerId)} className="dashboard-inline-link">
                                    {customer.firstName} {customer.lastName}
                                </Link>
                                <span className="dashboard-table-muted">{customer.email}</span>
                            </div>
                            <div className="top-customers-metric">
                                <span>{formatCurrency(customer.totalSpent, customer.currency)}</span>
                                <span className="dashboard-table-muted">{customer.orderCount} order{customer.orderCount === 1 ? "" : "s"}</span>
                            </div>
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
};

export default TopCustomersPanel;
