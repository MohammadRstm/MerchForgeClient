import type { OrderStatus, PaymentStatus } from "../types";

/** Reuses the existing subscription-status badge palette rather than inventing new colors for every status. */
const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
    Pending: "trialing",
    Confirmed: "active",
    Shipped: "trialing",
    Delivered: "active",
    Cancelled: "cancelled",
};

const PAYMENT_STATUS_BADGE: Record<PaymentStatus, string> = {
    Pending: "pastdue",
    Paid: "active",
    Refunded: "cancelled",
};

export const orderStatusBadgeClass = (status: OrderStatus) =>
    `business-dashboard-badge business-dashboard-badge--status-${ORDER_STATUS_BADGE[status]}`;

export const paymentStatusBadgeClass = (status: PaymentStatus) =>
    `business-dashboard-badge business-dashboard-badge--status-${PAYMENT_STATUS_BADGE[status]}`;

/** Pending -> Confirmed | Cancelled; Confirmed -> Shipped | Cancelled; Shipped -> Delivered. Mirrors the server's own transition table. */
export const ALLOWED_ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    Pending: ["Confirmed", "Cancelled"],
    Confirmed: ["Shipped", "Cancelled"],
    Shipped: ["Delivered"],
    Delivered: [],
    Cancelled: [],
};
