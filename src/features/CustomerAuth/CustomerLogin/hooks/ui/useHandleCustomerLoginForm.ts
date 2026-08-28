import { useState } from "react";
import type { CustomerLoginFormDataType } from "../../../types";
import { INITIAL_CUSTOMER_LOGIN_FORM_DATA } from "../../constants";
import { createFieldUpdater } from "../../../../../utils/forms/createFieldUpdater";

const useHandleCustomerLoginForm = () => {
    const [loginFormData, setLoginFormData] = useState<CustomerLoginFormDataType>(INITIAL_CUSTOMER_LOGIN_FORM_DATA);
    const [errors, setErrors] = useState<Partial<Record<keyof CustomerLoginFormDataType, string>>>({});

    const updateField = createFieldUpdater(setLoginFormData, setErrors);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateField(e.target.name as keyof CustomerLoginFormDataType, e.target.value);
    };

    return {
        loginFormData,
        errors,

        handleChange,
        setErrors,
    };
};

export default useHandleCustomerLoginForm;
