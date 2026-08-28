import { useState } from "react";
import { useSearchParams } from "react-router";
import useAuth from "../../../../context/Auth/useAuth";
import usePublicSubscriptionPlans from "../../../Plans/hooks/usePublicSubscriptionPlans";
import useBusinessSubscription from "./data/useBusinessSubscription";
import useSubscribeToPlan from "./data/useSubscribeToPlan";
import useCancelSubscription from "./data/useCancelSubscription";

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

    const { mutate: subscribeMutate, isPending: isSubscribing, variables: pendingPlanId } = useSubscribeToPlan(businessId);

    const [confirmingCancel, setConfirmingCancel] = useState(false);
    const { mutate: cancelMutate, isPending: isCancelling } = useCancelSubscription(businessId);

    // BusinessSubscriptionResponse doesn't carry the plan's id, only its name/
    // interval — matching on those is the only correlation available, and is
    // safe given plan names are unique per billing interval in the seed data.
    const isCurrentPlan = (planId: string) => {
        if (subscription?.status !== "Active") return false;

        const plan = plans?.find((p) => p.id === planId);
        return plan?.name === subscription.planName && plan?.billingInterval === subscription.billingInterval;
    };

    const subscribe = (planId: string) => subscribeMutate(planId);

    const requestCancel = () => setConfirmingCancel(true);
    const cancelCancel = () => setConfirmingCancel(false);
    const confirmCancel = () => cancelMutate(undefined, { onSuccess: () => setConfirmingCancel(false) });

    return {
        plans,
        plansLoading,
        plansError,

        subscription,
        subscriptionLoading,
        subscriptionError,

        preselectedPlanId,

        subscribe,
        isSubscribing,
        pendingPlanId,
        isCurrentPlan,

        confirmingCancel,
        requestCancel,
        cancelCancel,
        confirmCancel,
        isCancelling,
    };
};

export default useOwnerBillingPage;
