import "./SuperAdminDashboard.css";
import { Link, useNavigate } from "react-router";
import { buildAdminCustomerDetailRoute, routes } from "../../../config/routes";
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

            {customersTable.businessId && (
                <p className="dashboard-filter-notice">
                    Showing customers of <strong>{customersTable.businessName ?? "this business"}</strong> only.{" "}
                    <Link to={routes.ADMIN_CUSTOMERS}>Clear filter</Link>
                </p>
            )}

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
