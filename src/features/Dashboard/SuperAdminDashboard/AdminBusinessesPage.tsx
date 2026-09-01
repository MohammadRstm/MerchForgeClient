import "./SuperAdminDashboard.css";
import { useNavigate } from "react-router";
import { buildAdminBusinessDetailRoute } from "../../../config/routes";
import useAdminBusinessesPage from "./hooks/useAdminBusinessesPage";
import BusinessesTable from "./components/BusinessesTable";
import PlatformBusinessSummary from "./components/PlatformBusinessSummary";

const AdminBusinessesPage = () => {
    const {
        businessesPage,
        businessesLoading,
        businessesFetching,
        businessesError,
        businessesTable,
        stats,
        statsLoading,
        statsError,
    } = useAdminBusinessesPage();

    const navigate = useNavigate();

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <div>
                    <h1 className="dashboard-heading">Businesses</h1>
                    <p className="dashboard-subheading">Manage and monitor all businesses using MerchForge.</p>
                </div>
            </div>

            <PlatformBusinessSummary stats={stats} isLoading={statsLoading} isError={statsError} />

            <BusinessesTable
                businessesPage={businessesPage}
                isLoading={businessesLoading}
                isFetching={businessesFetching}
                isError={businessesError}
                tableState={businessesTable}
                onOpenBusiness={(businessId) => navigate(buildAdminBusinessDetailRoute(businessId))}
            />
        </main>
    );
};

export default AdminBusinessesPage;
