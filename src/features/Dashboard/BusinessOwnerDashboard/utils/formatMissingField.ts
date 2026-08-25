/**
 * Missing fields come back as the backend's own names, including "metadata.colors"
 * for a business-configured field — "metadata" is an implementation word the owner
 * has no reason to know. Strips that prefix and turns the raw key into a label
 * ("stockQuantity" -> "Stock quantity") without needing the field definitions this
 * caller may not have.
 */
const formatMissingField = (field: string): string => {
    const key = field.startsWith("metadata.") ? field.slice("metadata.".length) : field;
    const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
};

export default formatMissingField;
