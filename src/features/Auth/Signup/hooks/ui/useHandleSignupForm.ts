import { useState } from "react";
import { createFieldUpdater } from "../../../../../utils/forms/createFieldUpdater";
import type { SignupFormDataType } from "../../types";
import { INITIAL_SIGNUP_FORM_DATA } from "../../config";

const useHandleSignupForm = () =>{

    const [ signupFormData , setSignupFormData ] = useState<SignupFormDataType>(INITIAL_SIGNUP_FORM_DATA);
    const [ errors , setErrors ] = useState<Partial<Record<keyof SignupFormDataType, string>>>({});

    const updateField = createFieldUpdater(setSignupFormData, setErrors);

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
        updateField(e.target.name as keyof SignupFormDataType , e.target.value);
    }

    return{
        signupFormData,
        errors,

        handleChange,
        setErrors,
    };
}

export default useHandleSignupForm;