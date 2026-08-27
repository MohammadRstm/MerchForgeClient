import { Navigate, Outlet } from "react-router";
import useAuth from "../context/Auth/useAuth";
import { routes } from "../config/routes";

// Gates the /admin/* tree (SuperAdmin dashboard). This is a UX convenience only —
// every admin API endpoint already enforces the SystemSuperAdmin policy server-side,
// so a non-admin manually navigating here still can't load any real admin data even
// if this redirect were somehow bypassed.
const AdminRouteGuard = () => {
    const { session } = useAuth();

    if (session?.systemRole === "SuperAdmin") {
        return <Outlet />;
    }

    return <Navigate to={routes.DASHBOARD} replace />;
};

export default AdminRouteGuard;
