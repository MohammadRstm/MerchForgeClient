import "./SuperAdminDashboard.css";
import "../BusinessOwnerDashboard/BusinessOwnerDashboard.css";
import { useNavigate } from "react-router";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import { routes } from "../../../config/routes";
import { formatCurrency } from "./utils/formatCurrency";
import useAdminCustomerDetailPage from "./hooks/useAdminCustomerDetailPage";
import CustomerOrderSummary from "./components/CustomerOrderSummary";
import CustomerSpendChart from "./components/CustomerSpendChart";
import CustomerOrderHistory from "./components/CustomerOrderHistory";
import EditCustomerModal from "./components/EditCustomerModal";
import RevokeCustomerSessionsModal from "./components/RevokeCustomerSessionsModal";

const timeAgo = (isoDate: string): string => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.round(diffMs / 60_000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

    const days = Math.round(hours / 24);
    if (days === 1) return "yesterday";
    if (days < 30) return `${days} days ago`;

    return new Date(isoDate).toLocaleDateString();
};

const AdminCustomerDetailPage = () => {
    const {
        customerId,
        customer,
        isLoading,
        isError,
        ordersTable,
        ordersPage,
        ordersLoading,
        ordersFetching,
        ordersError,
        spendOverTime,
        spendOverTimeLoading,
        spendOverTimeError,
        editModal,
        revokeSessionsModal,
    } = useAdminCustomerDetailPage();

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
                    <button type="button" className="dashboard-action-btn" onClick={editModal.open}>
                        Edit Customer
                    </button>
                    {customer.hasActiveSession && (
                        <button type="button" className="dashboard-action-btn" onClick={revokeSessionsModal.open}>
                            Revoke Sessions
                        </button>
                    )}
                    <button type="button" className="dashboard-action-btn" onClick={() => navigate(routes.ADMIN_CUSTOMERS)}>
                        Back to customers
                    </button>
                </div>
            </div>

            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Profile</h3>
                    <span className={`dashboard-badge ${customer.hasActiveSession ? "dashboard-badge--success" : "dashboard-badge--neutral"}`}>
                        {customer.hasActiveSession ? "Active session" : "No active session"}
                    </span>
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
                    <div>
                        <dt>Last updated</dt>
                        <dd>{new Date(customer.updatedAt).toLocaleDateString()}</dd>
                    </div>
                </dl>
            </section>

            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Business Activity</h3>
                </div>
                {customer.businesses.length === 0 ? (
                    <p className="dashboard-table-message">No business activity recorded.</p>
                ) : (
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Business</th>
                                    <th>Orders</th>
                                    <th>Total Spent</th>
                                    <th>Last Order</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customer.businesses.map((business) => (
                                    <tr key={business.businessId}>
                                        <td>{business.businessName}</td>
                                        <td>{business.orderCount}</td>
                                        <td>{formatCurrency(business.totalSpent, business.currency)}</td>
                                        <td>{business.lastOrderAt ? new Date(business.lastOrderAt).toLocaleDateString() : "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <CustomerOrderSummary businesses={customer.businesses} />

            <CustomerSpendChart points={spendOverTime} isLoading={spendOverTimeLoading} isError={spendOverTimeError} />

            <CustomerOrderHistory
                ordersPage={ordersPage}
                isLoading={ordersLoading}
                isFetching={ordersFetching}
                isError={ordersError}
                tableState={ordersTable}
                businesses={customer.businesses}
            />

            <section className="dashboard-table-card">
                <div className="dashboard-table-header">
                    <h3>Recent Activity</h3>
                </div>
                {customer.recentActivity.length === 0 ? (
                    <p className="dashboard-table-message">No security activity recorded yet.</p>
                ) : (
                    <ul className="recent-activity-list">
                        {customer.recentActivity.map((entry) => (
                            <li key={entry.id}>
                                <div>
                                    <span>{entry.description}</span>
                                    {!entry.success && (
                                        <span className="dashboard-badge dashboard-badge--danger" style={{ marginLeft: 8 }}>
                                            Failed
                                        </span>
                                    )}
                                </div>
                                <span className="dashboard-table-muted">{timeAgo(entry.createdAt)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <p className="dashboard-table-message" style={{ textAlign: "left", padding: 0 }}>
                Customer id: {customerId}
            </p>

            <EditCustomerModal modal={editModal} />
            <RevokeCustomerSessionsModal modal={revokeSessionsModal} />
        </main>
    );
};

export default AdminCustomerDetailPage;
