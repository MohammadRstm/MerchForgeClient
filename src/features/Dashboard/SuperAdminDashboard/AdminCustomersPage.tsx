import "./SuperAdminDashboard.css";
import "../BusinessOwnerDashboard/BusinessOwnerDashboard.css";
import { useNavigate } from "react-router";
import { buildAdminCustomerDetailRoute } from "../../../config/routes";
import useAdminCustomersPage from "./hooks/useAdminCustomersPage";
import CustomersTable from "./components/CustomersTable";
import CustomerKpis from "./components/CustomerKpis";
import CustomerGrowthChart from "./components/CustomerGrowthChart";
import CustomerInsights from "./components/CustomerInsights";
import TopCustomersPanel from "./components/TopCustomersPanel";
import CustomerDistributionChart from "./components/CustomerDistributionChart";
import RecentCustomersPanel from "./components/RecentCustomersPanel";

const AdminCustomersPage = () => {
    const {
        customersPage,
        customersLoading,
        customersFetching,
        customersError,
        customersTable,
        businessOptions,

        stats,
        statsLoading,
        statsError,
        statsPeriodDays,
        setStatsPeriodDays,

        growth,
        growthLoading,
        growthError,
        growthPeriod,

        distribution,
        distributionLoading,
        distributionError,
        goToBusiness,

        recentCustomers,
        recentCustomersLoading,
        recentCustomersError,

        topCustomers,
    } = useAdminCustomersPage();

    const navigate = useNavigate();

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <div>
                    <h1 className="dashboard-heading">Customers</h1>
                    <p className="dashboard-subheading">
                        Manage storefront customers and understand customer activity across MerchForge.
                    </p>
                </div>
            </div>

            <CustomerKpis
                stats={stats}
                isLoading={statsLoading}
                isError={statsError}
                periodDays={statsPeriodDays}
                onPeriodChange={setStatsPeriodDays}
            />

            <CustomerGrowthChart
                points={growth}
                isLoading={growthLoading}
                isError={growthError}
                days={growthPeriod.days}
                onDaysChange={growthPeriod.setDays}
            />

            <CustomerInsights
                stats={stats}
                isLoading={statsLoading}
                isError={statsError}
                onSelectNoOrders={() => customersTable.handleHasOrdersChange(false)}
            />

            <div className="business-detail-two-col">
                <TopCustomersPanel panel={topCustomers} />
                <CustomerDistributionChart
                    data={distribution}
                    isLoading={distributionLoading}
                    isError={distributionError}
                    onSelectBusiness={goToBusiness}
                />
            </div>

            <RecentCustomersPanel
                customers={recentCustomers}
                isLoading={recentCustomersLoading}
                isError={recentCustomersError}
            />

            <CustomersTable
                customersPage={customersPage}
                isLoading={customersLoading}
                isFetching={customersFetching}
                isError={customersError}
                tableState={customersTable}
                businessOptions={businessOptions}
                onOpenCustomer={(customerId) => navigate(buildAdminCustomerDetailRoute(customerId))}
            />
        </main>
    );
};

export default AdminCustomersPage;
