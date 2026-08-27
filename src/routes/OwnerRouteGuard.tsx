import { Navigate, Outlet } from "react-router";
import useAuth from "../context/Auth/useAuth";
import { routes } from "../config/routes";
import "../features/Dashboard/Dashboard.css";

// Gates the /dashboard/* tree (business-owner dashboard). SuperAdmins are sent to
// their own /admin/* tree instead of seeing an owner shell. A business Member/Admin
// (any non-Owner business role) has no dedicated dashboard yet — preserved as the
// same placeholder DashboardPage.tsx used to render for that case, unchanged.
const OwnerRouteGuard = () => {
    const { session } = useAuth();

    if (session?.systemRole === "SuperAdmin") {
        return <Navigate to={routes.ADMIN} replace />;
    }

    if (session?.business?.role === "Owner") {
        return <Outlet />;
    }

    return (
        <main className="dashboard-page dashboard-page--placeholder">
            <div className="dashboard-placeholder">
                <h1>Dashboard</h1>
                <p>Your dashboard is coming soon.</p>
            </div>
        </main>
    );
};

export default OwnerRouteGuard;
