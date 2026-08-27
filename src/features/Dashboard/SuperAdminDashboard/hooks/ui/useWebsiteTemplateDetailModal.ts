import { useState } from "react";
import useWebsiteTemplateDetail from "../data/useWebsiteTemplateDetail";
import useUpdateWebsiteTemplate from "../data/useUpdateWebsiteTemplate";
import useDeactivateWebsiteTemplate from "../data/useDeactivateWebsiteTemplate";
import { updateWebsiteTemplateFormSchema } from "../../validation";
import { uploadWebsiteTemplateImageService } from "../../../../../services/api/dashboard.api";
import { ApiError } from "../../../../../Error/ApiError";
import type { UpdateWebsiteTemplateFormValues, WebsiteTemplateDetail } from "../../types";

type Mode = "view" | "edit";

const toFormValues = (template: WebsiteTemplateDetail): UpdateWebsiteTemplateFormValues => ({
    label: template.label,
    previewImageUrl: template.previewImageUrl,
    previewWebsiteUrl: template.previewWebsiteUrl ?? "",
    displayOrder: String(template.displayOrder),
});

/**
 * Owns which template (if any) is open in the detail modal, its edit form, and
 * delete confirmation — all three states a single click on a table row can lead to.
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
    };
};

export default useWebsiteTemplateDetailModal;
