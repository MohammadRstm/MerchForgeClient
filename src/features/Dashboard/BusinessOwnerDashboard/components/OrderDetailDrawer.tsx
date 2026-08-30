import { useState } from "react";
import Drawer from "../../../../components/Drawer/Drawer";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { resolveImageUrl } from "../utils/resolveImageUrl";
import { orderStatusBadgeClass, paymentStatusBadgeClass, ALLOWED_ORDER_STATUS_TRANSITIONS } from "../utils/orderStatusBadge";
import { shortOrderRef } from "../utils/orderRef";
import OrderPrintView from "./OrderPrintView";
import type { BusinessOrderDetail, OrderNote, OrderStatus, OrderStatusHistoryEntry, PaymentStatus } from "../types";

const currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

const PAYMENT_OPTIONS: PaymentStatus[] = ["Pending", "Paid", "Refunded"];

const TIMELINE_STEPS: OrderStatus[] = ["Pending", "Confirmed", "Shipped", "Delivered"];

const TIMELINE_LABEL: Record<OrderStatus, string> = {
    Pending: "Order Placed",
    Confirmed: "Confirmed",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
};

const STEP_INDEX: Record<OrderStatus, number> = { Pending: 0, Confirmed: 1, Shipped: 2, Delivered: 3, Cancelled: -1 };

type OrderDetailDrawerProps = {
    businessName: string;
    orderId?: string;
    order?: BusinessOrderDetail;
    isLoading: boolean;
    isError: boolean;

    statusHistory?: OrderStatusHistoryEntry[];
    statusHistoryLoading: boolean;

    notes?: OrderNote[];
    notesLoading: boolean;
    onAddNote: (content: string) => void;
    isAddingNote: boolean;

    isUpdatingStatus: boolean;
    isUpdatingPaymentStatus: boolean;
    statusError?: string;
    onUpdateStatus: (status: OrderStatus) => void;
    onUpdatePaymentStatus: (paymentStatus: PaymentStatus) => void;
    onRequestCancel: (orderId: string) => void;
    onClose: () => void;
};

const OrderDetailDrawer = ({
    businessName,
    orderId,
    order,
    isLoading,
    isError,
    statusHistory,
    statusHistoryLoading,
    notes,
    notesLoading,
    onAddNote,
    isAddingNote,
    isUpdatingStatus,
    isUpdatingPaymentStatus,
    statusError,
    onUpdateStatus,
    onUpdatePaymentStatus,
    onRequestCancel,
    onClose,
}: OrderDetailDrawerProps) => {
    const [noteDraft, setNoteDraft] = useState("");

    const isOpen = Boolean(orderId);
    const allowedNextStatuses = order ? ALLOWED_ORDER_STATUS_TRANSITIONS[order.status] : [];
    const nonCancelNextStatuses = allowedNextStatuses.filter((s) => s !== "Cancelled");
    const canCancel = allowedNextStatuses.includes("Cancelled");

    const historyByStatus = new Map((statusHistory ?? []).map((entry) => [entry.status, entry]));

    const submitNote = () => {
        if (!noteDraft.trim()) return;
        onAddNote(noteDraft);
        setNoteDraft("");
    };

    return (
        <Drawer isOpen={isOpen} onClose={onClose}>
            <Drawer.Header>
                {order && <h2>Order {shortOrderRef(order.id)}</h2>}
            </Drawer.Header>

            <Drawer.Body>
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

                        {/* Status timeline / order activity */}
                        <div className="order-timeline">
                            {order.status === "Cancelled" ? (
                                <>
                                    <div className="order-timeline-step order-timeline-step--done">
                                        <span className="order-timeline-dot" />
                                        <div>
                                            <div className="order-timeline-label">Order Placed</div>
                                            <div className="order-timeline-time">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="order-timeline-step order-timeline-step--cancelled">
                                        <span className="order-timeline-dot" />
                                        <div>
                                            <div className="order-timeline-label">Cancelled</div>
                                            <div className="order-timeline-time">
                                                {new Date(order.updatedAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                TIMELINE_STEPS.map((step) => {
                                    const isDone = STEP_INDEX[step] <= STEP_INDEX[order.status];
                                    const entry = historyByStatus.get(step);
                                    return (
                                        <div
                                            key={step}
                                            className={`order-timeline-step${isDone ? " order-timeline-step--done" : ""}`}
                                        >
                                            <span className="order-timeline-dot" />
                                            <div>
                                                <div className="order-timeline-label">{TIMELINE_LABEL[step]}</div>
                                                {isDone && (
                                                    <div className="order-timeline-time">
                                                        {entry
                                                            ? new Date(entry.createdAt).toLocaleString()
                                                            : step === order.status
                                                              ? new Date(order.updatedAt).toLocaleString()
                                                              : ""}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            {statusHistoryLoading && <span className="order-timeline-loading">Loading history…</span>}
                        </div>

                        {/* Customer */}
                        <div className="business-dashboard-form-row" style={{ marginBottom: 16 }}>
                            <div>
                                <p className="business-dashboard-form-label" style={{ marginBottom: 4 }}>
                                    Customer
                                </p>
                                <p style={{ margin: 0 }}>{order.customerName}</p>
                                <p style={{ margin: 0, color: "#555" }}>{order.customerEmail}</p>
                                {order.customerPhone && <p style={{ margin: 0, color: "#555" }}>{order.customerPhone}</p>}

                                {order.customerOrderCount != null && (
                                    <p className="order-customer-history">
                                        Customer History — {order.customerOrderCount - 1} previous order
                                        {order.customerOrderCount - 1 === 1 ? "" : "s"}, {order.customerOrderCount} total
                                        {order.customerLastOrderAt && (
                                            <> · Last order {new Date(order.customerLastOrderAt).toLocaleDateString()}</>
                                        )}
                                    </p>
                                )}

                                <div className="order-communication-actions">
                                    {order.customerPhone && (
                                        <a
                                            className="business-dashboard-button-ghost"
                                            href={`https://wa.me/${order.customerPhone.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            WhatsApp
                                        </a>
                                    )}
                                    {order.customerPhone && (
                                        <a className="business-dashboard-button-ghost" href={`tel:${order.customerPhone}`}>
                                            Call
                                        </a>
                                    )}
                                    <a className="business-dashboard-button-ghost" href={`mailto:${order.customerEmail}`}>
                                        Email
                                    </a>
                                </div>
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

                        {/* Items */}
                        <div className="business-dashboard-table-wrapper" style={{ marginBottom: 8 }}>
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
                            Subtotal: {currencyFormatter.format(order.subtotal)}
                            <br />
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

                        {(nonCancelNextStatuses.length > 0 || canCancel) && (
                            <div className="business-dashboard-form-field" style={{ marginBottom: 24 }}>
                                <label className="business-dashboard-form-label">Actions</label>
                                <div className="business-dashboard-header-actions">
                                    {nonCancelNextStatuses.map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            className="business-dashboard-button-primary"
                                            disabled={isUpdatingStatus}
                                            onClick={() => onUpdateStatus(status)}
                                        >
                                            {isUpdatingStatus ? "Updating…" : `Mark as ${status}`}
                                        </button>
                                    ))}
                                    {canCancel && (
                                        <button
                                            type="button"
                                            className="business-dashboard-button-danger"
                                            disabled={isUpdatingStatus}
                                            onClick={() => onRequestCancel(order.id)}
                                        >
                                            Cancel order
                                        </button>
                                    )}
                                    <button type="button" className="business-dashboard-button-secondary" onClick={() => window.print()}>
                                        Print invoice
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Internal notes */}
                        <div className="order-notes-section">
                            <p className="business-dashboard-form-label">
                                Internal notes <span className="business-dashboard-form-optional">(never shown to the customer)</span>
                            </p>

                            <div className="order-notes-composer">
                                <textarea
                                    className="business-dashboard-form-textarea"
                                    placeholder="e.g. Customer asked to call before delivery"
                                    value={noteDraft}
                                    onChange={(e) => setNoteDraft(e.target.value)}
                                    rows={2}
                                />
                                <button
                                    type="button"
                                    className="business-dashboard-button-secondary"
                                    disabled={isAddingNote || !noteDraft.trim()}
                                    onClick={submitNote}
                                >
                                    {isAddingNote ? "Adding…" : "Add note"}
                                </button>
                            </div>

                            {notesLoading ? (
                                <div className="business-dashboard-table-loading">
                                    <Spinner size={20} />
                                </div>
                            ) : notes && notes.length > 0 ? (
                                <ul className="order-notes-list">
                                    {notes.map((note) => (
                                        <li key={note.id} className="order-note">
                                            <p className="order-note-content">{note.content}</p>
                                            <p className="order-note-meta">
                                                {note.createdByUserName} · {new Date(note.createdAt).toLocaleString()}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="business-dashboard-form-hint">No internal notes yet.</p>
                            )}
                        </div>

                        <OrderPrintView businessName={businessName} order={order} />
                    </>
                )}
            </Drawer.Body>

            <Drawer.Footer>
                <button type="button" className="business-dashboard-button-secondary" onClick={onClose}>
                    Close
                </button>
            </Drawer.Footer>
        </Drawer>
    );
};

export default OrderDetailDrawer;
