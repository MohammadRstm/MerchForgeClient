import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { orderStatusBadgeClass } from "../../BusinessOwnerDashboard/utils/orderStatusBadge";
import { formatCurrency } from "../utils/formatCurrency";
import type { BusinessOrderResponse } from "../../BusinessOwnerDashboard/types";

type BusinessRecentOrdersProps = {
    orders: BusinessOrderResponse[];
    isLoading: boolean;
    isError: boolean;
};

const BusinessRecentOrders = ({ orders, isLoading, isError }: BusinessRecentOrdersProps) => {
    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Recent Orders</h3>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={24} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load recent orders.
                </p>
            ) : orders.length === 0 ? (
                <p className="dashboard-table-message">No orders yet.</p>
            ) : (
                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id.slice(0, 8)}</td>
                                    <td>{order.customerName}</td>
                                    <td>{formatCurrency(order.total, order.currency)}</td>
                                    <td>
                                        <span className={orderStatusBadgeClass(order.status)}>{order.status}</span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
};

export default BusinessRecentOrders;
