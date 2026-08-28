import "./SuperAdminDashboard.css";
import { useNavigate } from "react-router";
import { buildAdminCustomerDetailRoute } from "../../../config/routes";
import useAdminCustomersPage from "./hooks/useAdminCustomersPage";
import CustomersTable from "./components/CustomersTable";

const AdminCustomersPage = () => {
    const {
        customersPage,
        customersLoading,
        customersFetching,
        customersError,
        customersTable,
    } = useAdminCustomersPage();

    const navigate = useNavigate();

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <h1 className="dashboard-heading">Customers</h1>
            </div>

            <CustomersTable
                customersPage={customersPage}
                isLoading={customersLoading}
                isFetching={customersFetching}
                isError={customersError}
                tableState={customersTable}
                onOpenCustomer={(customerId) => navigate(buildAdminCustomerDetailRoute(customerId))}
            />
        </main>
    );
};

export default AdminCustomersPage;
