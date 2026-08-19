import { useState } from "react";
import { useSearchParams } from "react-router";
import { z } from "zod";
import type { AcceptInvitationFormDataType, DomainCategory } from "../../types";
import { INITIAL_ACCEPT_INVITATION_FORM_DATA } from "../../constants";
import { createFieldUpdater } from "../../../../../utils/forms/createFieldUpdater";

const readInvitationEmail = (searchParams: URLSearchParams): string => {
    const rawEmail = searchParams.get("email");
    if (!rawEmail) return "";

    const parsed = z.string().trim().email().safeParse(rawEmail);
    return parsed.success ? parsed.data : "";
};

/** Mirrors the backend's Slug.From, so duplicate checks agree with the server. */
const toSlug = (value: string): string =>
    value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const useHandleAcceptInvitationForm = (existingCategories: DomainCategory[]) => {
    const [searchParams] = useSearchParams();

    const [acceptInvitationFormData, setAcceptInvitationFormData] =
        useState<AcceptInvitationFormDataType>(() => ({
            ...INITIAL_ACCEPT_INVITATION_FORM_DATA,
            Email: readInvitationEmail(searchParams),
            InvitationToken: searchParams.get("token") ?? "",
        }));

    const [errors, setErrors] = useState<Partial<Record<keyof AcceptInvitationFormDataType, string>>>({});

    const [newCategoryInput, setNewCategoryInput] = useState("");
    const [newCategoryError, setNewCategoryError] = useState<string | undefined>(undefined);

    const updateField = createFieldUpdater(setAcceptInvitationFormData, setErrors);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateField(e.target.name as keyof AcceptInvitationFormDataType, e.target.value);
    };

    const handleDomainChange = (domainId: string) => {
        // Custom categories are proposed against a specific domain's existing list,
        // so they stop being meaningful the moment the domain changes — keeping them
        // could submit a "Pizza" category the owner only wanted under Restaurant.
        setAcceptInvitationFormData((prev) => ({
            ...prev,
            BusinessDomainId: domainId,
            NewCategoryNames: [],
        }));
        setErrors((prev) => ({ ...prev, BusinessDomainId: undefined }));
        setNewCategoryInput("");
        setNewCategoryError(undefined);
    };

    const addNewCategory = () => {
        const name = newCategoryInput.trim();

        if (!name) return;

        if (name.length > 100) {
            setNewCategoryError("Keep category names under 100 characters.");
            return;
        }

        const slug = toSlug(name);

        if (!slug) {
            setNewCategoryError("Use at least one letter or number.");
            return;
        }

        // Checked here as well as server-side so the owner gets an immediate answer
        // instead of a failed submission at the end of the form.
        if (existingCategories.some((category) => category.slug === slug)) {
            setNewCategoryError(`"${name}" already exists — select it above instead.`);
            return;
        }

        if (acceptInvitationFormData.NewCategoryNames.some((existing) => toSlug(existing) === slug)) {
            setNewCategoryError(`You've already added "${name}".`);
            return;
        }

        setAcceptInvitationFormData((prev) => ({
            ...prev,
            NewCategoryNames: [...prev.NewCategoryNames, name],
        }));
        setErrors((prev) => ({ ...prev, NewCategoryNames: undefined }));
        setNewCategoryInput("");
        setNewCategoryError(undefined);
    };

    const removeNewCategory = (name: string) => {
        setAcceptInvitationFormData((prev) => ({
            ...prev,
            NewCategoryNames: prev.NewCategoryNames.filter((existing) => existing !== name),
        }));
    };

    const handleNewCategoryInputChange = (value: string) => {
        setNewCategoryInput(value);
        setNewCategoryError(undefined);
    };

    const isInvitationInvalid = acceptInvitationFormData.Email === "";

    return {
        acceptInvitationFormData,
        errors,
        isInvitationInvalid,
        newCategoryInput,
        newCategoryError,

        handleChange,
        handleDomainChange,
        addNewCategory,
        removeNewCategory,
        handleNewCategoryInputChange,
        setErrors,
    };
};

export default useHandleAcceptInvitationForm;
