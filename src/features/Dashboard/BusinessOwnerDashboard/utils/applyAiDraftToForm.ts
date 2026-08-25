import { isoToDateInputValue } from "../hooks/ui/useProductFormState";
import type { ProductDraftProduct, ProductFormField, ProductFormValues } from "../types";

export type DraftFieldKey =
    | "title"
    | "description"
    | "price"
    | "compareAtPrice"
    | "categoryId"
    | "sku"
    | "stockQuantity"
    | "tags"
    | "saleEndsAt"
    | "metadata";

type ApplyCallbacks = {
    setField: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
    setMetadataField: (key: string, value: string | boolean) => void;
};

/**
 * Only touches the metadata keys the draft actually mentioned. Looping over the
 * full field list (the way editing an existing product populates the form) would
 * blank out anything the owner already typed for a key the draft hasn't reached —
 * a draft only ever reveals fields, it never clears them.
 */
const applyMetadataToForm = (
    metadata: Record<string, unknown>,
    fields: ProductFormField[],
    setMetadataField: (key: string, value: string | boolean) => void
) => {
    for (const [key, raw] of Object.entries(metadata)) {
        const field = fields.find((f) => f.key === key);
        if (!field || raw == null) continue;

        if (field.valueType === "Boolean") {
            setMetadataField(key, raw === true);
            continue;
        }

        setMetadataField(key, Array.isArray(raw) ? raw.join(", ") : String(raw));
    }
};

/**
 * Mirrors a ProductDraftProduct's non-null fields into the real form state — the
 * same "reveal, never clear" mirroring the voice draft flow uses, factored out so
 * the photo-suggestion flow can reuse it for an explicit, owner-picked subset of
 * fields instead of applying everything unconditionally.
 *
 * `only`, when given, restricts which fields are applied (still only the ones the
 * draft actually filled) — omitted entirely, every non-null field is applied,
 * which is what the voice flow's live-mirroring effect wants.
 */
export const applyAiDraftToForm = (
    draft: ProductDraftProduct,
    fields: ProductFormField[],
    { setField, setMetadataField }: ApplyCallbacks,
    only?: Set<DraftFieldKey>
) => {
    const include = (key: DraftFieldKey) => !only || only.has(key);

    if (include("title") && draft.title != null) setField("title", draft.title);
    if (include("description") && draft.description != null) setField("description", draft.description);
    if (include("price") && draft.price != null) setField("price", String(draft.price));
    if (include("compareAtPrice") && draft.compareAtPrice != null) {
        setField("compareAtPrice", String(draft.compareAtPrice));
    }
    if (include("categoryId") && draft.categoryId != null) setField("categoryId", draft.categoryId);
    if (include("sku") && draft.sku != null) setField("sku", draft.sku);
    if (include("stockQuantity") && draft.stockQuantity != null) {
        setField("stockQuantity", String(draft.stockQuantity));
    }
    if (include("tags") && draft.tags.length > 0) setField("tags", draft.tags.join(", "));
    if (include("saleEndsAt") && draft.saleEndsAt != null) {
        setField("saleEndsAt", isoToDateInputValue(draft.saleEndsAt));
    }
    if (include("metadata") && draft.metadata != null) {
        applyMetadataToForm(draft.metadata, fields, setMetadataField);
    }
};
