import { useMutation } from "@tanstack/react-query";
import { customerSignupService } from "../../../../../services/api/customerAuth.api";

const useCustomerSignup = (returnUrl?: string) => {
    return useMutation({
        mutationFn: (formData: Parameters<typeof customerSignupService>[0]) =>
            customerSignupService(formData, returnUrl),
    });
};

export default useCustomerSignup;
