import "./Dashboard.css";
import useAuth from "../../context/Auth/useAuth";
import SuperAdminDashboard from "./SuperAdminDashboard/SuperAdminDashboard";
import BusinessOwnerDashboard from "./BusinessOwnerDashboard/BusinessOwnerDashboard";

const DashboardPage = () => {
    const { session } = useAuth();

    if (session?.systemRole === "SuperAdmin") {
        return <SuperAdminDashboard />;
    }

    if (session?.business?.role === "Owner") {
        return <BusinessOwnerDashboard />;
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

export default DashboardPage;
