import { useCallback, useEffect, useState } from "react";
import type { SaveProductPayload } from "../../../../../services/api/businessDashboard.api";
import type {
    BusinessProductDetail,
    ProductFormField,
    ProductFormImage,
    ProductFormValues,
} from "../../types";

const EMPTY_FORM: ProductFormValues = {
    title: "",
    description: "",
    price: "",
    compareAtPrice: "",
    categoryId: "",
    images: [],
    sku: "",
    stockQuantity: "",
    tags: "",
    saleEndsAt: "",
    metadata: {},
};

const MAX_IMAGES = 5;

export type ProductFormErrors = Partial<
    Record<"title" | "description" | "price" | "compareAtPrice" | "categoryId" | "images", string>
>;

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

        if (field.valueType === "TextList" || field.valueType === "ColorList") {
            const items = text.split(",").map((item) => item.trim()).filter(Boolean);
            if (items.length > 0) metadata[field.key] = items;
            continue;
        }

        metadata[field.key] = text;
    }

    return Object.keys(metadata).length > 0 ? metadata : null;
};

/** yyyy-MM-dd for <input type="date">, in the browser's local time — dates aren't times, so no timezone conversion belongs here. */
export const isoToDateInputValue = (iso: string | null): string => {
    if (!iso) return "";
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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
                compareAtPrice: editingProduct.compareAtPrice != null ? String(editingProduct.compareAtPrice) : "",
                categoryId: editingProduct.categoryId,
                images: editingProduct.images
                    .slice()
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((image) => ({
                        url: image.url,
                        isMain: image.isMain,
                        width: image.width ?? undefined,
                        height: image.height ?? undefined,
                    })),
                sku: editingProduct.sku ?? "",
                stockQuantity: editingProduct.stockQuantity != null ? String(editingProduct.stockQuantity) : "",
                tags: editingProduct.tags.join(", "),
                saleEndsAt: isoToDateInputValue(editingProduct.saleEndsAt),
                metadata: metadataToFormValues(editingProduct.metadata, fields),
            });
        } else {
            setValues({ ...EMPTY_FORM, metadata: metadataToFormValues(null, fields) });
        }

        setErrors({});
    }, [editingProduct, fields]);

    // Stable across renders (empty deps -- both only ever touch the setState
    // setters, which React itself guarantees are stable) so effects elsewhere,
    // like the AI draft sync in ProductModal, can depend on them safely without
    // re-running on every render.
    const setField = useCallback(<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
        setValues((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    }, []);

    const setMetadataField = useCallback((key: string, value: string | boolean) => {
        setValues((prev) => ({ ...prev, metadata: { ...prev.metadata, [key]: value } }));
    }, []);

    /**
     * The first image ever added becomes main automatically; every image after that
     * simply joins the gallery. The user only ever needs to *change* which one is
     * main (setMainImage) — there's no path where zero or many images end up main,
     * so nothing has to validate that invariant after the fact.
     */
    const addImage = (image: Omit<ProductFormImage, "isMain">) => {
        setValues((prev) => ({
            ...prev,
            images: [...prev.images, { ...image, isMain: prev.images.length === 0 }],
        }));
        setErrors((prev) => ({ ...prev, images: undefined }));
    };

    /** If the removed image was main, promotes whichever image is now first — the gallery is never left without one. */
    const removeImage = (url: string) => {
        setValues((prev) => {
            const removedWasMain = prev.images.find((image) => image.url === url)?.isMain ?? false;
            const remaining = prev.images.filter((image) => image.url !== url);

            return {
                ...prev,
                images: removedWasMain && remaining.length > 0
                    ? remaining.map((image, index) => ({ ...image, isMain: index === 0 }))
                    : remaining,
            };
        });
    };

    const setMainImage = (url: string) => {
        setValues((prev) => ({
            ...prev,
            images: prev.images.map((image) => ({ ...image, isMain: image.url === url })),
        }));
    };

    /** Swaps one image's url for another in place — the AI edit result replacing what was there, not a new gallery entry. isMain and position are untouched. */
    const replaceImage = (oldUrl: string, newUrl: string) => {
        setValues((prev) => ({
            ...prev,
            images: prev.images.map((image) =>
                image.url === oldUrl ? { ...image, url: newUrl, width: undefined, height: undefined } : image
            ),
        }));
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

        if (values.compareAtPrice.trim()) {
            const compareAtPrice = Number(values.compareAtPrice);
            if (Number.isNaN(compareAtPrice) || compareAtPrice <= price) {
                nextErrors.compareAtPrice = "Must be greater than the price";
            }
        }

        if (values.images.length === 0) {
            nextErrors.images = "Add at least one image";
        } else if (values.images.length > MAX_IMAGES) {
            nextErrors.images = `A product can have at most ${MAX_IMAGES} images`;
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const toPayload = (): SaveProductPayload => ({
        title: values.title.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        compareAtPrice: values.compareAtPrice.trim() ? Number(values.compareAtPrice) : undefined,
        categoryId: values.categoryId,
        images: values.images.map((image) => ({
            url: image.url,
            isMain: image.isMain,
            width: image.width,
            height: image.height,
        })),
        sku: values.sku.trim() || undefined,
        stockQuantity: values.stockQuantity.trim() ? Number(values.stockQuantity) : undefined,
        tags: values.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        // <input type="date"> gives "yyyy-MM-dd"; midnight local time is close enough
        // for a promotion deadline and avoids the input silently rolling back a day
        // in timezones behind UTC if this were parsed as UTC instead.
        saleEndsAt: values.saleEndsAt ? new Date(`${values.saleEndsAt}T00:00:00`).toISOString() : undefined,
        metadata: formValuesToMetadata(values.metadata, fields),
    });

    return {
        values,
        errors,
        setField,
        setMetadataField,
        addImage,
        removeImage,
        setMainImage,
        replaceImage,
        maxImages: MAX_IMAGES,
        validate,
        toPayload,
    };
};

export default useProductFormState;
