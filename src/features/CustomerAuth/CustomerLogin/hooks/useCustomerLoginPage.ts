import { useEffect } from "react";
import { useSearchParams } from "react-router";
import validateForm from "../../../../utils/forms/validateForm";
import { customerLoginSchema } from "../../validation";
import useCustomerLogin from "./data/useCustomerLogin";
import useHandleCustomerLoginForm from "./ui/useHandleCustomerLoginForm";

const useCustomerLoginPage = () => {
    const [searchParams] = useSearchParams();
    const returnUrl = searchParams.get("returnUrl") ?? undefined;

    const {
        mutate: loginToServer,
        isPending: loginPending,
        error: loginError,
        data: loginResult,
    } = useCustomerLogin(returnUrl);

    const { loginFormData, errors, handleChange, setErrors } = useHandleCustomerLoginForm();

    // Login and signup both carry the same handoff: if a returnUrl was present, the
    // response comes back with a one-time exchange code and the browser is sent
    // straight back to the storefront that sent it here — never a token in the URL,
    // only the opaque code.
    useEffect(() => {
        if (loginResult?.exchangeCode && returnUrl) {
            window.location.href = `${returnUrl}?exchangeCode=${encodeURIComponent(loginResult.exchangeCode)}`;
        }
    }, [loginResult, returnUrl]);

    const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const hasValidationErrors = validateForm({
            schema: customerLoginSchema,
            formData: loginFormData,
            setErrors,
        });

        if (hasValidationErrors) return;

        loginToServer(loginFormData);
    };

    return {
        loginFormData,
        loginError,
        errors,
        loginPending,
        loginResult,
        returnUrl,

        submit,
        handleChange,
    };
};

export default useCustomerLoginPage;
