import { useEffect } from "react";
import { useSearchParams } from "react-router";
import validateForm from "../../../../utils/forms/validateForm";
import { customerSignupSchema } from "../../validation";
import useCustomerSignup from "./data/useCustomerSignup";
import useHandleCustomerSignupForm from "./ui/useHandleCustomerSignupForm";

const useCustomerSignupPage = () => {
    const [searchParams] = useSearchParams();
    const returnUrl = searchParams.get("returnUrl") ?? undefined;

    const {
        mutate: signupToServer,
        isPending: signupPending,
        error: signupError,
        data: signupResult,
    } = useCustomerSignup(returnUrl);

    const { signupFormData, errors, handleChange, setErrors } = useHandleCustomerSignupForm();

    useEffect(() => {
        if (signupResult?.exchangeCode && returnUrl) {
            window.location.href = `${returnUrl}?exchangeCode=${encodeURIComponent(signupResult.exchangeCode)}`;
        }
    }, [signupResult, returnUrl]);

    const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const hasValidationErrors = validateForm({
            schema: customerSignupSchema,
            formData: signupFormData,
            setErrors,
        });

        if (hasValidationErrors) return;

        signupToServer(signupFormData);
    };

    return {
        signupFormData,
        signupError,
        errors,
        signupPending,
        signupResult,
        returnUrl,

        submit,
        handleChange,
    };
};

export default useCustomerSignupPage;
