import { shortOrderRef } from "../utils/orderRef";
import type { BusinessOrderResponse } from "../types";

const currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

type OrdersPrintSummaryProps = {
    businessName: string;
    orders: BusinessOrderResponse[];
};

/**
 * A list-level summary for printing several orders at once — order rows don't carry
 * line items (only itemCount), so this is a packing/picking summary, not per-order
 * invoices. Print a single order from its own detail drawer for a full invoice.
 */
const OrdersPrintSummary = ({ businessName, orders }: OrdersPrintSummaryProps) => {
    if (orders.length === 0) return null;

    return (
        <div className="print-only order-print-view">
            <h1>{businessName}</h1>
            <h2>Orders summary ({orders.length})</h2>
            <p>Printed {new Date().toLocaleString()}</p>

            <table className="order-print-table">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{shortOrderRef(order.id)}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>{order.customerName}</td>
                            <td>{order.itemCount}</td>
                            <td>{currencyFormatter.format(order.total)}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersPrintSummary;
