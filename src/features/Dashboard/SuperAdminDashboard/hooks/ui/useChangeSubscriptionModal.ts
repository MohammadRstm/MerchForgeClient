import { useState } from "react";
import useSubscriptionPlanGroups from "../data/useSubscriptionPlanGroups";
import useChangeBusinessSubscription from "../data/useChangeBusinessSubscription";
import type { BusinessDetailResponse } from "../../types";

type SelectedTarget = {
    planId: string;
    planName: string;
    billingInterval: "Monthly" | "Yearly";
    price: number;
    currency: string;
};

/** Owns the plan-picker + confirmation for changing one business's subscription. Only offers currently-active plan rows, since an inactive target is rejected server-side anyway. */
const useChangeSubscriptionModal = (businessId: string, currentSubscription: BusinessDetailResponse["subscription"]) => {
    const [isOpen, setIsOpen] = useState(false);
    const [target, setTarget] = useState<SelectedTarget | null>(null);

    const { data: groups } = useSubscriptionPlanGroups();
    const { mutate: changeSubscription, isPending } = useChangeBusinessSubscription(businessId);

    const open = () => {
        setTarget(null);
        setIsOpen(true);
    };
    const close = () => {
        if (isPending) return;
        setIsOpen(false);
        setTarget(null);
    };

    const selectTarget = (
        planId: string,
        planName: string,
        billingInterval: "Monthly" | "Yearly",
        price: number,
        currency: string
    ) => {
        setTarget({ planId, planName, billingInterval, price, currency });
    };

    const backToPicker = () => setTarget(null);

    const confirmChange = () => {
        if (!target) return;
        changeSubscription(target.planId, { onSuccess: () => close() });
    };

    return {
        isOpen,
        groups: groups ?? [],
        currentSubscription,
        target,
        isPending,
        open,
        close,
        selectTarget,
        backToPicker,
        confirmChange,
    };
};

export default useChangeSubscriptionModal;
