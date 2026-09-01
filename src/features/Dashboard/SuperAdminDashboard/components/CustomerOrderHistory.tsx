import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import type { PagedResult } from "../../../../types/pagination";
import { formatCurrency } from "../utils/formatCurrency";
import type useCustomerOrdersTableState from "../hooks/ui/useCustomerOrdersTableState";
import type { CustomerBusinessOrderSummary, CustomerOrderResponse } from "../types";

type CustomerOrderHistoryProps = {
    ordersPage?: PagedResult<CustomerOrderResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    tableState: ReturnType<typeof useCustomerOrdersTableState>;
    businesses: CustomerBusinessOrderSummary[];
};

/** A short, non-sequential reference derived from the order id - no human-readable order number exists in the schema. */
const shortOrderRef = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;

const CustomerOrderHistory = ({ ordersPage, isLoading, isFetching, isError, tableState, businesses }: CustomerOrderHistoryProps) => {
    const { businessId, handleBusinessChange, setPage } = tableState;

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Order History</h3>

                {businesses.length > 1 && (
                    <select
                        className="dashboard-filter-select"
                        value={businessId ?? ""}
                        onChange={(e) => handleBusinessChange(e.target.value)}
                    >
                        <option value="">All Businesses</option>
                        {businesses.map((b) => (
                            <option key={b.businessId} value={b.businessId}>
                                {b.businessName}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load order history.
                </p>
            ) : !ordersPage || ordersPage.items.length === 0 ? (
                <p className="dashboard-table-message">This customer hasn't placed any orders yet.</p>
            ) : (
                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Business</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody style={{ opacity: isFetching ? 0.6 : 1 }}>
                            {ordersPage.items.map((order) => (
                                <tr key={order.id}>
                                    <td>{shortOrderRef(order.id)}</td>
                                    <td>{order.businessName}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span
                                            className={`dashboard-badge ${
                                                order.status === "Cancelled" ? "dashboard-badge--danger" : "dashboard-badge--neutral"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{formatCurrency(order.total, order.currency)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Pagination
                page={ordersPage?.page ?? 1}
                totalPages={ordersPage?.totalPages ?? 0}
                onPageChange={setPage}
            />
        </section>
    );
};

export default CustomerOrderHistory;
