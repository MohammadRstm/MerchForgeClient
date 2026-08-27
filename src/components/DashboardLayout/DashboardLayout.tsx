import { Outlet } from "react-router";
import "./DashboardLayout.css";
import Sidebar, { type DashboardNavItem } from "./Sidebar";
import DashboardTopBar from "./DashboardTopBar";
import useAuth from "../../context/Auth/useAuth";
import { routes } from "../../config/routes";

const OWNER_NAV: DashboardNavItem[] = [
    { label: "Overview", to: routes.DASHBOARD, end: true },
    { label: "Products", to: routes.DASHBOARD_PRODUCTS },
    { label: "Inventory", to: routes.DASHBOARD_INVENTORY },
    { label: "Website & Templates", to: routes.DASHBOARD_WEBSITE },
    { label: "Settings", to: routes.DASHBOARD_SETTINGS },
];

const ADMIN_NAV: DashboardNavItem[] = [
    { label: "Overview", to: routes.ADMIN, end: true },
    { label: "Businesses", to: routes.ADMIN_BUSINESSES },
    { label: "Website Requests", to: routes.ADMIN_WEBSITE_REQUESTS },
    { label: "Templates", to: routes.ADMIN_TEMPLATES },
    { label: "Product Fields", to: routes.ADMIN_PRODUCT_FIELDS },
    { label: "Users & Security", to: routes.ADMIN_USERS },
];

interface DashboardLayoutProps {
    role: "owner" | "admin";
}

// Shared shell for both dashboards: same sidebar/topbar/content chrome, different
// nav items and accent color (set via the dashboard-shell--{role} class in CSS) so
// the two roles stay visually distinguishable without duplicating the layout.
const DashboardLayout = ({ role }: DashboardLayoutProps) => {
    const { session } = useAuth();

    const items = role === "owner" ? OWNER_NAV : ADMIN_NAV;
    const topBarLabel =
        role === "owner" ? session?.business?.name || "Business" : "Platform admin";

    return (
        <div className={`dashboard-shell dashboard-shell--${role}`}>
            <Sidebar items={items} />
            <div className="dashboard-shell-main">
                <DashboardTopBar label={topBarLabel} />
                <div className="dashboard-shell-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
