import { useNavigate } from "react-router";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { routes } from "../../../../config/routes";
import { currencyFormatter } from "../utils/chartMetrics";
import { shortOrderRef } from "../utils/orderRef";
import type { BusinessOrderResponse } from "../types";

type OrdersRequiringAttentionProps = {
    orders: BusinessOrderResponse[];
    totalPending: number;
    isLoading: boolean;
    isError: boolean;
};

/** Pending orders only — the one status that genuinely needs the owner to act. Confirmed/Shipped/Delivered/Cancelled are all "already handled" states, so surfacing them here would just be noise. */
const OrdersRequiringAttention = ({ orders, totalPending, isLoading, isError }: OrdersRequiringAttentionProps) => {
    const navigate = useNavigate();

    return (
        <section className="business-dashboard-table-card needs-attention">
            <div className="business-dashboard-table-header">
                <h3>Orders Requiring Attention</h3>
            </div>

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Unable to load orders right now.
                </p>
            ) : orders.length === 0 ? (
                <p className="business-dashboard-table-message">You're all caught up — no orders are waiting on you.</p>
            ) : (
                <>
                    <ul className="overview-order-list">
                        {orders.map((order) => (
                            <li key={order.id} className="overview-order-row">
                                <div className="overview-order-row__main">
                                    <span className="overview-order-row__ref">#{shortOrderRef(order.id)}</span>
                                    <span className="overview-order-row__customer">{order.customerName}</span>
                                </div>
                                <div className="overview-order-row__meta">
                                    <span className="overview-order-row__amount">{currencyFormatter.format(order.total)}</span>
                                    <span className="business-dashboard-badge business-dashboard-badge--status-trialing">
                                        {order.status}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button
                        type="button"
                        className="business-dashboard-button-ghost overview-section-link"
                        onClick={() => navigate(routes.DASHBOARD_ORDERS)}
                    >
                        View {totalPending > orders.length ? `all ${totalPending} pending orders` : "Orders"} →
                    </button>
                </>
            )}
        </section>
    );
};

export default OrdersRequiringAttention;
