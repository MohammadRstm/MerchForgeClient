import { useState } from "react";
import type { CustomerSignupFormDataType } from "../../../types";
import { INITIAL_CUSTOMER_SIGNUP_FORM_DATA } from "../../constants";
import { createFieldUpdater } from "../../../../../utils/forms/createFieldUpdater";

const useHandleCustomerSignupForm = () => {
    const [signupFormData, setSignupFormData] = useState<CustomerSignupFormDataType>(INITIAL_CUSTOMER_SIGNUP_FORM_DATA);
    const [errors, setErrors] = useState<Partial<Record<keyof CustomerSignupFormDataType, string>>>({});

    const updateField = createFieldUpdater(setSignupFormData, setErrors);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateField(e.target.name as keyof CustomerSignupFormDataType, e.target.value);
    };

    return {
        signupFormData,
        errors,

        handleChange,
        setErrors,
    };
};

export default useHandleCustomerSignupForm;
