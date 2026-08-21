import { useState } from "react";
import useCreateWebsiteTemplate from "../data/useCreateWebsiteTemplate";
import { createWebsiteTemplateFormSchema } from "../../validation";
import type { CreateWebsiteTemplateFormValues } from "../../types";

const EMPTY_FORM: CreateWebsiteTemplateFormValues = {
    businessDomainId: "",
    name: "",
    label: "",
    videoPreviewUrl: "",
    displayOrder: "0",
};

const useCreateWebsiteTemplateForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [values, setValues] = useState<CreateWebsiteTemplateFormValues>(EMPTY_FORM);
    const [error, setError] = useState<string | null>(null);

    const { mutate: createTemplate, isPending } = useCreateWebsiteTemplate();

    const open = () => {
        setValues(EMPTY_FORM);
        setError(null);
        setIsOpen(true);
    };

    // Ignored while the request is in flight, so the modal cannot be dismissed out
    // from under a template that is already being created.
    const close = () => {
        if (isPending) {
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

        open,
        close,
        changeField,
        submit,
    };
};

export default useCreateWebsiteTemplateForm;
