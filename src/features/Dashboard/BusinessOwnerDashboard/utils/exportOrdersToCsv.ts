import { shortOrderRef } from "./orderRef";
import type { BusinessOrderResponse } from "../types";

const escapeCsvCell = (value: string) => {
    if (/[",\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
};

const currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

/**
 * No payment info by design — this export mirrors the page's own "no payment
 * management yet" scope, not just what happens to be on BusinessOrderResponse.
 */
const ORDER_EXPORT_COLUMNS = ["Order ID", "Date", "Customer", "Phone", "Items", "Total", "Status"] as const;

export const buildOrdersCsv = (orders: BusinessOrderResponse[]): string => {
    const rows = orders.map((order) => [
        shortOrderRef(order.id),
        new Date(order.createdAt).toLocaleString(),
        order.customerName,
        order.customerPhone ?? "",
        String(order.itemCount),
        currencyFormatter.format(order.total),
        order.status,
    ]);

    return [ORDER_EXPORT_COLUMNS, ...rows].map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
};

export const downloadOrdersCsv = (orders: BusinessOrderResponse[], filename: string) => {
    const csv = buildOrdersCsv(orders);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};
