import { useState } from "react";
import useCreateWebsiteTemplate from "../data/useCreateWebsiteTemplate";
import { createWebsiteTemplateFormSchema } from "../../validation";
import { uploadWebsiteTemplateVideoService } from "../../../../../services/api/dashboard.api";
import { ApiError } from "../../../../../Error/ApiError";
import type { CreateWebsiteTemplateFormValues } from "../../types";

const EMPTY_FORM: CreateWebsiteTemplateFormValues = {
    businessDomainId: "",
    name: "",
    label: "",
    videoPreviewUrl: "",
    previewWebsiteUrl: "",
    displayOrder: "0",
};

const useCreateWebsiteTemplateForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [values, setValues] = useState<CreateWebsiteTemplateFormValues>(EMPTY_FORM);
    const [error, setError] = useState<string | null>(null);
    const [videoUploading, setVideoUploading] = useState(false);

    const { mutate: createTemplate, isPending } = useCreateWebsiteTemplate();

    const open = () => {
        setValues(EMPTY_FORM);
        setError(null);
        setIsOpen(true);
    };

    // Ignored while the request is in flight, so the modal cannot be dismissed out
    // from under a template that is already being created.
    const close = () => {
        if (isPending || videoUploading) {
            return;
        }

        setIsOpen(false);
    };

    const changeField = <K extends keyof CreateWebsiteTemplateFormValues>(
        key: K,
        value: CreateWebsiteTemplateFormValues[K]
    ) => {
        setValues((prev) => ({ ...prev, [key]: value }));

        if (error) {
            setError(null);
        }
    };

    const uploadVideo = async (file: File) => {
        setVideoUploading(true);
        setError(null);

        try {
            const { videoUrl } = await uploadWebsiteTemplateVideoService(file);
            changeField("videoPreviewUrl", videoUrl);
        } catch (err) {
            // The server's message is specific and actionable ("Videos must be 200
            // MB or smaller", "isn't a valid video of the type it claims to be"), so
            // it's shown rather than replaced with a generic failure.
            setError(err instanceof ApiError ? err.message : "Couldn't upload that video.");
        } finally {
            setVideoUploading(false);
        }
    };

    const submit = () => {
        const result = createWebsiteTemplateFormSchema.safeParse(values);

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        createTemplate(result.data, {
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
        videoUploading,

        open,
        close,
        changeField,
        uploadVideo,
        submit,
    };
};

export default useCreateWebsiteTemplateForm;
