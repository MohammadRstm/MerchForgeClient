import { useNavigate } from "react-router";
import { routes } from "../../../../config/routes";

/** Shown instead of the full dashboard grid when the catalog is empty — every other section would just be a wall of zero/empty states, which isn't useful. */
const OverviewEmptyState = () => {
    const navigate = useNavigate();

    return (
        <section className="business-dashboard-table-card overview-empty-state">
            <h2>Welcome to MerchForge</h2>
            <p className="business-dashboard-form-hint">
                Start by adding your first product and publishing your storefront. Your sales, orders, and inventory
                will show up here once your store is up and running.
            </p>
            <div className="business-dashboard-header-actions">
                <button type="button" className="business-dashboard-button-primary" onClick={() => navigate(routes.DASHBOARD_PRODUCTS)}>
                    Add Product
                </button>
                <button type="button" className="business-dashboard-button-secondary" onClick={() => navigate(routes.DASHBOARD_WEBSITE)}>
                    Customize Store
                </button>
            </div>
        </section>
    );
};

export default OverviewEmptyState;
