import { useState } from "react";
import useSubscriptionPlanFeatures from "../data/useSubscriptionPlanFeatures";
import useUpdateSubscriptionPlan from "../data/useUpdateSubscriptionPlan";
import { subscriptionPlanFormSchema } from "../../validation";
import type { SubscriptionPlanGroup } from "../../types";

type EditPlanFormValues = {
    name: string;
    description: string;
    currency: string;
    monthlyPrice: string;
    yearlyPrice: string;
    selectedFeatures: Record<string, string>;
};

type PriceChange = { label: string; from: string; to: string };

const toFormValues = (group: SubscriptionPlanGroup, featureIdByKey: Map<string, string>): EditPlanFormValues => {
    const selectedFeatures: Record<string, string> = {};

    for (const item of group.features) {
        const featureId = featureIdByKey.get(item.featureKey);
        if (featureId) {
            selectedFeatures[featureId] = item.limit === null ? "" : String(item.limit);
        }
    }

    return {
        name: group.name,
        description: group.description ?? "",
        currency: group.currency,
        monthlyPrice: group.monthly ? String(group.monthly.price) : "",
        yearlyPrice: group.yearly ? String(group.yearly.price) : "",
        selectedFeatures,
    };
};

/**
 * Owns the Edit Plan flow for one grouped tier — a save writes to both underlying
 * Monthly/Yearly SubscriptionPlan rows where they exist (two sequential PUTs,
 * same shared fields, each interval's own price), since the two rows have no
 * pairing relationship in the database. Active state is untouched here — that's
 * the separate Deactivate/Reactivate flow's job, same as the original modal.
 */
const useEditPlanModal = () => {
    const [group, setGroup] = useState<SubscriptionPlanGroup | null>(null);
    const [values, setValues] = useState<EditPlanFormValues | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [confirmStep, setConfirmStep] = useState(false);

    const { data: features } = useSubscriptionPlanFeatures();
    const featureIdByKey = new Map((features ?? []).map((f) => [f.key, f.id]));

    const monthlyId = group?.monthly?.id ?? null;
    const yearlyId = group?.yearly?.id ?? null;

    const { mutateAsync: updateMonthly, isPending: isUpdatingMonthly } = useUpdateSubscriptionPlan(monthlyId ?? "");
    const { mutateAsync: updateYearly, isPending: isUpdatingYearly } = useUpdateSubscriptionPlan(yearlyId ?? "");
    const isSaving = isUpdatingMonthly || isUpdatingYearly;

    const open = (target: SubscriptionPlanGroup) => {
        setGroup(target);
        setValues(toFormValues(target, featureIdByKey));
        setError(null);
        setConfirmStep(false);
    };

    const close = () => {
        if (isSaving) return;
        setGroup(null);
        setValues(null);
        setConfirmStep(false);
    };

    const changeField = <K extends keyof EditPlanFormValues>(key: K, value: EditPlanFormValues[K]) => {
        setValues((prev) => (prev ? { ...prev, [key]: value } : prev));
        if (error) setError(null);
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
    };

    const setFeatureLimit = (featureId: string, limit: string) => {
        setValues((prev) =>
            prev ? { ...prev, selectedFeatures: { ...prev.selectedFeatures, [featureId]: limit } } : prev
        );
    };

    /** Only the fields that actually changed — what the subscriber-impact confirmation step shows. */
    const buildChangeSummary = (): PriceChange[] => {
        if (!group || !values) return [];

        const changes: PriceChange[] = [];

        if (group.monthly && values.monthlyPrice !== String(group.monthly.price)) {
            changes.push({ label: "Monthly price", from: `${group.currency} ${group.monthly.price}`, to: `${values.currency} ${values.monthlyPrice}` });
        }
        if (group.yearly && values.yearlyPrice !== String(group.yearly.price)) {
            changes.push({ label: "Yearly price", from: `${group.currency} ${group.yearly.price}`, to: `${values.currency} ${values.yearlyPrice}` });
        }

        const originalFeatureIds = new Set(
            group.features.map((f) => featureIdByKey.get(f.featureKey)).filter((id): id is string => !!id)
        );
        const newFeatureIds = new Set(Object.keys(values.selectedFeatures));
        const featuresChanged =
            originalFeatureIds.size !== newFeatureIds.size ||
            [...originalFeatureIds].some((id) => !newFeatureIds.has(id)) ||
            group.features.some((f) => {
                const featureId = featureIdByKey.get(f.featureKey);
                if (!featureId) return false;
                const originalLimit = f.limit === null ? "" : String(f.limit);
                return values.selectedFeatures[featureId] !== undefined && values.selectedFeatures[featureId] !== originalLimit;
            });

        if (featuresChanged) {
            changes.push({ label: "Included features / limits", from: "previous configuration", to: "updated configuration" });
        }

        return changes;
    };

    const buildPayload = (price: string) => {
        if (!values) return null;

        const featurePayload = Object.entries(values.selectedFeatures).map(([featureId, limit]) => ({
            featureId,
            limit: limit.trim() === "" ? null : Number(limit),
        }));

        return {
            name: values.name,
            description: values.description,
            price,
            currency: values.currency,
            features: featurePayload,
        };
    };

    const requestSave = () => {
        if (!values || !group) return;

        if (group.totalActiveSubscriberCount > 0 && !confirmStep) {
            setConfirmStep(true);
            return;
        }

        void commitSave();
    };

    const commitSave = async () => {
        if (!values || !group) return;

        try {
            if (group.monthly) {
                const raw = buildPayload(values.monthlyPrice);
                const result = subscriptionPlanFormSchema.safeParse({ ...raw, billingInterval: "Monthly" });
                if (!result.success) {
                    setError(result.error.issues[0].message);
                    setConfirmStep(false);
                    return;
                }
                await updateMonthly({ ...result.data, isActive: group.monthly.isActive });
            }

            if (group.yearly) {
                const raw = buildPayload(values.yearlyPrice);
                const result = subscriptionPlanFormSchema.safeParse({ ...raw, billingInterval: "Yearly" });
                if (!result.success) {
                    setError(result.error.issues[0].message);
                    setConfirmStep(false);
                    return;
                }
                await updateYearly({ ...result.data, isActive: group.yearly.isActive });
            }

            close();
        } catch {
            setError("Failed to save changes. Please try again.");
            setConfirmStep(false);
        }
    };

    const cancelConfirm = () => setConfirmStep(false);

    return {
        isOpen: !!group,
        group,
        values,
        error,
        confirmStep,
        changeSummary: confirmStep ? buildChangeSummary() : [],
        isSaving,
        features: features ?? [],
        open,
        close,
        changeField,
        toggleFeature,
        setFeatureLimit,
        requestSave,
        commitSave,
        cancelConfirm,
    };
};

export default useEditPlanModal;
