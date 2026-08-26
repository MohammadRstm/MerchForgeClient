import { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../../../context/Auth/useAuth";
import { routes } from "../../../../config/routes";
import { ApiError } from "../../../../Error/ApiError";
import useWebsiteTemplateOptions from "../../BusinessOwnerDashboard/hooks/data/useWebsiteTemplateOptions";
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

    const { data: options, isLoading, isError } = useWebsiteTemplateOptions(businessId);
    const { mutate, isPending, isSuccess } = useCreateWebsiteTemplateRequest(businessId);

    const navigate = useNavigate();

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

    const backToDashboard = () => navigate(routes.DASHBOARD);

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
