import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import { orderStatusBadgeClass, paymentStatusBadgeClass } from "../utils/orderStatusBadge";
import type { PagedResult } from "../../../../types/pagination";
import type useOrdersTableState from "../hooks/ui/useOrdersTableState";
import type { BusinessOrderResponse, OrderStatus } from "../types";

const currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

const STATUS_TABS: { value: OrderStatus | undefined; label: string }[] = [
    { value: undefined, label: "All" },
    { value: "Pending", label: "Pending" },
    { value: "Confirmed", label: "Confirmed" },
    { value: "Shipped", label: "Shipped" },
    { value: "Delivered", label: "Delivered" },
    { value: "Cancelled", label: "Cancelled" },
];

type OrdersTableProps = {
    ordersPage?: PagedResult<BusinessOrderResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useOrdersTableState>;
    onViewOrder: (orderId: string) => void;
};

const OrdersTable = ({ ordersPage, isLoading, isFetching, isError, tableState, onViewOrder }: OrdersTableProps) => {
    const { query, searchInput, handleSearchChange, handleStatusChange, setPage } = tableState;

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Orders</h3>

                <div className="business-dashboard-table-controls">
                    <input
                        type="text"
                        className="business-dashboard-search-input"
                        placeholder="Search by customer name or email..."
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
            </div>

            <div className="business-dashboard-table-controls" style={{ padding: "0 0 12px" }}>
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.label}
                        type="button"
                        className={
                            query.status === tab.value
                                ? "business-dashboard-button-primary"
                                : "business-dashboard-button-secondary"
                        }
                        onClick={() => handleStatusChange(tab.value)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Failed to load orders. Please try again.
                </p>
            ) : !ordersPage || ordersPage.items.length === 0 ? (
                <p className="business-dashboard-table-message">
                    {query.search || query.status ? "No orders match your search or filters." : "No orders yet."}
                </p>
            ) : (
                <div className="business-dashboard-table-wrapper" style={{ opacity: isFetching ? 0.6 : 1 }}>
                    <table className="business-dashboard-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Payment</th>
                                <th>Placed</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ordersPage.items.map((order) => (
                                <tr key={order.id} onClick={() => onViewOrder(order.id)} style={{ cursor: "pointer" }}>
                                    <td>
                                        <div>{order.customerName}</div>
                                        <div style={{ fontSize: 12, color: "#8a8a8a" }}>{order.customerEmail}</div>
                                    </td>
                                    <td>{order.itemCount}</td>
                                    <td>{currencyFormatter.format(order.total)}</td>
                                    <td>
                                        <span className={orderStatusBadgeClass(order.status)}>{order.status}</span>
                                    </td>
                                    <td>
                                        <span className={paymentStatusBadgeClass(order.paymentStatus)}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination page={ordersPage?.page ?? 1} totalPages={ordersPage?.totalPages ?? 0} onPageChange={setPage} />
        </section>
    );
};

export default OrdersTable;
