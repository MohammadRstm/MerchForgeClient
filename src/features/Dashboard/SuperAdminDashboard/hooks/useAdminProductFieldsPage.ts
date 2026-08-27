import { useState } from "react";
import useDashboardProductAttributes from "./data/useDashboardProductAttributes";
import useCreateProductAttributeDefinition from "./data/useCreateProductAttributeDefinition";
import useUpdateProductAttributeDefinition from "./data/useUpdateProductAttributeDefinition";
import useSetProductAttributeDefinitionActive from "./data/useSetProductAttributeDefinitionActive";
import {
    createProductAttributeDefinitionFormSchema,
    updateProductAttributeDefinitionFormSchema,
} from "../validation";
import { ApiError } from "../../../../Error/ApiError";
import type {
    ProductAttributeDefinition,
    CreateProductAttributeDefinitionFormValues,
    UpdateProductAttributeDefinitionFormValues,
} from "../types";
import type { ZodError } from "zod";

const EMPTY_CREATE_VALUES: CreateProductAttributeDefinitionFormValues = {
    businessDomainId: "",
    key: "",
    label: "",
    valueType: "Text",
    isRequired: false,
    allowedValuesInput: "",
    displayOrder: "0",
};

const EMPTY_EDIT_VALUES: UpdateProductAttributeDefinitionFormValues = {
    label: "",
    valueType: "Text",
    isRequired: false,
    allowedValuesInput: "",
    displayOrder: "0",
};

const flattenZodErrors = (error: ZodError): Record<string, string> => {
    const fieldErrors: Record<string, string> = {};

    for (const issue of error.issues) {
        const field = issue.path[0];

        if (typeof field === "string" && !fieldErrors[field]) {
            fieldErrors[field] = issue.message;
        }
    }

    return fieldErrors;
};

const parseAllowedValues = (input: string) =>
    input
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

const useAdminProductFieldsPage = () => {
    const [domainFilter, setDomainFilter] = useState<string | undefined>(undefined);
    const { data: definitions, isLoading, isError } = useDashboardProductAttributes(domainFilter);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [createValues, setCreateValues] = useState(EMPTY_CREATE_VALUES);
    const [editValues, setEditValues] = useState(EMPTY_EDIT_VALUES);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { mutate: createDefinition, isPending: isCreating } = useCreateProductAttributeDefinition();
    const { mutate: updateDefinition, isPending: isUpdating } = useUpdateProductAttributeDefinition();
    const { mutate: setActive, isPending: isTogglingActive } = useSetProductAttributeDefinitionActive();

    const openCreate = () => {
        setEditingId(null);
        setCreateValues({ ...EMPTY_CREATE_VALUES, businessDomainId: domainFilter ?? "" });
        setErrors({});
        setIsModalOpen(true);
    };

    const openEdit = (definition: ProductAttributeDefinition) => {
        setEditingId(definition.id);
        setEditValues({
            label: definition.label,
            valueType: definition.valueType,
            isRequired: definition.isRequired,
            allowedValuesInput: definition.allowedValues.join(", "),
            displayOrder: String(definition.displayOrder),
        });
        setErrors({});
        setIsModalOpen(true);
    };

    const close = () => {
        if (isCreating || isUpdating) {
            return;
        }

        setIsModalOpen(false);
    };

    const changeCreate = (field: keyof CreateProductAttributeDefinitionFormValues, value: string | boolean) => {
        setCreateValues((current) => ({ ...current, [field]: value }));
    };

    const changeEdit = (field: keyof UpdateProductAttributeDefinitionFormValues, value: string | boolean) => {
        setEditValues((current) => ({ ...current, [field]: value }));
    };

    const submit = () => {
        if (editingId) {
            const result = updateProductAttributeDefinitionFormSchema.safeParse({
                ...editValues,
                allowedValues: parseAllowedValues(editValues.allowedValuesInput),
            });

            if (!result.success) {
                setErrors(flattenZodErrors(result.error));
                return;
            }

            updateDefinition(
                { id: editingId, payload: result.data },
                {
                    onSuccess: () => setIsModalOpen(false),
                    onError: (error) => {
                        setErrors({
                            label:
                                error instanceof ApiError
                                    ? error.message
                                    : "Could not save this field. Please try again.",
                        });
                    },
                }
            );
            return;
        }

        const result = createProductAttributeDefinitionFormSchema.safeParse({
            ...createValues,
            allowedValues: parseAllowedValues(createValues.allowedValuesInput),
        });

        if (!result.success) {
            setErrors(flattenZodErrors(result.error));
            return;
        }

        createDefinition(result.data, {
            onSuccess: () => setIsModalOpen(false),
            onError: (error) => {
                setErrors({
                    key: error instanceof ApiError ? error.message : "Could not create this field. Please try again.",
                });
            },
        });
    };

    const toggleActive = (definition: ProductAttributeDefinition) => {
        setActive({ id: definition.id, isActive: !definition.isActive });
    };

    return {
        domainFilter,
        setDomainFilter,
        definitions,
        isLoading,
        isError,

        isModalOpen,
        isEditing: !!editingId,
        createValues,
        editValues,
        errors,
        isSaving: isCreating || isUpdating,
        openCreate,
        openEdit,
        close,
        changeCreate,
        changeEdit,
        submit,

        toggleActive,
        isTogglingActive,
    };
};

export default useAdminProductFieldsPage;
