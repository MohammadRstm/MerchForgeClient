import validateForm from "../../../../utils/forms/validateForm";
import { signupSchema } from "../validation";
import useRegister from "./data/useRegister";
import useHandleSignupForm from "./ui/useHandleSignupForm";


const useSignupPage = () =>{

    const {
        mutate: registerInServer,
        isPending: loadingRegistration,
        error: registrationServerError
    } = useRegister();

    const {
        signupFormData,
        errors,

        handleChange,
        setErrors
    } = useHandleSignupForm();
    

    const submit = (e: React.SubmitEvent<HTMLFormElement>) =>{
        e.preventDefault();

        // Zod validation layer
        const hasValidationErrors = validateForm({
        schema: signupSchema,
        formData: signupFormData,
        setErrors 
        });

        if(hasValidationErrors){
            return;
        }
    
        // registers user in server and if successful saves user in session
        registerInServer(
            signupFormData
        );
    }

    return {
        signupFormData,
        registrationServerError,
        errors,
        loadingRegistration,

        submit,
        handleChange,
    };
}

export default useSignupPage;