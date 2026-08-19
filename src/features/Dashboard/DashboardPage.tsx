import "./Dashboard.css";
import useAuth from "../../context/Auth/useAuth";
import SuperAdminDashboard from "./SuperAdminDashboard/SuperAdminDashboard";

const DashboardPage = () => {
    const { session } = useAuth();

    if (session?.systemRole === "SuperAdmin") {
        return <SuperAdminDashboard />;
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
