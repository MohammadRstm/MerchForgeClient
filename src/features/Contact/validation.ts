import type { ContactFormData, ContactFormErrors } from "./types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateContactForm = (data: ContactFormData): ContactFormErrors => {
    const errors: ContactFormErrors = {};

    // Name validation
    if (!data.name?.trim()) {
        errors.name = "Name is required";
    } else if (data.name.length > 120) {
        errors.name = "Name must be 120 characters or less";
    }

    // Email validation
    if (!data.email?.trim()) {
        errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(data.email)) {
        errors.email = "Please enter a valid email address";
    } else if (data.email.length > 254) {
        errors.email = "Email must be 254 characters or less";
    }

    // Subject validation
    if (!data.subject?.trim()) {
        errors.subject = "Subject is required";
    } else if (data.subject.length > 150) {
        errors.subject = "Subject must be 150 characters or less";
    }

    // Message validation
    if (!data.message?.trim()) {
        errors.message = "Message is required";
    } else if (data.message.length < 20) {
        errors.message = "Message must be at least 20 characters";
    } else if (data.message.length > 4000) {
        errors.message = "Message must be 4000 characters or less";
    }

    return errors;
};
