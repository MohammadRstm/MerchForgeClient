import { useState } from "react";
import useSubscriptionPlanGroups from "../data/useSubscriptionPlanGroups";
import useSetSubscriptionPlanActive from "../data/useSetSubscriptionPlanActive";

/**
 * Owns the "which interval(s)" step for a grouped plan tier - Monthly and Yearly
 * are independent rows that can genuinely have different active states, so this
 * doesn't assume a single toggle applies to both. Each interval's own
 * deactivate/reactivate reuses the existing per-row mutation unchanged. Re-reads
 * the live plan-groups query by name (rather than holding a stale snapshot) so
 * the modal reflects each interval's real state immediately after a toggle.
 */
const useDeactivatePlanModal = () => {
    const [tierName, setTierName] = useState<string | null>(null);

    const { data: groups } = useSubscriptionPlanGroups();
    const group = tierName ? groups?.find((g) => g.name === tierName) ?? null : null;

    const { mutate: setActive, isPending, variables } = useSetSubscriptionPlanActive();

    const open = (name: string) => setTierName(name);
    const close = () => {
        if (isPending) return;
        setTierName(null);
    };

    const toggleInterval = (planId: string, currentIsActive: boolean) => {
        setActive({ id: planId, isActive: !currentIsActive });
    };

    return {
        isOpen: !!tierName,
        group,
        isPending,
        pendingPlanId: variables?.id ?? null,
        open,
        close,
        toggleInterval,
    };
};

export default useDeactivatePlanModal;
