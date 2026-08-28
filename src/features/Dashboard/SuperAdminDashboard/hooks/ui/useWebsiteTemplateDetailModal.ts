import { useState } from "react";
import useWebsiteTemplateDetail from "../data/useWebsiteTemplateDetail";
import useUpdateWebsiteTemplate from "../data/useUpdateWebsiteTemplate";
import useDeactivateWebsiteTemplate from "../data/useDeactivateWebsiteTemplate";
import useWebsiteTemplateCustomizableComponents from "../data/useWebsiteTemplateCustomizableComponents";
import useCreateWebsiteTemplateCustomizableComponent from "../data/useCreateWebsiteTemplateCustomizableComponent";
import useSetWebsiteTemplateCustomizableComponentActive from "../data/useSetWebsiteTemplateCustomizableComponentActive";
import { updateWebsiteTemplateFormSchema } from "../../validation";
import { uploadWebsiteTemplateImageService } from "../../../../../services/api/dashboard.api";
import { ApiError } from "../../../../../Error/ApiError";
import { WEBSITE_CUSTOMIZABLE_FIELD_CATALOGUE, type WebsiteCustomizableFieldCatalogueEntry } from "../../websiteCustomizableFieldCatalogue";
import type { UpdateWebsiteTemplateFormValues, WebsiteTemplateDetail } from "../../types";

type Mode = "view" | "edit";

const toFormValues = (template: WebsiteTemplateDetail): UpdateWebsiteTemplateFormValues => ({
    label: template.label,
    previewImageUrl: template.previewImageUrl,
    previewWebsiteUrl: template.previewWebsiteUrl ?? "",
    displayOrder: String(template.displayOrder),
});

/**
 * Owns which template (if any) is open in the detail modal, its edit form, delete
 * confirmation, and its customizable-fields catalogue — the SuperAdmin's actual
 * "what's editable in this template" decision, previously only reachable via the
 * backend API directly. Fields are toggled on/off against the fixed
 * WEBSITE_CUSTOMIZABLE_FIELD_CATALOGUE vocabulary (see that file) rather than typed
 * by hand — key/label/valueType always come from the catalogue entry, never from
 * admin input.
 */
const useWebsiteTemplateDetailModal = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [mode, setMode] = useState<Mode>("view");
    const [values, setValues] = useState<UpdateWebsiteTemplateFormValues | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const { data: template, isLoading, isError } = useWebsiteTemplateDetail(selectedId);
    const { mutate: updateTemplate, isPending: isUpdating } = useUpdateWebsiteTemplate(selectedId ?? "");
    const { mutate: deactivateTemplate, isPending: isDeleting } = useDeactivateWebsiteTemplate(selectedId ?? "");

    const {
        data: components,
        isLoading: componentsLoading,
        isError: componentsError,
    } = useWebsiteTemplateCustomizableComponents(selectedId);
    const { mutate: createComponent, isPending: isCreatingComponent } = useCreateWebsiteTemplateCustomizableComponent();
    const { mutate: setComponentActive, isPending: isTogglingComponentActive } =
        useSetWebsiteTemplateCustomizableComponentActive();

    const open = (templateId: string) => {
        setSelectedId(templateId);
        setMode("view");
        setValues(null);
        setError(null);
        setConfirmingDelete(false);
    };

    const close = () => {
        if (isUpdating || isDeleting || imageUploading) {
            return;
        }

        setSelectedId(null);
    };

    const startEdit = () => {
        if (!template) return;

        setValues(toFormValues(template));
        setError(null);
        setMode("edit");
    };

    const cancelEdit = () => {
        setMode("view");
        setValues(null);
        setError(null);
    };

    const changeField = <K extends keyof UpdateWebsiteTemplateFormValues>(
        key: K,
        value: UpdateWebsiteTemplateFormValues[K]
    ) => {
        setValues((prev) => (prev ? { ...prev, [key]: value } : prev));

        if (error) {
            setError(null);
        }
    };

    const uploadImage = async (file: File) => {
        setImageUploading(true);
        setError(null);

        try {
            const { imageUrl } = await uploadWebsiteTemplateImageService(file);
            changeField("previewImageUrl", imageUrl);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Couldn't upload that image.");
        } finally {
            setImageUploading(false);
        }
    };

    const submitEdit = () => {
        if (!values) return;

        const result = updateWebsiteTemplateFormSchema.safeParse(values);

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        updateTemplate(result.data, {
            onSuccess: () => {
                setMode("view");
                setValues(null);
            },
        });
    };

    const requestDelete = () => setConfirmingDelete(true);
    const cancelDelete = () => setConfirmingDelete(false);

    const confirmDelete = () => {
        deactivateTemplate(undefined, {
            onSuccess: () => {
                setConfirmingDelete(false);
                setSelectedId(null);
            },
        });
    };

    // ---- customizable fields (catalogue-driven checkboxes) ----

    /** displayOrder mirrors the catalogue's own order, so the owner form's field order stays predictable regardless of the order an admin happened to check boxes in. */
    const catalogueIndex = new Map(WEBSITE_CUSTOMIZABLE_FIELD_CATALOGUE.map((entry, index) => [entry.key, index]));

    const toggleCatalogueField = (entry: WebsiteCustomizableFieldCatalogueEntry) => {
        if (!selectedId) return;

        const existing = components?.find((component) => component.key === entry.key);

        if (!existing) {
            createComponent({
                websiteTemplateId: selectedId,
                payload: {
                    key: entry.key,
                    label: entry.label,
                    valueType: entry.valueType,
                    isRequired: false,
                    allowedValues: [],
                    helpText: entry.helpText ?? entry.description,
                    displayOrder: catalogueIndex.get(entry.key) ?? 0,
                },
            });
            return;
        }

        setComponentActive({ websiteTemplateId: selectedId, id: existing.id, isActive: !existing.isActive });
    };

    const isFieldActive = (key: string) => components?.some((c) => c.key === key && c.isActive) ?? false;

    return {
        isOpen: !!selectedId,
        template,
        isLoading,
        isError,

        mode,
        values,
        error,
        isUpdating,
        imageUploading,

        confirmingDelete,
        isDeleting,

        open,
        close,
        startEdit,
        cancelEdit,
        changeField,
        uploadImage,
        submitEdit,
        requestDelete,
        cancelDelete,
        confirmDelete,

        componentsLoading,
        componentsError,
        isFieldActive,
        toggleCatalogueField,
        isTogglingCatalogueField: isCreatingComponent || isTogglingComponentActive,
    };
};

export default useWebsiteTemplateDetailModal;
