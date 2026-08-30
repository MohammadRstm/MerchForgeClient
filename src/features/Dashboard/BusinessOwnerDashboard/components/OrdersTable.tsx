import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import Pagination from "../../../../components/Pagination/Pagination";
import OrderRowActionsMenu from "./OrderRowActionsMenu";
import { orderStatusBadgeClass } from "../utils/orderStatusBadge";
import { shortOrderRef } from "../utils/orderRef";
import type { PagedResult } from "../../../../types/pagination";
import type useOrdersTableState from "../hooks/ui/useOrdersTableState";
import type useOrderSelection from "../hooks/ui/useOrderSelection";
import type { BusinessOrderResponse, OrderStatus } from "../types";

const currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

type OrdersTableProps = {
    ordersPage?: PagedResult<BusinessOrderResponse>;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    hasActiveFilters: boolean;
    tableState: ReturnType<typeof useOrdersTableState>;
    selection: ReturnType<typeof useOrderSelection>;
    onViewOrder: (orderId: string) => void;
    onChangeStatus: (orderId: string, status: OrderStatus) => void;
    onRequestCancel: (orderId: string) => void;
};

const OrdersTable = ({
    ordersPage,
    isLoading,
    isFetching,
    isError,
    hasActiveFilters,
    tableState,
    selection,
    onViewOrder,
    onChangeStatus,
    onRequestCancel,
}: OrdersTableProps) => {
    const { setPage } = tableState;
    const items = ordersPage?.items ?? [];

    return (
        <section className="business-dashboard-table-card">
            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Failed to load orders. Please try again.
                </p>
            ) : items.length === 0 ? (
                <p className="business-dashboard-table-message">
                    {hasActiveFilters ? "No orders found. Try changing your search or filters." : "No orders yet. Orders placed through your store will appear here."}
                </p>
            ) : (
                <>
                    <div className="business-dashboard-table-wrapper orders-table-wrapper" style={{ opacity: isFetching ? 0.6 : 1 }}>
                        <table className="business-dashboard-table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            aria-label="Select all orders on this page"
                                            checked={selection.isAllSelected}
                                            onChange={selection.toggleAll}
                                        />
                                    </th>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {items.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="business-dashboard-table-row--clickable"
                                        onClick={() => onViewOrder(order.id)}
                                    >
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                aria-label={`Select order ${shortOrderRef(order.id)}`}
                                                checked={selection.selectedIds.has(order.id)}
                                                onChange={() => selection.toggle(order.id)}
                                            />
                                        </td>
                                        <td>{shortOrderRef(order.id)}</td>
                                        <td>
                                            <div>{order.customerName}</div>
                                            <div style={{ fontSize: 12, color: "#8a8a8a" }}>
                                                {order.customerPhone ?? order.customerEmail}
                                            </div>
                                        </td>
                                        <td>{order.itemCount} item{order.itemCount === 1 ? "" : "s"}</td>
                                        <td>{currencyFormatter.format(order.total)}</td>
                                        <td>
                                            <span className={orderStatusBadgeClass(order.status)}>{order.status}</span>
                                        </td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <OrderRowActionsMenu
                                                order={order}
                                                onView={() => onViewOrder(order.id)}
                                                onChangeStatus={(status) => onChangeStatus(order.id, status)}
                                                onCancel={() => onRequestCancel(order.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <ul className="orders-card-list">
                        {items.map((order) => (
                            <li
                                key={order.id}
                                className="order-card"
                                onClick={() => onViewOrder(order.id)}
                            >
                                <div className="order-card-top">
                                    <input
                                        type="checkbox"
                                        aria-label={`Select order ${shortOrderRef(order.id)}`}
                                        checked={selection.selectedIds.has(order.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={() => selection.toggle(order.id)}
                                    />
                                    <span className="order-card-ref">{shortOrderRef(order.id)}</span>
                                    <span className={orderStatusBadgeClass(order.status)}>{order.status}</span>
                                </div>

                                <div className="order-card-customer">{order.customerName}</div>
                                {order.customerPhone && <div className="order-card-meta">{order.customerPhone}</div>}

                                <div className="order-card-bottom">
                                    <span>{order.itemCount} item{order.itemCount === 1 ? "" : "s"}</span>
                                    <span>{currencyFormatter.format(order.total)}</span>
                                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="order-card-actions" onClick={(e) => e.stopPropagation()}>
                                    <OrderRowActionsMenu
                                        order={order}
                                        onView={() => onViewOrder(order.id)}
                                        onChangeStatus={(status) => onChangeStatus(order.id, status)}
                                        onCancel={() => onRequestCancel(order.id)}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <div className="orders-table-footer">
                {ordersPage && ordersPage.totalCount > 0 && (
                    <span className="orders-table-total">{ordersPage.totalCount} result{ordersPage.totalCount === 1 ? "" : "s"}</span>
                )}
                <Pagination page={ordersPage?.page ?? 1} totalPages={ordersPage?.totalPages ?? 0} onPageChange={setPage} />
            </div>
        </section>
    );
};

export default OrdersTable;
