import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router";
import validateForm from "../../../../utils/forms/validateForm";
import { createFieldUpdater } from "../../../../utils/forms/createFieldUpdater";
import { acceptMemberInvitationSchema } from "../validation";
import type { AcceptMemberInvitationFormDataType } from "../types";
import useAcceptMemberInvitation from "./data/useAcceptMemberInvitation";

const useAcceptMemberInvitationPage = () => {
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState<AcceptMemberInvitationFormDataType>(() => ({
        InvitationToken: searchParams.get("token") ?? "",
        Password: "",
        ConfirmPassword: "",
        // Never pre-checked — the team member must actively opt in.
        AgreedToTerms: false,
    }));

    const [errors, setErrors] = useState<Partial<Record<keyof AcceptMemberInvitationFormDataType, string>>>({});

    const updateField = createFieldUpdater(setFormData, setErrors);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateField(e.target.name as keyof AcceptMemberInvitationFormDataType, e.target.value);
    };

    // A checkbox's meaningful value is `checked`, not `value` — handleChange above
    // reads `e.target.value` and can't be reused for it.
    const handleAgreedToTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateField("AgreedToTerms", e.target.checked);
    };

    const {
        mutate: submitInvitation,
        isPending: acceptInvitationPending,
        isError: acceptInvitationError,
        isSuccess: acceptInvitationSuccess,
    } = useAcceptMemberInvitation();

    const isInvitationInvalid = formData.InvitationToken === "";

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const hasValidationErrors = validateForm({
            schema: acceptMemberInvitationSchema,
            formData,
            setErrors,
        });

        if (hasValidationErrors) return;

        submitInvitation(formData);
    };

    return {
        formData,
        errors,
        isInvitationInvalid,
        acceptInvitationPending,
        acceptInvitationError,
        acceptInvitationSuccess,
        handleChange,
        handleAgreedToTermsChange,
        submit,
    };
};

export default useAcceptMemberInvitationPage;
