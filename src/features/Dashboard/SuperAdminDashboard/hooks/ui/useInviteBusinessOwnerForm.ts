import { useState } from "react";
import useInviteBusinessOwner from "../data/useInviteBusinessOwner";
import { inviteBusinessOwnerFormSchema } from "../../validation";

const useInviteBusinessOwnerForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { mutate: sendInvitation, isPending } = useInviteBusinessOwner();

    const open = () => {
        setEmail("");
        setError(null);
        setIsOpen(true);
    };

    // Ignored while the request is in flight, so the modal cannot be dismissed out
    // from under an invitation that is already being created.
    const close = () => {
        if (isPending) {
            return;
        }

        setIsOpen(false);
    };

    const changeEmail = (value: string) => {
        setEmail(value);

        if (error) {
            setError(null);
        }
    };

    const submit = () => {
        const result = inviteBusinessOwnerFormSchema.safeParse({ email });

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        sendInvitation(result.data.email, {
            onSuccess: () => {
                setEmail("");
                setIsOpen(false);
            },
        });
    };

    return {
        isOpen,
        email,
        error,
        isPending,

        open,
        close,
        changeEmail,
        submit,
    };
};

export default useInviteBusinessOwnerForm;
