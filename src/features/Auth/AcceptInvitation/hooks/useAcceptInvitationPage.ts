import type { FormEvent } from "react";
import validateForm from "../../../../utils/forms/validateForm";
import { acceptInvitationSchema } from "../validation";
import useAcceptInvitation from "./data/useAcceptInvitation";
import useHandleAcceptInvitationForm from "./ui/useHandleAcceptInvitationForm";

const useAcceptInvitationPage = () => {

    const {
        mutate: submitInvitation,
        isPending: acceptInvitationPending,
        isError: acceptInvitationError,
        isSuccess: acceptInvitationSuccess,
    } = useAcceptInvitation();

    const {
        acceptInvitationFormData,
        errors,
        isInvitationInvalid,

        handleChange,
        setErrors,
    } = useHandleAcceptInvitationForm();

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const hasValidationErrors = validateForm({
            schema: acceptInvitationSchema,
            formData: acceptInvitationFormData,
            setErrors,
        });

        if (hasValidationErrors) return;

        submitInvitation(acceptInvitationFormData);
    };

    return {
        acceptInvitationFormData,
        errors,
        isInvitationInvalid,
        acceptInvitationPending,
        acceptInvitationError,
        acceptInvitationSuccess,

        submit,
        handleChange,
    };
};

export default useAcceptInvitationPage;
