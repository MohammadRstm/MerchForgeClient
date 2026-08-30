import { useState } from "react";
import { useSearchParams } from "react-router";
import useAuth from "../../../../context/Auth/useAuth";
import usePublicSubscriptionPlans from "../../../Plans/hooks/usePublicSubscriptionPlans";
import useBusinessSubscription from "./data/useBusinessSubscription";
import useSubscribeToPlan from "./data/useSubscribeToPlan";
import useCancelSubscription from "./data/useCancelSubscription";
import useBusinessFeatures from "./data/useBusinessFeatures";
import useBusinessDashboardStats from "./data/useBusinessDashboardStats";
import useSubscriptionHistory from "./data/useSubscriptionHistory";
import { groupPlansByTier, calculateYearlySavings } from "../utils/subscriptionPlanGroups";
import { getUsageWarningLevel, type FeatureUsage } from "../utils/subscriptionUsage";
import type { SubscriptionPlanDetailResponse } from "../../SuperAdminDashboard/types";

const AI_IMAGE_EDITING_KEY = "ai.image_editing";

const useOwnerBillingPage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";

    const [searchParams] = useSearchParams();
    const preselectedPlanId = searchParams.get("plan") ?? undefined;

    const { data: plans, isLoading: plansLoading, isError: plansError } = usePublicSubscriptionPlans();

    const {
        data: subscription,
        isLoading: subscriptionLoading,
        isError: subscriptionError,
    } = useBusinessSubscription(businessId);

    const {
        data: businessFeatures,
        isLoading: featuresLoading,
        isError: featuresError,
    } = useBusinessFeatures(businessId);

    const { data: stats } = useBusinessDashboardStats(businessId);

    const {
        data: history,
        isLoading: historyLoading,
        isError: historyError,
    } = useSubscriptionHistory(businessId);

    const isActive = subscription?.status === "Active";

    // Which interval the plan grid/toggle currently shows — defaults to the
    // subscribed interval so an owner on a yearly plan doesn't land on a monthly
    // view of their own plan; falls back to Monthly with no subscription.
    const [selectedInterval, setSelectedInterval] = useState<"Monthly" | "Yearly">(
        isActive && subscription?.billingInterval === "Yearly" ? "Yearly" : "Monthly"
    );

    const tierGroups = groupPlansByTier(plans ?? []);

    const isCurrentPlan = (planId: string) => {
        if (!isActive) return false;
        const plan = plans?.find((p) => p.id === planId);
        return plan?.name === subscription!.planName && plan?.billingInterval === subscription!.billingInterval;
    };

    const currentPlanDetail = plans?.find(
        (p) => isActive && p.name === subscription!.planName && p.billingInterval === subscription!.billingInterval
    );

    // The plan-switch suggestion in the current-plan hero only ever offers moving
    // Monthly -> Yearly (where a real saving exists to show) — switching the other
    // direction has no discount to advertise, so there's nothing honest to suggest.
    const currentTierGroup = currentPlanDetail
        ? tierGroups.find((g) => g.name === currentPlanDetail.name)
        : undefined;
    const yearlyUpgradePlan =
        currentPlanDetail?.billingInterval === "Monthly" ? currentTierGroup?.yearly : undefined;
    const switchSavings =
        currentTierGroup?.monthly && currentTierGroup?.yearly
            ? calculateYearlySavings(currentTierGroup.monthly.price, currentTierGroup.yearly.price)
            : null;

    // ---- usage ----

    const aiCreditsFeature = businessFeatures?.find((f) => f.featureKey === AI_IMAGE_EDITING_KEY);
    const aiCreditsLimit = subscription?.features.find((f) => f.featureKey === AI_IMAGE_EDITING_KEY)?.limit ?? null;

    const aiCreditsUsage: FeatureUsage | undefined = aiCreditsFeature
        ? {
              featureKey: AI_IMAGE_EDITING_KEY,
              featureName: aiCreditsFeature.featureName,
              limit: aiCreditsLimit,
              remaining: aiCreditsLimit !== null ? aiCreditsFeature.creditsRemaining : null,
              used: aiCreditsLimit !== null ? aiCreditsLimit - aiCreditsFeature.creditsRemaining : null,
              percent:
                  aiCreditsLimit !== null && aiCreditsLimit > 0
                      ? Math.min(100, Math.max(0, ((aiCreditsLimit - aiCreditsFeature.creditsRemaining) / aiCreditsLimit) * 100))
                      : null,
          }
        : undefined;

    const aiCreditsWarning = getUsageWarningLevel(aiCreditsUsage?.percent ?? null);

    // ---- plan change confirmation ----

    const [pendingPlan, setPendingPlan] = useState<SubscriptionPlanDetailResponse | undefined>(undefined);
    const { mutate: subscribeMutate, isPending: isSubscribing } = useSubscribeToPlan(businessId);

    const requestPlanChange = (plan: SubscriptionPlanDetailResponse) => setPendingPlan(plan);
    const cancelPlanChange = () => setPendingPlan(undefined);
    const confirmPlanChange = () => {
        if (!pendingPlan) return;
        subscribeMutate(pendingPlan.id, { onSuccess: () => setPendingPlan(undefined) });
    };

    // ---- cancellation (moved here from Settings — Billing is the subscription home now) ----

    const [confirmingCancel, setConfirmingCancel] = useState(false);
    const { mutate: cancelMutate, isPending: isCancelling } = useCancelSubscription(businessId);

    const requestCancel = () => setConfirmingCancel(true);
    const cancelCancel = () => setConfirmingCancel(false);
    const confirmCancel = () => cancelMutate(undefined, { onSuccess: () => setConfirmingCancel(false) });

    return {
        businessId,
        preselectedPlanId,

        plans,
        plansLoading,
        plansError,
        tierGroups,

        subscription,
        subscriptionLoading,
        subscriptionError,
        isActive,
        currentPlanDetail,
        yearlyUpgradePlan,
        switchSavings,

        selectedInterval,
        setSelectedInterval,
        isCurrentPlan,

        stats,

        aiCreditsUsage,
        aiCreditsWarning,
        featuresLoading,
        featuresError,

        history,
        historyLoading,
        historyError,

        pendingPlan,
        requestPlanChange,
        cancelPlanChange,
        confirmPlanChange,
        isSubscribing,

        confirmingCancel,
        requestCancel,
        cancelCancel,
        confirmCancel,
        isCancelling,
    };
};

export default useOwnerBillingPage;
