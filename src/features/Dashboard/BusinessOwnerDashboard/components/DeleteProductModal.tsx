import Modal from "../../../../components/Modal/Modal";
import type { BusinessProductResponse } from "../types";

type DeleteProductModalProps = {
    product?: BusinessProductResponse;
    isDeleting: boolean;
    error?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

/**
 * Deleting a product is irreversible and triggered from a single click in a table
 * row, so it gets an explicit confirmation naming the product.
 */
const DeleteProductModal = ({
    product,
    isDeleting,
    error,
    onConfirm,
    onCancel,
}: DeleteProductModalProps) => {
    return (
        <Modal isOpen={Boolean(product)} onClose={onCancel}>
            <Modal.Header>
                <h2>Delete product</h2>
            </Modal.Header>

            <Modal.Body>
                <p>
                    Delete <strong>{product?.title}</strong>? This can't be undone.
                </p>

                {error && (
                    <p className="business-dashboard-form-error" role="alert">
                        {error}
                    </p>
                )}
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="business-dashboard-button-secondary" onClick={onCancel}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="business-dashboard-button-danger"
                    onClick={onConfirm}
                    disabled={isDeleting}
                >
                    {isDeleting ? "Deleting…" : "Delete product"}
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteProductModal;
