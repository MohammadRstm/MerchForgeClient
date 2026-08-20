import { useState } from "react";
import useCreateBusinessMember from "../data/useCreateBusinessMember";
import { createBusinessMemberFormSchema } from "../../validation";
import { ApiError } from "../../../../../Error/ApiError";
import type { AssignableBusinessRole, CreateBusinessMemberResponse } from "../../types";

const EMPTY_VALUES = { firstName: "", lastName: "", email: "" };

/**
 * The add-admin and add-member flows are the same form with a different role, so one
 * modal serves both and the role is fixed by whichever button opened it. That keeps
 * the owner from picking "Member" in a dialog they opened by clicking "Add admin".
 */
const useMemberModal = (businessId: string) => {
    const [isOpen, setIsOpen] = useState(false);
    const [role, setRole] = useState<AssignableBusinessRole>("Member");
    const [values, setValues] = useState(EMPTY_VALUES);
    const [errors, setErrors] = useState<Record<string, string>>({});

    /**
     * The created member, held after the form closes so the generated password can
     * be shown. It is returned once and never retrievable again, so it gets its own
     * panel the owner has to dismiss rather than a toast that times out.
     */
    const [created, setCreated] = useState<CreateBusinessMemberResponse | null>(null);

    const { mutate, isPending } = useCreateBusinessMember(businessId);

    const open = (nextRole: AssignableBusinessRole) => {
        setRole(nextRole);
        setValues(EMPTY_VALUES);
        setErrors({});
        setIsOpen(true);
    };

    const close = () => {
        if (isPending) {
            return;
        }

        setIsOpen(false);
    };

    const change = (field: keyof typeof EMPTY_VALUES, value: string) => {
        setValues((current) => ({ ...current, [field]: value }));

        if (errors[field]) {
            setErrors((current) => {
                const next = { ...current };
                delete next[field];
                return next;
            });
        }
    };

    const dismissCreated = () => setCreated(null);

    const submit = () => {
        const result = createBusinessMemberFormSchema.safeParse({ ...values, role });

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};

            for (const issue of result.error.issues) {
                const field = issue.path[0];

                if (typeof field === "string" && !fieldErrors[field]) {
                    fieldErrors[field] = issue.message;
                }
            }

            setErrors(fieldErrors);
            return;
        }

        mutate(result.data, {
            onSuccess: (member) => {
                setIsOpen(false);
                setValues(EMPTY_VALUES);
                setCreated(member);
            },
            onError: (error) => {
                // Shown against the email field rather than as a toast: a duplicate
                // address is the one failure the owner fixes by editing the form.
                setErrors({
                    email:
                        error instanceof ApiError
                            ? error.message
                            : "Could not add this person. Please try again.",
                });
            },
        });
    };

    return {
        isOpen,
        role,
        values,
        errors,
        isPending,
        created,

        open,
        close,
        change,
        submit,
        dismissCreated,
    };
};

export default useMemberModal;
