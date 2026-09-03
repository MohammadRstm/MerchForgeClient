import { useMemo } from "react";
import useAuth from "../../../../context/Auth/useAuth";
import { ApiError } from "../../../../Error/ApiError";
import { FEATURE_KEY_WEBSITE_CUSTOMIZATION_ADVANCED } from "../constants/featureKeys";
import useBusinessDashboardStats from "./data/useBusinessDashboardStats";
import useHasPlanFeature from "./data/useHasPlanFeature";
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

    const { hasFeature: hasAdvancedCustomization } = useHasPlanFeature(
        businessId,
        FEATURE_KEY_WEBSITE_CUSTOMIZATION_ADVANCED
    );

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

    // Kept referentially stable: useWebsiteCustomizationFormState re-syncs its values
    // whenever this identity changes, so a fresh `?? []` each render would loop that
    // render-phase update forever while the catalogue is still loading.
    const fields = useMemo(() => catalogue ?? [], [catalogue]);
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
    } = usePublishWebsiteCustomization(businessId);

    const {
        mutate: regeneratePreviewToken,
        isPending: isRegeneratingPreviewToken,
    } = useRegenerateWebsiteCustomizationPreviewToken(businessId);

    const save = () => {
        resetSaveError();
        saveDraft(form.toPayload());
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
        hasAdvancedCustomization,

        catalogue: fields,
        catalogueLoading,
        catalogueError,

        draft,
        draftLoading,
        draftError,

        form,

        isSaving,
        saveError: toErrorMessage(saveErrorRaw, "Couldn't save your changes. Please try again."),
        save,

        isPublishing,
        publishError: toErrorMessage(publishErrorRaw, "Couldn't publish your changes. Please try again."),
        publishChanges,

        isRegeneratingPreviewToken,
        regeneratePreviewToken,
    };
};

export default useOwnerWebsiteCustomizationPage;
