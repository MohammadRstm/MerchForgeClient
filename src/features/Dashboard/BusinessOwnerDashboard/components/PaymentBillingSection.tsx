/**
 * Reserved space for payment-gateway-backed features — no payment provider is
 * connected yet, so every block here is an honest "not yet" state, never a fake
 * card number, invoice, or transaction. Three distinct sub-sections (not one merged
 * blurb) so a future payment integration can populate each independently — a real
 * payment method, a real billing-history table, a real invoice list — without
 * restructuring this component.
 */
const PaymentBillingSection = () => {
    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Payment &amp; Billing</h3>
            </div>

            <div className="payment-billing-reserved">
                <div className="payment-billing-reserved__block">
                    <h4>Payment Method</h4>
                    <p className="business-dashboard-table-message">
                        Payment methods will be available once billing is connected.
                    </p>
                </div>

                <div className="payment-billing-reserved__block">
                    <h4>Billing History</h4>
                    <p className="business-dashboard-table-message">
                        Billing history will appear here once payment processing is connected.
                    </p>
                </div>

                <div className="payment-billing-reserved__block">
                    <h4>Invoices</h4>
                    <p className="business-dashboard-table-message">
                        Invoices will appear here once payment processing is connected.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PaymentBillingSection;
