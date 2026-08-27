import "./SuperAdminDashboard.css";
import { useNavigate, useParams } from "react-router";
import { routes } from "../../../config/routes";

// Placeholder until the business-detail aggregation endpoint exists (plan §5.1).
// Row-click navigation from the Businesses table is wired now so there's no dead
// link; this page gets its real content once that endpoint lands.
const AdminBusinessDetailPage = () => {
    const { businessId } = useParams<{ businessId: string }>();
    const navigate = useNavigate();

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <h1 className="dashboard-heading">Business detail</h1>
                <button
                    type="button"
                    className="dashboard-primary-btn"
                    onClick={() => navigate(routes.ADMIN_BUSINESSES)}
                >
                    Back to businesses
                </button>
            </div>

            <section className="dashboard-table-card">
                <p className="dashboard-table-message">
                    Detailed business information isn't available yet for business {businessId}.
                    This page will show profile, owner, members, products, website/template
                    status, requests, subscription, and feature-credit data once the backend
                    endpoint for it is built.
                </p>
            </section>
        </main>
    );
};

export default AdminBusinessDetailPage;
