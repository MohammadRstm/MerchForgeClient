import "./SuperAdminDashboard.css";
import useAdminPlansPage from "./hooks/useAdminPlansPage";
import SubscriptionPlansTable from "./components/SubscriptionPlansTable";
import CreateSubscriptionPlanModal from "./components/CreateSubscriptionPlanModal";
import SubscriptionPlanDetailModal from "./components/SubscriptionPlanDetailModal";

const AdminPlansPage = () => {
    const {
        subscriptionPlans,
        subscriptionPlansLoading,
        subscriptionPlansError,
        createPlanForm,
        subscriptionPlanDetailModal,
    } = useAdminPlansPage();

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <h1 className="dashboard-heading">Subscription Plans</h1>
            </div>

            <SubscriptionPlansTable
                plans={subscriptionPlans}
                isLoading={subscriptionPlansLoading}
                isError={subscriptionPlansError}
                onAdd={createPlanForm.open}
                onOpen={subscriptionPlanDetailModal.open}
            />

            <CreateSubscriptionPlanModal form={createPlanForm} />

            <SubscriptionPlanDetailModal modal={subscriptionPlanDetailModal} />
        </main>
    );
};

export default AdminPlansPage;
