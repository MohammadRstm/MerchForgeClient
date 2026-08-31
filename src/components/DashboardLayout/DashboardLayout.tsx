import { Outlet } from "react-router";
import {
    FiHome,
    FiBox,
    FiArchive,
    FiShoppingCart,
    FiGlobe,
    FiSettings,
    FiBriefcase,
    FiInbox,
    FiLayout,
    FiSliders,
    FiUsers,
    FiUserCheck,
    FiCreditCard,
    FiDollarSign,
} from "react-icons/fi";
import "./DashboardLayout.css";
import Sidebar, { type DashboardNavItem } from "./Sidebar";
import DashboardTopBar from "./DashboardTopBar";
import useAuth from "../../context/Auth/useAuth";
import useTheme from "../../context/Theme/useTheme";
import { routes } from "../../config/routes";

const OWNER_NAV: DashboardNavItem[] = [
    { label: "Overview", to: routes.DASHBOARD, icon: FiHome, end: true },
    { label: "Products", to: routes.DASHBOARD_PRODUCTS, icon: FiBox },
    { label: "Inventory", to: routes.DASHBOARD_INVENTORY, icon: FiArchive },
    { label: "Orders", to: routes.DASHBOARD_ORDERS, icon: FiShoppingCart },
    { label: "Website & Templates", to: routes.DASHBOARD_WEBSITE, icon: FiGlobe },
    { label: "Billing", to: routes.DASHBOARD_BILLING, icon: FiDollarSign },
    { label: "Settings", to: routes.DASHBOARD_SETTINGS, icon: FiSettings },
];

const ADMIN_NAV: DashboardNavItem[] = [
    { label: "Overview", to: routes.ADMIN, icon: FiHome, end: true },
    { label: "Businesses", to: routes.ADMIN_BUSINESSES, icon: FiBriefcase },
    { label: "Website Requests", to: routes.ADMIN_WEBSITE_REQUESTS, icon: FiInbox },
    { label: "Templates", to: routes.ADMIN_TEMPLATES, icon: FiLayout },
    { label: "Product Fields", to: routes.ADMIN_PRODUCT_FIELDS, icon: FiSliders },
    { label: "Users & Security", to: routes.ADMIN_USERS, icon: FiUsers },
    { label: "Customers", to: routes.ADMIN_CUSTOMERS, icon: FiUserCheck },
    { label: "Plans", to: routes.ADMIN_PLANS, icon: FiCreditCard },
];

interface DashboardLayoutProps {
    role: "owner" | "admin";
}

// Shared shell for both dashboards: same sidebar/topbar/content chrome, different
// nav items and accent color (set via the dashboard-shell--{role} class in CSS) so
// the two roles stay visually distinguishable without duplicating the layout.
const DashboardLayout = ({ role }: DashboardLayoutProps) => {
    const { session } = useAuth();
    const { theme } = useTheme();

    const items = role === "owner" ? OWNER_NAV : ADMIN_NAV;
    const topBarLabel =
        role === "owner" ? session?.business?.name || "Business" : "Platform admin";

    return (
        <div className={`dashboard-shell dashboard-shell--${role}`} data-theme={theme}>
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
