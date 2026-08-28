import { useState } from "react";
import useCreateSubscriptionPlan from "../data/useCreateSubscriptionPlan";
import { subscriptionPlanFormSchema } from "../../validation";
import type { SubscriptionPlanFormValues } from "../../types";

const EMPTY_FORM: SubscriptionPlanFormValues = {
    name: "",
    description: "",
    price: "0",
    currency: "USD",
    billingInterval: "Monthly",
    selectedFeatures: {},
};

const useCreateSubscriptionPlanForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [values, setValues] = useState<SubscriptionPlanFormValues>(EMPTY_FORM);
    const [error, setError] = useState<string | null>(null);

    const { mutate: createPlan, isPending } = useCreateSubscriptionPlan();

    const open = () => {
        setValues(EMPTY_FORM);
        setError(null);
        setIsOpen(true);
    };

    const close = () => {
        if (isPending) {
            return;
        }

        setIsOpen(false);
    };

    const changeField = <K extends keyof SubscriptionPlanFormValues>(
        key: K,
        value: SubscriptionPlanFormValues[K]
    ) => {
        setValues((prev) => ({ ...prev, [key]: value }));

        if (error) {
            setError(null);
        }
    };

    // A feature only appears in selectedFeatures once checked ("" = unlimited);
    // unchecking removes its entry entirely rather than setting it to some
    // falsy placeholder, so Object.keys(selectedFeatures) is always the exact
    // checked set.
    const toggleFeature = (featureId: string) => {
        setValues((prev) => {
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
        setValues((prev) => ({
            ...prev,
            selectedFeatures: { ...prev.selectedFeatures, [featureId]: limit },
        }));

        if (error) {
            setError(null);
        }
    };

    const submit = () => {
        const features = Object.entries(values.selectedFeatures).map(([featureId, limit]) => ({
            featureId,
            limit: limit.trim() === "" ? null : Number(limit),
        }));

        const result = subscriptionPlanFormSchema.safeParse({ ...values, features });

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        createPlan(result.data, {
            onSuccess: () => {
                setValues(EMPTY_FORM);
                setIsOpen(false);
            },
        });
    };

    return {
        isOpen,
        values,
        error,
        isPending,

        open,
        close,
        changeField,
        toggleFeature,
        setFeatureLimit,
        submit,
    };
};

export default useCreateSubscriptionPlanForm;
