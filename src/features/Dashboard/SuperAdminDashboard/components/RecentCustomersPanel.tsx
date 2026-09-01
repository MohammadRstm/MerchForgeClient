import { Link } from "react-router";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { buildAdminCustomerDetailRoute } from "../../../../config/routes";
import type { DashboardCustomerResponse } from "../types";

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

type RecentCustomersPanelProps = {
    customers?: DashboardCustomerResponse[];
    isLoading: boolean;
    isError: boolean;
};

const RecentCustomersPanel = ({ customers, isLoading, isError }: RecentCustomersPanelProps) => {
    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Recently Joined</h3>
            </div>

            {isLoading ? (
                <div className="dashboard-table-loading">
                    <Spinner size={24} />
                </div>
            ) : isError ? (
                <p className="dashboard-table-message dashboard-table-message--error">
                    Unable to load recent customers.
                </p>
            ) : !customers || customers.length === 0 ? (
                <p className="dashboard-table-message">No storefront customers yet.</p>
            ) : (
                <ul className="recent-activity-list">
                    {customers.map((customer) => (
                        <li key={customer.id}>
                            <div>
                                <Link to={buildAdminCustomerDetailRoute(customer.id)} className="dashboard-inline-link">
                                    {customer.firstName} {customer.lastName}
                                </Link>
                                <span className="dashboard-table-muted"> registered</span>
                            </div>
                            <span className="dashboard-table-muted">{timeAgo(customer.createdAt)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default RecentCustomersPanel;
