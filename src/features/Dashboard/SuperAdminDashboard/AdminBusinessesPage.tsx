import "./SuperAdminDashboard.css";
import { useNavigate } from "react-router";
import { buildAdminBusinessDetailRoute } from "../../../config/routes";
import useAdminBusinessesPage from "./hooks/useAdminBusinessesPage";
import BusinessesTable from "./components/BusinessesTable";

const AdminBusinessesPage = () => {
    const {
        businessesPage,
        businessesLoading,
        businessesFetching,
        businessesError,
        businessesTable,
    } = useAdminBusinessesPage();

    const navigate = useNavigate();

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <h1 className="dashboard-heading">Businesses</h1>
            </div>

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
