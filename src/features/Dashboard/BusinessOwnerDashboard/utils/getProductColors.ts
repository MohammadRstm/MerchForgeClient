import type { ProductFormField, ProductFormValues } from "../types";

/**
 * Reads the product's chosen colors off its ColorList metadata field, if the
 * business has one configured — comma-separated hex codes, the same convention
 * ColorListField writes them in. Metadata field keys differ per business, so the
 * field is found by its declared type rather than a fixed key name.
 */
export const getProductColors = (values: ProductFormValues, fields: ProductFormField[]): string[] => {
    const colorField = fields.find((field) => field.valueType === "ColorList");
    if (!colorField) return [];

    const raw = values.metadata[colorField.key];
    if (typeof raw !== "string") return [];

    return raw.split(",").map((color) => color.trim()).filter(Boolean);
};
