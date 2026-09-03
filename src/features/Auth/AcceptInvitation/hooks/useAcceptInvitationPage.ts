import { useState, type FormEvent } from "react";
import validateForm from "../../../../utils/forms/validateForm";
import { acceptInvitationSchema } from "../validation";
import useAcceptInvitation from "./data/useAcceptInvitation";
import useDomainCategories from "./data/useDomainCategories";
import useDomainProductAttributes from "./data/useDomainProductAttributes";
import useDomains from "./data/useDomains";
import useHandleAcceptInvitationForm from "./ui/useHandleAcceptInvitationForm";

const useAcceptInvitationPage = () => {
    const {
        mutate: submitInvitation,
        isPending: acceptInvitationPending,
        isError: acceptInvitationError,
        isSuccess: acceptInvitationSuccess,
    } = useAcceptInvitation();

    const {
        data: domains,
        isLoading: domainsLoading,
        isError: domainsError,
    } = useDomains();

    // Declared before the form hook so the form can check new category names
    // against what already exists in the selected domain. Selection lives in the
    // form hook, so this reads it back on the next render — which is fine, since
    // the query is disabled until a domain is chosen anyway.
    const [selectedDomainId, setSelectedDomainId] = useState("");

    const {
        data: domainCategories,
        isLoading: categoriesLoading,
    } = useDomainCategories(selectedDomainId);

    const {
        data: productAttributes,
        isLoading: productAttributesLoading,
    } = useDomainProductAttributes(selectedDomainId);

    const {
        acceptInvitationFormData,
        errors,
        isInvitationInvalid,
        newCategoryInput,
        newCategoryError,

        handleChange,
        handleDomainChange,
        addNewCategory,
        removeNewCategory,
        toggleProductAttribute,
        handleNewCategoryInputChange,
        handleAgreedToTermsChange,
        setErrors,
    } = useHandleAcceptInvitationForm(domainCategories ?? []);

    const onDomainChange = (domainId: string) => {
        setSelectedDomainId(domainId);
        handleDomainChange(domainId);
    };

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const hasValidationErrors = validateForm({
            schema: acceptInvitationSchema,
            formData: acceptInvitationFormData,
            setErrors,
        });

        if (hasValidationErrors) return;

        submitInvitation(acceptInvitationFormData);
    };

    return {
        acceptInvitationFormData,
        errors,
        isInvitationInvalid,
        acceptInvitationPending,
        acceptInvitationError,
        acceptInvitationSuccess,

        domains,
        domainsLoading,
        domainsError,
        domainCategories,
        categoriesLoading,
        productAttributes,
        productAttributesLoading,

        newCategoryInput,
        newCategoryError,

        submit,
        handleChange,
        onDomainChange,
        addNewCategory,
        removeNewCategory,
        toggleProductAttribute,
        handleNewCategoryInputChange,
        handleAgreedToTermsChange,
    };
};

export default useAcceptInvitationPage;
