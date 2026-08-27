import { useEffect, useState } from "react";
import Modal from "../../../../components/Modal/Modal";
import type { BusinessProductResponse } from "../types";

type StockAdjustmentMode = "add" | "remove";

type StockAdjustmentModalProps = {
    product?: BusinessProductResponse;
    mode: StockAdjustmentMode;
    isSubmitting: boolean;
    error?: string;
    onConfirm: (quantity: number, reason?: string) => void;
    onCancel: () => void;
};

/**
 * One modal handles both directions — the verb/title swap on `mode`, and the caller
 * (useOwnerInventoryPage) negates the quantity before sending a Remove. Quantity here
 * is always a positive magnitude; the sign lives entirely in the request payload.
 */
const StockAdjustmentModal = ({ product, mode, isSubmitting, error, onConfirm, onCancel }: StockAdjustmentModalProps) => {
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("");

    const isOpen = Boolean(product);
    const verb = mode === "add" ? "Add" : "Remove";
    const verbIng = mode === "add" ? "Adding" : "Removing";
    const parsedQuantity = Number(quantity);
    const isValid = quantity.trim() !== "" && Number.isInteger(parsedQuantity) && parsedQuantity > 0;

    // Reset on every open, not just on Cancel — this modal instance is reused across
    // products/modes rather than remounted, so a value left over from a successful
    // submit (which closes via the parent's onSuccess, bypassing handleClose) would
    // otherwise still be sitting in the inputs next time it opens.
    useEffect(() => {
        if (isOpen) {
            setQuantity("");
            setReason("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, product?.id, mode]);

    const handleClose = () => {
        setQuantity("");
        setReason("");
        onCancel();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        onConfirm(parsedQuantity, reason.trim() || undefined);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <Modal.Header>
                <h2>
                    {verb} stock — {product?.title}
                </h2>
            </Modal.Header>

            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <p>
                        Currently <strong>{product?.stockQuantity ?? "not tracked"}</strong>
                        {typeof product?.stockQuantity === "number" ? " in stock." : "."}
                    </p>

                    <fieldset>
                        <label htmlFor="stock-adjustment-quantity">Quantity to {mode}</label>
                        <input
                            id="stock-adjustment-quantity"
                            type="number"
                            min="1"
                            step="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            autoFocus
                            required
                        />
                    </fieldset>

                    <fieldset>
                        <label htmlFor="stock-adjustment-reason">Reason (optional)</label>
                        <input
                            id="stock-adjustment-reason"
                            type="text"
                            maxLength={255}
                            placeholder={mode === "add" ? "e.g. Restock delivery" : "e.g. Damaged units"}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </fieldset>

                    {error && (
                        <p className="business-dashboard-form-error" role="alert">
                            {error}
                        </p>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <button type="button" className="business-dashboard-button-secondary" onClick={handleClose}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="business-dashboard-button-primary"
                        disabled={!isValid || isSubmitting}
                    >
                        {isSubmitting ? `${verbIng}…` : `${verb} stock`}
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default StockAdjustmentModal;
