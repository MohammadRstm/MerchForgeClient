import { useMutation } from "@tanstack/react-query";
import { customerLoginService } from "../../../../../services/api/customerAuth.api";

const useCustomerLogin = (returnUrl?: string) => {
    return useMutation({
        mutationFn: (formData: Parameters<typeof customerLoginService>[0]) =>
            customerLoginService(formData, returnUrl),
    });
};

export default useCustomerLogin;
