import { useSearchParams } from "react-router";
import useSubscriptionPlanGroups from "./data/useSubscriptionPlanGroups";
import usePlanSubscriptionStats from "./data/usePlanSubscriptionStats";
import useSubscriptionPlanDistribution from "./data/useSubscriptionPlanDistribution";
import useRecentSubscriptionActivity from "./data/useRecentSubscriptionActivity";
import useDashboardSubscriptions from "./data/useDashboardSubscriptions";
import useCreateSubscriptionPlanForm from "./ui/useCreateSubscriptionPlanForm";
import useEditPlanModal from "./ui/useEditPlanModal";
import useDeactivatePlanModal from "./ui/useDeactivatePlanModal";
import useSubscriptionsTableState from "./ui/useSubscriptionsTableState";
import useSubscriptionDetailModal from "./ui/useSubscriptionDetailModal";
import useChangeSubscriptionModal from "./ui/useChangeSubscriptionModal";

export type AdminPlansTab = "plans" | "subscriptions";

const useAdminPlansPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tab: AdminPlansTab = searchParams.get("tab") === "subscriptions" ? "subscriptions" : "plans";

    const setTab = (nextTab: AdminPlansTab) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (nextTab === "plans") {
                next.delete("tab");
                next.delete("plan");
            } else {
                next.set("tab", nextTab);
            }
            return next;
        });
    };

    const {
        data: planGroups,
        isLoading: planGroupsLoading,
        isError: planGroupsError,
    } = useSubscriptionPlanGroups();

    const { data: stats, isLoading: statsLoading, isError: statsError } = usePlanSubscriptionStats();

    const {
        data: distribution,
        isLoading: distributionLoading,
        isError: distributionError,
    } = useSubscriptionPlanDistribution();

    const { data: recentActivity, isLoading: recentActivityLoading, isError: recentActivityError } =
        useRecentSubscriptionActivity();

    const createPlanForm = useCreateSubscriptionPlanForm();
    const editPlanModal = useEditPlanModal();
    const deactivatePlanModal = useDeactivatePlanModal();

    const subscriptionsTableState = useSubscriptionsTableState();
    const {
        data: subscriptionsPage,
        isLoading: subscriptionsLoading,
        isFetching: subscriptionsFetching,
        isError: subscriptionsError,
    } = useDashboardSubscriptions(subscriptionsTableState.query);

    const subscriptionDetailModal = useSubscriptionDetailModal();
    const changeSubscriptionModal = useChangeSubscriptionModal(
        subscriptionDetailModal.businessId ?? "",
        subscriptionDetailModal.business?.subscription ?? null
    );

    /** Jumps to the Subscriptions tab pre-filtered to one plan tier, from a plan card or the distribution chart. */
    const goToSubscribersForPlan = (planName: string) => {
        subscriptionsTableState.handlePlanNameChange(planName);
        setTab("subscriptions");
    };

    return {
        tab,
        setTab,

        planGroups: planGroups ?? [],
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
    };
};

export default useAdminPlansPage;
