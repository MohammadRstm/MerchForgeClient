import { useState } from "react";
import type { ContactFormData, ContactFormErrors } from "../types";
import { validateContactForm } from "../validation";
import { submitContactEnquiry } from "../../../services/api/contact.api";
import type { AxiosError } from "axios";

export const useContactForm = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState<ContactFormErrors>({});
    const [serverError, setServerError] = useState<string>("");
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear field error when user starts typing
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
                Subject: formData.subject.trim(),
                Message: formData.message.trim(),
            });

            // Reset form and show success
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
            });
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
