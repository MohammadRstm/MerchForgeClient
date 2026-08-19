import { useEffect, useState } from "react";
import type { SaveProductPayload } from "../../../../../services/api/businessDashboard.api";
import type {
    BusinessProductDetail,
    ProductFormField,
    ProductFormValues,
} from "../../types";

const EMPTY_FORM: ProductFormValues = {
    title: "",
    description: "",
    price: "",
    categoryId: "",
    imageUrl: null,
    metadata: {},
};

export type ProductFormErrors = Partial<Record<"title" | "description" | "price" | "categoryId", string>>;

/**
 * Converts a product's stored metadata back into the string/boolean values the form
 * inputs use. TextList becomes a comma-separated string, which is also how it's
 * edited.
 */
const metadataToFormValues = (
    metadata: Record<string, unknown> | null,
    fields: ProductFormField[]
): Record<string, string | boolean> => {
    const values: Record<string, string | boolean> = {};

    for (const field of fields) {
        const raw = metadata?.[field.key];

        if (field.valueType === "Boolean") {
            values[field.key] = raw === true;
            continue;
        }

        if (raw == null) {
            values[field.key] = "";
            continue;
        }

        values[field.key] = Array.isArray(raw) ? raw.join(", ") : String(raw);
    }

    return values;
};

/**
 * Converts form values back to the JSON types the backend expects. Blank text and
 * empty lists are omitted entirely rather than sent as empty values — every optional
 * field is genuinely optional, and the backend drops blanks anyway, so not sending
 * them keeps the payload honest about what was filled in.
 */
const formValuesToMetadata = (
    values: Record<string, string | boolean>,
    fields: ProductFormField[]
): Record<string, unknown> | null => {
    const metadata: Record<string, unknown> = {};

    for (const field of fields) {
        const raw = values[field.key];

        if (field.valueType === "Boolean") {
            // Sent even when false: for a yes/no field "no" is an answer.
            metadata[field.key] = raw === true;
            continue;
        }

        const text = typeof raw === "string" ? raw.trim() : "";

        if (!text) continue;

        if (field.valueType === "Number") {
            const parsed = Number(text);
            if (!Number.isNaN(parsed)) metadata[field.key] = parsed;
            continue;
        }

        if (field.valueType === "TextList") {
            const items = text.split(",").map((item) => item.trim()).filter(Boolean);
            if (items.length > 0) metadata[field.key] = items;
            continue;
        }

        metadata[field.key] = text;
    }

    return Object.keys(metadata).length > 0 ? metadata : null;
};

const useProductFormState = (
    editingProduct: BusinessProductDetail | undefined,
    fields: ProductFormField[]
) => {
    const [values, setValues] = useState<ProductFormValues>(EMPTY_FORM);
    const [errors, setErrors] = useState<ProductFormErrors>({});

    // Repopulates when the modal switches between create and edit, or once an
    // edited product finishes loading.
    useEffect(() => {
        if (editingProduct) {
            setValues({
                title: editingProduct.title,
                description: editingProduct.description,
                price: String(editingProduct.price),
                categoryId: editingProduct.categoryId,
                imageUrl: editingProduct.imageUrl,
                metadata: metadataToFormValues(editingProduct.metadata, fields),
            });
        } else {
            setValues({ ...EMPTY_FORM, metadata: metadataToFormValues(null, fields) });
        }

        setErrors({});
    }, [editingProduct, fields]);

    const setField = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
        setValues((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

    const setMetadataField = (key: string, value: string | boolean) => {
        setValues((prev) => ({ ...prev, metadata: { ...prev.metadata, [key]: value } }));
    };

    const validate = (): boolean => {
        const nextErrors: ProductFormErrors = {};

        if (!values.title.trim()) nextErrors.title = "Title is required";
        if (!values.description.trim()) nextErrors.description = "Description is required";
        if (!values.categoryId) nextErrors.categoryId = "Select a category";

        const price = Number(values.price);
        if (!values.price.trim()) {
            nextErrors.price = "Price is required";
        } else if (Number.isNaN(price) || price < 0) {
            nextErrors.price = "Enter a price of 0 or more";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const toPayload = (): SaveProductPayload => ({
        title: values.title.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        categoryId: values.categoryId,
        imageUrl: values.imageUrl,
        metadata: formValuesToMetadata(values.metadata, fields),
    });

    return { values, errors, setField, setMetadataField, validate, toPayload };
};

export default useProductFormState;
