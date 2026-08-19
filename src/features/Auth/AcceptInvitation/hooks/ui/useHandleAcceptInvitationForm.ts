import { useState } from "react";
import { useSearchParams } from "react-router";
import { z } from "zod";
import type { AcceptInvitationFormDataType } from "../../types";
import { INITIAL_ACCEPT_INVITATION_FORM_DATA } from "../../constants";
import { createFieldUpdater } from "../../../../../utils/forms/createFieldUpdater";

const readInvitationEmail = (searchParams: URLSearchParams): string => {
    const rawEmail = searchParams.get("email");
    if (!rawEmail) return "";

    const parsed = z.string().trim().email().safeParse(rawEmail);
    return parsed.success ? parsed.data : "";
};

const useHandleAcceptInvitationForm = () => {
    const [searchParams] = useSearchParams();

    const [acceptInvitationFormData, setAcceptInvitationFormData] =
        useState<AcceptInvitationFormDataType>(() => ({
            ...INITIAL_ACCEPT_INVITATION_FORM_DATA,
            Email: readInvitationEmail(searchParams),
            InvitationToken: searchParams.get("token") ?? "",
        }));

    const [errors, setErrors] = useState<Partial<Record<keyof AcceptInvitationFormDataType, string>>>({});

    const updateField = createFieldUpdater(setAcceptInvitationFormData, setErrors);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateField(e.target.name as keyof AcceptInvitationFormDataType, e.target.value);
    };

    const isInvitationInvalid = acceptInvitationFormData.Email === "";

    return {
        acceptInvitationFormData,
        errors,
        isInvitationInvalid,

        handleChange,
        setErrors,
    };
};

export default useHandleAcceptInvitationForm;
