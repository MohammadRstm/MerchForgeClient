import { useState } from "react";
import type { ContactFormData, ContactFormErrors } from "../types";
import { SUBJECT_OPTIONS } from "../types";
import { validateContactForm } from "../validation";
import { submitContactEnquiry } from "../../../services/api/contact.api";
import type { AxiosError } from "axios";

const EMPTY_FORM: ContactFormData = {
    name: "",
    email: "",
    subjectOption: "",
    customSubject: "",
    message: "",
};

// The backend takes one free-text Subject string — the dropdown is a frontend
// convenience over that, so a chosen option is resolved to its label (or, for
// "Custom", to what the visitor typed) right before the request goes out.
const resolveSubject = (formData: ContactFormData): string => {
    if (formData.subjectOption === "custom") {
        return formData.customSubject.trim();
    }
    return SUBJECT_OPTIONS.find((option) => option.value === formData.subjectOption)?.label ?? "";
};

export const useContactForm = () => {
    const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);

    const [errors, setErrors] = useState<ContactFormErrors>({});
    const [serverError, setServerError] = useState<string>("");
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            // Switching away from "Custom" leaves a stale value behind that
            // would otherwise resurface if the visitor picks "Custom" again.
            ...(name === "subjectOption" && value !== "custom" ? { customSubject: "" } : {}),
        }));
        // Clear field error when user starts typing/selecting
        if (errors[name as keyof ContactFormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");
        setIsSuccess(false);

        // Validate
        const validationErrors = validateContactForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setIsPending(true);

        try {
            await submitContactEnquiry({
                Name: formData.name.trim(),
                Email: formData.email.trim(),
                Subject: resolveSubject(formData),
                Message: formData.message.trim(),
            });

            // Reset form and show success
            setFormData(EMPTY_FORM);
            setIsSuccess(true);
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            const message =
                axiosError?.response?.data?.message ||
                axiosError?.message ||
                "Failed to send your enquiry. Please try again.";
            setServerError(message);
        } finally {
            setIsPending(false);
        }
    };

    return {
        formData,
        errors,
        serverError,
        isPending,
        isSuccess,
        handleChange,
        submit,
    };
};
