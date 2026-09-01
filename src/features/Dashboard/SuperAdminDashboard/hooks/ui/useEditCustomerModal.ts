import { useState } from "react";
import useUpdateCustomer from "../data/useUpdateCustomer";
import { updateCustomerFormSchema } from "../../validation";
import type { DashboardCustomerDetailResponse, UpdateCustomerFormValues } from "../../types";

const useEditCustomerModal = (customer: DashboardCustomerDetailResponse | undefined) => {
    const [isOpen, setIsOpen] = useState(false);
    const [values, setValues] = useState<UpdateCustomerFormValues>({ firstName: "", lastName: "", phone: "" });
    const [error, setError] = useState<string | null>(null);

    const { mutate: updateCustomer, isPending } = useUpdateCustomer(customer?.id ?? "");

    const open = () => {
        if (!customer) return;

        setValues({ firstName: customer.firstName, lastName: customer.lastName, phone: customer.phone ?? "" });
        setError(null);
        setIsOpen(true);
    };

    const close = () => {
        if (isPending) return;
        setIsOpen(false);
    };

    const changeField = <K extends keyof UpdateCustomerFormValues>(key: K, value: UpdateCustomerFormValues[K]) => {
        setValues((prev) => ({ ...prev, [key]: value }));
        if (error) setError(null);
    };

    const submit = () => {
        const result = updateCustomerFormSchema.safeParse(values);

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        updateCustomer(result.data, { onSuccess: () => setIsOpen(false) });
    };

    return { isOpen, values, error, isPending, open, close, changeField, submit };
};

export default useEditCustomerModal;
