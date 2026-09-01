import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomerService } from "../../../../../services/api/dashboard.api";
import { notify } from "../../../../../services/toast";
import { ApiError } from "../../../../../Error/ApiError";
import type { UpdateCustomerPayload } from "../../types";

const useUpdateCustomer = (customerId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateCustomerPayload) => updateCustomerService(customerId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dashboard", "customers"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard", "customer-detail", customerId] });
            notify.success("Customer profile updated.");
        },
        onError: (error) => {
            notify.error(error instanceof ApiError ? error.message : "Failed to update customer profile.");
        },
    });
};

export default useUpdateCustomer;
