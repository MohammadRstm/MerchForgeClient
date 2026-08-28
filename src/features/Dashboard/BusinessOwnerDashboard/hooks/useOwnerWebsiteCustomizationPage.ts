import { useState } from "react";
import useAuth from "../../../../context/Auth/useAuth";
import { ApiError } from "../../../../Error/ApiError";
import useBusinessDashboardStats from "./data/useBusinessDashboardStats";
import useWebsiteCustomizationCatalogue from "./data/useWebsiteCustomizationCatalogue";
import useWebsiteCustomizationDraft from "./data/useWebsiteCustomizationDraft";
import useSaveWebsiteCustomizationDraft from "./data/useSaveWebsiteCustomizationDraft";
import usePublishWebsiteCustomization from "./data/usePublishWebsiteCustomization";
import useRegenerateWebsiteCustomizationPreviewToken from "./data/useRegenerateWebsiteCustomizationPreviewToken";
import useWebsiteCustomizationFormState from "./ui/useWebsiteCustomizationFormState";

const toErrorMessage = (error: unknown, fallback: string) =>
    error instanceof ApiError ? error.message : error ? fallback : undefined;

const useOwnerWebsiteCustomizationPage = () => {
    const { session } = useAuth();
    const businessId = session?.business?.id ?? "";

    const { data: stats } = useBusinessDashboardStats(businessId);

    const {
        data: catalogue,
        isLoading: catalogueLoading,
        isError: catalogueError,
    } = useWebsiteCustomizationCatalogue(businessId);

    const {
        data: draft,
        isLoading: draftLoading,
        isError: draftError,
    } = useWebsiteCustomizationDraft(businessId);

    const fields = catalogue ?? [];
    const form = useWebsiteCustomizationFormState(draft, fields);

    const {
        mutate: saveDraft,
        isPending: isSaving,
        error: saveErrorRaw,
        reset: resetSaveError,
    } = useSaveWebsiteCustomizationDraft(businessId);

    const {
        mutate: publish,
        isPending: isPublishing,
        error: publishErrorRaw,
        reset: resetPublishError,
        data: publishResult,
    } = usePublishWebsiteCustomization(businessId);

    const {
        mutate: regeneratePreviewToken,
        isPending: isRegeneratingPreviewToken,
    } = useRegenerateWebsiteCustomizationPreviewToken(businessId);

    const [saveSucceededAt, setSaveSucceededAt] = useState<number | null>(null);

    const save = () => {
        resetSaveError();
        setSaveSucceededAt(null);
        saveDraft(form.toPayload(), { onSuccess: () => setSaveSucceededAt(Date.now()) });
    };

    const publishChanges = () => {
        resetPublishError();
        publish();
    };

    const websiteUrl = stats?.websiteUrl ?? null;
    const previewUrl =
        websiteUrl && draft
            ? `${websiteUrl}${websiteUrl.includes("?") ? "&" : "?"}merchforge_preview=${draft.previewToken}`
            : null;

    return {
        businessId,
        websiteUrl,
        previewUrl,

        catalogue: fields,
        catalogueLoading,
        catalogueError,

        draft,
        draftLoading,
        draftError,

        form,

        isSaving,
        saveError: toErrorMessage(saveErrorRaw, "Couldn't save your changes. Please try again."),
        saveSucceeded: saveSucceededAt !== null,
        save,

        isPublishing,
        publishError: toErrorMessage(publishErrorRaw, "Couldn't publish your changes. Please try again."),
        publishResult,
        publishChanges,

        isRegeneratingPreviewToken,
        regeneratePreviewToken,
    };
};

export default useOwnerWebsiteCustomizationPage;
