import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { resolveImageUrl } from "../utils/resolveImageUrl";
import { ALLOWED_ORDER_STATUS_TRANSITIONS, orderStatusBadgeClass, paymentStatusBadgeClass } from "../utils/orderStatusBadge";
import type { BusinessOrderDetail, OrderStatus, PaymentStatus } from "../types";

const currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

const PAYMENT_OPTIONS: PaymentStatus[] = ["Pending", "Paid", "Refunded"];

type OrderDetailModalProps = {
    orderId?: string;
    order?: BusinessOrderDetail;
    isLoading: boolean;
    isError: boolean;
    isUpdatingStatus: boolean;
    isUpdatingPaymentStatus: boolean;
    statusError?: string;
    onUpdateStatus: (status: OrderStatus) => void;
    onUpdatePaymentStatus: (paymentStatus: PaymentStatus) => void;
    onClose: () => void;
};

const OrderDetailModal = ({
    orderId,
    order,
    isLoading,
    isError,
    isUpdatingStatus,
    isUpdatingPaymentStatus,
    statusError,
    onUpdateStatus,
    onUpdatePaymentStatus,
    onClose,
}: OrderDetailModalProps) => {
    const isOpen = Boolean(orderId);
    const allowedNextStatuses = order ? ALLOWED_ORDER_STATUS_TRANSITIONS[order.status] : [];

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Header>
                <h2>Order details</h2>
            </Modal.Header>

            <Modal.Body>
                {isLoading ? (
                    <div className="business-dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : isError || !order ? (
                    <p className="business-dashboard-table-message business-dashboard-table-message--error">
                        Failed to load this order. Please try again.
                    </p>
                ) : (
                    <>
                        <div className="business-dashboard-header-actions" style={{ marginBottom: 16 }}>
                            <span className={orderStatusBadgeClass(order.status)}>{order.status}</span>
                            <span className={paymentStatusBadgeClass(order.paymentStatus)}>{order.paymentStatus}</span>
                            <span style={{ fontSize: 12, color: "#8a8a8a" }}>
                                Placed {new Date(order.createdAt).toLocaleString()}
                            </span>
                        </div>

                        <div className="business-dashboard-form-row" style={{ marginBottom: 16 }}>
                            <div>
                                <p className="business-dashboard-form-label" style={{ marginBottom: 4 }}>
                                    Customer
                                </p>
                                <p style={{ margin: 0 }}>{order.customerName}</p>
                                <p style={{ margin: 0, color: "#555" }}>{order.customerEmail}</p>
                                {order.customerPhone && <p style={{ margin: 0, color: "#555" }}>{order.customerPhone}</p>}
                            </div>

                            <div>
                                <p className="business-dashboard-form-label" style={{ marginBottom: 4 }}>
                                    Shipping address
                                </p>
                                <p style={{ margin: 0 }}>{order.shippingAddressLine1}</p>
                                {order.shippingAddressLine2 && <p style={{ margin: 0 }}>{order.shippingAddressLine2}</p>}
                                <p style={{ margin: 0 }}>
                                    {order.shippingCity}
                                    {order.shippingState ? `, ${order.shippingState}` : ""} {order.shippingPostalCode}
                                </p>
                                <p style={{ margin: 0 }}>{order.shippingCountry}</p>
                            </div>
                        </div>

                        {order.customerNotes && (
                            <p style={{ marginBottom: 16 }}>
                                <span className="business-dashboard-form-label">Note from customer: </span>
                                {order.customerNotes}
                            </p>
                        )}

                        <div className="business-dashboard-table-wrapper" style={{ marginBottom: 16 }}>
                            <table className="business-dashboard-table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Item</th>
                                        <th>Qty</th>
                                        <th>Unit price</th>
                                        <th>Line total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item) => (
                                        <tr key={item.productId}>
                                            <td>
                                                {item.productImageUrl ? (
                                                    <img
                                                        src={resolveImageUrl(item.productImageUrl)}
                                                        alt=""
                                                        className="business-dashboard-product-thumb"
                                                    />
                                                ) : (
                                                    <span
                                                        className="business-dashboard-product-thumb-placeholder"
                                                        aria-hidden="true"
                                                    >
                                                        {item.productTitle.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </td>
                                            <td>{item.productTitle}</td>
                                            <td>{item.quantity}</td>
                                            <td>{currencyFormatter.format(item.unitPrice)}</td>
                                            <td>{currencyFormatter.format(item.lineTotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <p style={{ textAlign: "right", fontWeight: 600, marginBottom: 20 }}>
                            Total: {currencyFormatter.format(order.total)}
                        </p>

                        {statusError && (
                            <p className="business-dashboard-form-error" role="alert">
                                {statusError}
                            </p>
                        )}

                        <div className="business-dashboard-form-field" style={{ marginBottom: 12 }}>
                            <label className="business-dashboard-form-label">Payment status</label>
                            <select
                                className="business-dashboard-form-input"
                                value={order.paymentStatus}
                                disabled={isUpdatingPaymentStatus}
                                onChange={(e) => onUpdatePaymentStatus(e.target.value as PaymentStatus)}
                            >
                                {PAYMENT_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {allowedNextStatuses.length > 0 && (
                            <div className="business-dashboard-form-field">
                                <label className="business-dashboard-form-label">Move order to</label>
                                <div className="business-dashboard-header-actions">
                                    {allowedNextStatuses.map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            className={
                                                status === "Cancelled"
                                                    ? "business-dashboard-button-danger"
                                                    : "business-dashboard-button-primary"
                                            }
                                            disabled={isUpdatingStatus}
                                            onClick={() => onUpdateStatus(status)}
                                        >
                                            {isUpdatingStatus ? "Updating…" : status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="business-dashboard-button-secondary" onClick={onClose}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderDetailModal;
