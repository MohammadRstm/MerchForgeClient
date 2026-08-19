import { Navigate, Outlet } from "react-router";
import useAuth from "../context/Auth/useAuth";
import Spinner from "../components/LoadingSpinner/LoadingSpinner";

const AuthenticatedRoutes = () => {
    const { isAuthenticated, isInitializing } = useAuth();

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
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AuthenticatedRoutes;
