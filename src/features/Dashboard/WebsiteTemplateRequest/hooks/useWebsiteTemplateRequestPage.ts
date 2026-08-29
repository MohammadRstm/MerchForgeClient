import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../../../context/Auth/useAuth";
import { routes } from "../../../../config/routes";
import { ApiError } from "../../../../Error/ApiError";
import useWebsiteTemplateOptions from "../../BusinessOwnerDashboard/hooks/data/useWebsiteTemplateOptions";
import useBusinessSubscription from "../../BusinessOwnerDashboard/hooks/data/useBusinessSubscription";
import useCreateWebsiteTemplateRequest from "./data/useCreateWebsiteTemplateRequest";
import type { WebsiteTemplateOption } from "../../BusinessOwnerDashboard/types";

type Step = "select" | "customize";

/**
 * Drives the whole select-template -> customize -> submit flow as one page. The
 * Business ID never leaves this hook's closure -- it comes from the auth session
 * once, at the top, and every request it issues is scoped by it.
 */
const useWebsiteTemplateRequestPage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";

    const [step, setStep] = useState<Step>("select");
    const [selectedTemplate, setSelectedTemplate] = useState<WebsiteTemplateOption | null>(null);
    const [customizationNotes, setCustomizationNotes] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { data: options, isLoading: optionsLoading, isError } = useWebsiteTemplateOptions(businessId);
    const { mutate, isPending, isSuccess } = useCreateWebsiteTemplateRequest(businessId);

    const navigate = useNavigate();

    // A business with no plan at all can't have a website - block starting a
    // request here rather than only hiding the entry-point button on
    // OwnerWebsitePage.tsx, since this route is otherwise reachable directly.
    const { data: subscription, isLoading: subscriptionLoading } = useBusinessSubscription(businessId);
    const hasActiveSubscription = subscription?.status === "Active";

    useEffect(() => {
        if (!subscriptionLoading && !hasActiveSubscription) {
            navigate(routes.DASHBOARD_BILLING, { replace: true });
        }
    }, [subscriptionLoading, hasActiveSubscription, navigate]);

    const isLoading = optionsLoading || subscriptionLoading || !hasActiveSubscription;

    const selectTemplate = (template: WebsiteTemplateOption) => {
        setSelectedTemplate(template);
        setError(null);
        setStep("customize");
    };

    const backToSelection = () => {
        setStep("select");
        setError(null);
    };

    const submit = () => {
        if (!selectedTemplate) {
            setError("Pick a template first.");
            return;
        }

        if (!customizationNotes.trim()) {
            setError("Tell us what you'd like to change.");
            return;
        }

        mutate(
            { websiteTemplateId: selectedTemplate.id, customizationNotes: customizationNotes.trim() },
            {
                onError: (err) => {
                    setError(err instanceof ApiError ? err.message : "Couldn't submit your request. Please try again.");
                },
            }
        );
    };

    const backToDashboard = () => navigate(routes.DASHBOARD_WEBSITE);

    return {
        options,
        isLoading,
        isError,

        step,
        selectedTemplate,
        customizationNotes,
        setCustomizationNotes,
        error,
        isPending,
        isSuccess,

        selectTemplate,
        backToSelection,
        submit,
        backToDashboard,
    };
};

export default useWebsiteTemplateRequestPage;
