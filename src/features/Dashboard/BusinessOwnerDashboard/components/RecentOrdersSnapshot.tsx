import { useNavigate } from "react-router";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { routes } from "../../../../config/routes";
import { currencyFormatter } from "../utils/chartMetrics";
import { shortOrderRef } from "../utils/orderRef";
import type { BusinessOrderResponse } from "../types";

const STATUS_BADGE_CLASS: Record<string, string> = {
    Pending: "business-dashboard-badge--status-trialing",
    Confirmed: "business-dashboard-badge--status-trialing",
    Shipped: "business-dashboard-badge--status-trialing",
    Delivered: "business-dashboard-badge--status-active",
    Cancelled: "business-dashboard-badge--status-cancelled",
};

type RecentOrdersSnapshotProps = {
    orders: BusinessOrderResponse[];
    isLoading: boolean;
    isError: boolean;
};

const RecentOrdersSnapshot = ({ orders, isLoading, isError }: RecentOrdersSnapshotProps) => {
    const navigate = useNavigate();

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Recent Orders</h3>
            </div>

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Unable to load recent orders right now.
                </p>
            ) : orders.length === 0 ? (
                <p className="business-dashboard-table-message">Your first order will appear here.</p>
            ) : (
                <>
                    <div className="business-dashboard-table-wrapper">
                        <table className="business-dashboard-table">
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{shortOrderRef(order.id)}</td>
                                        <td>{order.customerName}</td>
                                        <td>{currencyFormatter.format(order.total)}</td>
                                        <td>
                                            <span
                                                className={`business-dashboard-badge ${STATUS_BADGE_CLASS[order.status] ?? ""}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button
                        type="button"
                        className="business-dashboard-button-ghost overview-section-link"
                        onClick={() => navigate(routes.DASHBOARD_ORDERS)}
                    >
                        View All Orders →
                    </button>
                </>
            )}
        </section>
    );
};

export default RecentOrdersSnapshot;
