import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../context/Auth/useAuth";
import Spinner from "../components/LoadingSpinner/LoadingSpinner";

const AuthenticatedRoutes = () => {
    const { isAuthenticated, isInitializing } = useAuth();
    const location = useLocation();

    // Still trying to restore the session from the refresh-token cookie — render
    // nothing conclusive yet, otherwise a still-valid session would flash a
    // redirect to /login before the silent refresh has a chance to resolve.
    if(isInitializing){
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
                <Spinner size={32} />
            </div>
        );
    }

    if(!isAuthenticated){
        // Carries the page the user was actually trying to reach, so a direct
        // deep link (e.g. a bookmarked /dashboard/orders) survives the round
        // trip through login instead of always dropping back to the default
        // dashboard route.
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default AuthenticatedRoutes;
