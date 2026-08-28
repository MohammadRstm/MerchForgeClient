import "./SuperAdminDashboard.css";
import { useNavigate } from "react-router";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { routes } from "../../../config/routes";
import useAdminCustomerDetailPage from "./hooks/useAdminCustomerDetailPage";

const currencyFormatterByCurrency = new Map<string, Intl.NumberFormat>();

const formatMoney = (amount: number, currency: string) => {
    let formatter = currencyFormatterByCurrency.get(currency);

    if (!formatter) {
        formatter = new Intl.NumberFormat(undefined, { style: "currency", currency });
        currencyFormatterByCurrency.set(currency, formatter);
    }

    return formatter.format(amount);
};

const AdminCustomerDetailPage = () => {
    const { customerId, customer, isLoading, isError } = useAdminCustomerDetailPage();

    const navigate = useNavigate();

    if (isLoading) {
        return (
            <main className="dashboard-page">
                <div className="dashboard-stats-loading">
                    <Spinner size={32} />
                </div>
            </main>
        );
    }

    if (isError || !customer) {
        return (
            <main className="dashboard-page">
                <p className="dashboard-table-message dashboard-table-message--error">
                    Failed to load this customer. Please try again.
                </p>
            </main>
        );
    }

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <h1 className="dashboard-heading">{customer.firstName} {customer.lastName}</h1>

                <div className="business-detail-header-actions">
                    <button type="button" className="dashboard-action-btn" onClick={() => navigate(routes.ADMIN_CUSTOMERS)}>
                        Back to customers
                    </button>
                </div>
            </div>

            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Profile</h3>
                </div>
                <dl className="business-detail-grid">
                    <div>
                        <dt>Email</dt>
                        <dd>{customer.email}</dd>
                    </div>
                    <div>
                        <dt>Phone</dt>
                        <dd>{customer.phone ?? "—"}</dd>
                    </div>
                    <div>
                        <dt>Address</dt>
                        <dd>
                            {customer.addressLine1 ? (
                                <>
                                    {customer.addressLine1}
                                    {customer.addressLine2 ? `, ${customer.addressLine2}` : ""}
                                    {customer.city ? `, ${customer.city}` : ""}
                                    {customer.state ? `, ${customer.state}` : ""}
                                    {customer.postalCode ? ` ${customer.postalCode}` : ""}
                                    {customer.country ? `, ${customer.country}` : ""}
                                </>
                            ) : (
                                "Not saved"
                            )}
                        </dd>
                    </div>
                    <div>
                        <dt>Customer since</dt>
                        <dd>{new Date(customer.createdAt).toLocaleDateString()}</dd>
                    </div>
                </dl>
            </section>

            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Businesses ordered from</h3>
                </div>
                {customer.businesses.length === 0 ? (
                    <p className="dashboard-table-message">
                        {customer.firstName} hasn't placed an order with any business yet.
                    </p>
                ) : (
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Business</th>
                                    <th>Orders</th>
                                    <th>Total spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customer.businesses.map((business) => (
                                    <tr key={business.businessId}>
                                        <td>{business.businessName}</td>
                                        <td>{business.orderCount}</td>
                                        <td>{formatMoney(business.totalSpent, business.currency)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <p className="dashboard-table-message" style={{ textAlign: "left", padding: 0 }}>
                Customer id: {customerId}
            </p>
        </main>
    );
};

export default AdminCustomerDetailPage;
