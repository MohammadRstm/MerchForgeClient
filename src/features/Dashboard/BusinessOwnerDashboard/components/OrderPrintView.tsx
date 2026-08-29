import { shortOrderRef } from "../utils/orderRef";
import type { BusinessOrderDetail } from "../types";

const currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

type OrderPrintViewProps = {
    businessName: string;
    order: BusinessOrderDetail;
};

/**
 * Rendered off-screen at all times (hidden by the global .print-only rule) and only
 * actually shown by the browser's print stylesheet — see BusinessOwnerDashboard.css.
 * No payment info, per the page's scope.
 */
const OrderPrintView = ({ businessName, order }: OrderPrintViewProps) => {
    return (
        <div className="print-only order-print-view">
            <h1>{businessName}</h1>
            <h2>Order {shortOrderRef(order.id)}</h2>
            <p>Placed {new Date(order.createdAt).toLocaleString()}</p>
            <p>Status: {order.status}</p>

            <h3>Customer</h3>
            <p>
                {order.customerName}
                <br />
                {order.customerEmail}
                {order.customerPhone && (
                    <>
                        <br />
                        {order.customerPhone}
                    </>
                )}
            </p>

            <h3>Shipping address</h3>
            <p>
                {order.shippingAddressLine1}
                {order.shippingAddressLine2 && (
                    <>
                        <br />
                        {order.shippingAddressLine2}
                    </>
                )}
                <br />
                {order.shippingCity}
                {order.shippingState ? `, ${order.shippingState}` : ""} {order.shippingPostalCode}
                <br />
                {order.shippingCountry}
            </p>

            <table className="order-print-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Unit price</th>
                        <th>Line total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        <tr key={item.productId}>
                            <td>{item.productTitle}</td>
                            <td>{item.quantity}</td>
                            <td>{currencyFormatter.format(item.unitPrice)}</td>
                            <td>{currencyFormatter.format(item.lineTotal)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="order-print-total">Total: {currencyFormatter.format(order.total)}</p>
        </div>
    );
};

export default OrderPrintView;
