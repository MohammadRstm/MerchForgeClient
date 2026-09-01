import { useNavigate } from "react-router";
import "./SuperAdminDashboard.css";
import "../BusinessOwnerDashboard/BusinessOwnerDashboard.css";
import { buildAdminBusinessDetailRoute } from "../../../config/routes";
import useAdminPlansPage from "./hooks/useAdminPlansPage";
import CreateSubscriptionPlanModal from "./components/CreateSubscriptionPlanModal";
import PlanSubscriptionKpis from "./components/PlanSubscriptionKpis";
import SubscriptionDistributionChart from "./components/SubscriptionDistributionChart";
import BillingPeriodDistribution from "./components/BillingPeriodDistribution";
import RecentSubscriptionActivity from "./components/RecentSubscriptionActivity";
import PlanCard from "./components/PlanCard";
import EditPlanModal from "./components/EditPlanModal";
import DeactivatePlanModal from "./components/DeactivatePlanModal";
import SubscriptionsTable from "./components/SubscriptionsTable";
import SubscriptionDetailDrawer from "./components/SubscriptionDetailDrawer";

const AdminPlansPage = () => {
    const navigate = useNavigate();
    const {
        tab,
        setTab,

        planGroups,
        planGroupsLoading,
        planGroupsError,
        stats,
        statsLoading,
        statsError,
        distribution,
        distributionLoading,
        distributionError,
        recentActivity,
        recentActivityLoading,
        recentActivityError,

        createPlanForm,
        editPlanModal,
        deactivatePlanModal,
        goToSubscribersForPlan,

        subscriptionsTableState,
        subscriptionsPage,
        subscriptionsLoading,
        subscriptionsFetching,
        subscriptionsError,
        subscriptionDetailModal,
        changeSubscriptionModal,
    } = useAdminPlansPage();

    return (
        <main className="dashboard-page">
            <div className="dashboard-page-header">
                <div>
                    <h1 className="dashboard-heading">Plans & Subscriptions</h1>
                    <p className="dashboard-subheading">Platform billing and subscription administration.</p>
                </div>
                {tab === "plans" && (
                    <button type="button" className="dashboard-primary-btn" onClick={createPlanForm.open}>
                        + Create Plan
                    </button>
                )}
            </div>

            <div className="order-status-tabs" role="tablist" aria-label="Plans and Subscriptions sections">
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "plans"}
                    className={`order-status-tab${tab === "plans" ? " order-status-tab--active" : ""}`}
                    onClick={() => setTab("plans")}
                >
                    Plans
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === "subscriptions"}
                    className={`order-status-tab${tab === "subscriptions" ? " order-status-tab--active" : ""}`}
                    onClick={() => setTab("subscriptions")}
                >
                    Subscriptions
                </button>
            </div>

            {tab === "plans" ? (
                <>
                    <PlanSubscriptionKpis stats={stats} isLoading={statsLoading} isError={statsError} />

                    <div className="business-detail-two-col">
                        <SubscriptionDistributionChart
                            data={distribution}
                            isLoading={distributionLoading}
                            isError={distributionError}
                            onSelectPlan={goToSubscribersForPlan}
                        />
                        <BillingPeriodDistribution stats={stats} isLoading={statsLoading} isError={statsError} />
                    </div>

                    <RecentSubscriptionActivity
                        entries={recentActivity}
                        isLoading={recentActivityLoading}
                        isError={recentActivityError}
                    />

                    {planGroupsLoading ? (
                        <div className="dashboard-table-loading">Loading plans...</div>
                    ) : planGroupsError ? (
                        <p className="dashboard-table-message dashboard-table-message--error">
                            Failed to load subscription plans. Please try again.
                        </p>
                    ) : planGroups.length === 0 ? (
                        <p className="dashboard-table-message">No subscription plans yet.</p>
                    ) : (
                        <div className="plan-cards-grid">
                            {planGroups.map((group) => (
                                <PlanCard
                                    key={group.name}
                                    group={group}
                                    onEdit={() => editPlanModal.open(group)}
                                    onManageSubscribers={() => goToSubscribersForPlan(group.name)}
                                    onDeactivate={() => deactivatePlanModal.open(group.name)}
                                />
                            ))}
                        </div>
                    )}

                    <CreateSubscriptionPlanModal form={createPlanForm} />
                    <EditPlanModal modal={editPlanModal} />
                    <DeactivatePlanModal modal={deactivatePlanModal} />
                </>
            ) : (
                <>
                    <SubscriptionsTable
                        subscriptionsPage={subscriptionsPage}
                        isLoading={subscriptionsLoading}
                        isFetching={subscriptionsFetching}
                        isError={subscriptionsError}
                        tableState={subscriptionsTableState}
                        onOpenSubscription={subscriptionDetailModal.open}
                        onOpenBusiness={(businessId) => navigate(buildAdminBusinessDetailRoute(businessId))}
                    />

                    <SubscriptionDetailDrawer modal={subscriptionDetailModal} changeModal={changeSubscriptionModal} />
                </>
            )}
        </main>
    );
};

export default AdminPlansPage;
