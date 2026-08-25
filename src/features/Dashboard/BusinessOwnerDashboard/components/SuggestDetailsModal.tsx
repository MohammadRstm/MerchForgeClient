import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type useSuggestProductDetails from "../hooks/ui/useSuggestProductDetails";
import type { DraftFieldKey } from "../utils/applyAiDraftToForm";
import type { ProductFormField, ProductFormValues } from "../types";

type SuggestDetailsModalProps = {
    suggestDetails: ReturnType<typeof useSuggestProductDetails>;
    fields: ProductFormField[];
    setField: <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => void;
    setMetadataField: (key: string, value: string | boolean) => void;
};

const currencyFormatter = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

type Row = { key: DraftFieldKey; label: string; value: string };

/** Only ever built from fields the AI actually filled — nothing to show for a null one. */
const buildRows = (suggestion: ReturnType<typeof useSuggestProductDetails>["suggestion"]): Row[] => {
    if (!suggestion) return [];

    const rows: Row[] = [];

    if (suggestion.title != null) rows.push({ key: "title", label: "Title", value: suggestion.title });
    if (suggestion.description != null) {
        rows.push({ key: "description", label: "Description", value: suggestion.description });
    }
    if (suggestion.price != null) {
        rows.push({ key: "price", label: "Price", value: currencyFormatter.format(suggestion.price) });
    }
    if (suggestion.compareAtPrice != null) {
        rows.push({
            key: "compareAtPrice",
            label: "Compare-at price",
            value: currencyFormatter.format(suggestion.compareAtPrice),
        });
    }
    if (suggestion.categoryId != null) {
        rows.push({ key: "categoryId", label: "Category", value: suggestion.categoryName ?? suggestion.categoryId });
    }
    if (suggestion.sku != null) rows.push({ key: "sku", label: "SKU", value: suggestion.sku });
    if (suggestion.stockQuantity != null) {
        rows.push({ key: "stockQuantity", label: "Stock quantity", value: String(suggestion.stockQuantity) });
    }
    if (suggestion.tags.length > 0) rows.push({ key: "tags", label: "Tags", value: suggestion.tags.join(", ") });
    if (suggestion.saleEndsAt != null) {
        rows.push({ key: "saleEndsAt", label: "Sale ends", value: suggestion.saleEndsAt.slice(0, 10) });
    }
    if (suggestion.metadata != null && Object.keys(suggestion.metadata).length > 0) {
        const preview = Object.entries(suggestion.metadata)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
            .join(" · ");
        rows.push({ key: "metadata", label: "Additional details", value: preview });
    }

    return rows;
};

/**
 * One-shot, no picking phase — there's only ever the product's main image to look
 * at. Shows exactly the fields the AI actually filled (never a row for one it
 * left null) with a checkbox per field, defaulted to checked, and applies only
 * the checked subset on confirmation via the shared applyAiDraftToForm util.
 */
const SuggestDetailsModal = ({ suggestDetails, fields, setField, setMetadataField }: SuggestDetailsModalProps) => {
    const { isOpen, close, hasMainImage, status, suggestion, selectedFields, toggleField, error, apply } =
        suggestDetails;

    const rows = buildRows(suggestion);

    return (
        <Modal isOpen={isOpen} onClose={close}>
            <Modal.Header>
                <h2>Suggest details from photo</h2>
            </Modal.Header>

            <Modal.Body>
                {!hasMainImage ? (
                    <p className="business-dashboard-form-error" role="alert">
                        Add a main image first — there's nothing to analyze yet.
                    </p>
                ) : status === "working" ? (
                    <div className="business-dashboard-table-loading">
                        <Spinner size={28} />
                    </div>
                ) : status === "error" ? (
                    <p className="business-dashboard-form-error" role="alert">
                        {error}
                    </p>
                ) : rows.length === 0 ? (
                    <p className="business-dashboard-form-hint">
                        The AI couldn't confidently determine anything from this photo.
                    </p>
                ) : (
                    <div className="suggest-details__rows">
                        {rows.map((row) => (
                            <label key={row.key} className="suggest-details__row">
                                <input
                                    type="checkbox"
                                    checked={selectedFields.has(row.key)}
                                    onChange={() => toggleField(row.key)}
                                />
                                <span className="suggest-details__row-label">{row.label}</span>
                                <span className="suggest-details__row-value">{row.value}</span>
                            </label>
                        ))}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="business-dashboard-button-secondary" onClick={close}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="business-dashboard-button-primary"
                    onClick={() => apply(fields, { setField, setMetadataField })}
                    disabled={status !== "done" || selectedFields.size === 0}
                >
                    Apply to form
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default SuggestDetailsModal;
