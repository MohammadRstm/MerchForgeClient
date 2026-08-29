import { useState } from "react";
import useSubscriptionPlanDetail from "../data/useSubscriptionPlanDetail";
import useSubscriptionPlanFeatures from "../data/useSubscriptionPlanFeatures";
import useUpdateSubscriptionPlan from "../data/useUpdateSubscriptionPlan";
import useSetSubscriptionPlanActive from "../data/useSetSubscriptionPlanActive";
import { subscriptionPlanFormSchema } from "../../validation";
import type { FeatureResponse, SubscriptionPlanDetailResponse, SubscriptionPlanFormValues } from "../../types";

type Mode = "view" | "edit";

const toFormValues = (
    plan: SubscriptionPlanDetailResponse,
    features: FeatureResponse[]
): SubscriptionPlanFormValues => {
    const idByKey = new Map(features.map((f) => [f.key, f.id]));
    const selectedFeatures: Record<string, string> = {};

    for (const item of plan.features) {
        const featureId = idByKey.get(item.featureKey);

        if (featureId) {
            selectedFeatures[featureId] = item.limit === null ? "" : String(item.limit);
        }
    }

    return {
        name: plan.name,
        description: plan.description ?? "",
        price: String(plan.price),
        currency: plan.currency,
        billingInterval: plan.billingInterval === "Yearly" ? "Yearly" : "Monthly",
        selectedFeatures,
    };
};

/** Owns which plan (if any) is open in the detail modal and its edit form — the SuperAdmin's view into and editor for the plan/feature catalogue. */
const useSubscriptionPlanDetailModal = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mode, setMode] = useState<Mode>("view");
    const [values, setValues] = useState<SubscriptionPlanFormValues | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { data: plan, isLoading, isError } = useSubscriptionPlanDetail(selectedId);
    const { data: features, isLoading: featuresLoading } = useSubscriptionPlanFeatures();
    const { mutate: updatePlan, isPending: isUpdating } = useUpdateSubscriptionPlan(selectedId ?? "");
    const { mutate: setActive, isPending: isTogglingActive } = useSetSubscriptionPlanActive();

    const open = (planId: string) => {
        setSelectedId(planId);
        setMode("view");
        setValues(null);
        setError(null);
    };

    const close = () => {
        if (isUpdating || isTogglingActive) {
            return;
        }

        setSelectedId(null);
    };

    const startEdit = () => {
        if (!plan || !features) return;

        setValues(toFormValues(plan, features));
        setError(null);
        setMode("edit");
    };

    const cancelEdit = () => {
        setMode("view");
        setValues(null);
        setError(null);
    };

    const changeField = <K extends keyof SubscriptionPlanFormValues>(
        key: K,
        value: SubscriptionPlanFormValues[K]
    ) => {
        setValues((prev) => (prev ? { ...prev, [key]: value } : prev));

        if (error) {
            setError(null);
        }
    };

    const toggleFeature = (featureId: string) => {
        setValues((prev) => {
            if (!prev) return prev;

            const next = { ...prev.selectedFeatures };

            if (featureId in next) {
                delete next[featureId];
            } else {
                next[featureId] = "";
            }

            return { ...prev, selectedFeatures: next };
        });

        if (error) {
            setError(null);
        }
    };

    const setFeatureLimit = (featureId: string, limit: string) => {
        setValues((prev) =>
            prev ? { ...prev, selectedFeatures: { ...prev.selectedFeatures, [featureId]: limit } } : prev
        );

        if (error) {
            setError(null);
        }
    };

    const submitEdit = () => {
        if (!values || !plan) return;

        const featuresPayload = Object.entries(values.selectedFeatures).map(([featureId, limit]) => ({
            featureId,
            limit: limit.trim() === "" ? null : Number(limit),
        }));

        const result = subscriptionPlanFormSchema.safeParse({ ...values, features: featuresPayload });

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        updatePlan(
            { ...result.data, isActive: plan.isActive },
            {
                onSuccess: () => {
                    setMode("view");
                    setValues(null);
                },
            }
        );
    };

    const toggleActive = () => {
        if (!plan) return;

        setActive({ id: plan.id, isActive: !plan.isActive });
    };

    return {
        isOpen: !!selectedId,
        plan,
        isLoading,
        isError,
        features,
        featuresLoading,

        mode,
        values,
        error,
        isUpdating,
        isTogglingActive,

        open,
        close,
        startEdit,
        cancelEdit,
        changeField,
        toggleFeature,
        setFeatureLimit,
        submitEdit,
        toggleActive,
    };
};

export default useSubscriptionPlanDetailModal;
