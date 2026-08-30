import Modal from "../../../../components/Modal/Modal";
import AttentionProductCard from "./AttentionProductCard";
import type { AttentionItem } from "../utils/productAttention";

type AttentionProductsModalProps = {
    isOpen: boolean;
    items: AttentionItem[];
    onClose: () => void;
    onSelectProduct: (productId: string) => void;
};

const AttentionProductsModal = ({ isOpen, items, onClose, onSelectProduct }: AttentionProductsModalProps) => {
    const handleSelect = (productId: string) => {
        onSelectProduct(productId);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <Modal.Header>
                <h2>Products That Need Attention</h2>
            </Modal.Header>

            <Modal.Body>
                <div className="attention-cards-grid attention-cards-grid--modal">
                    {items.map((item) => (
                        <AttentionProductCard key={item.product.productId} item={item} onSelectProduct={handleSelect} />
                    ))}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default AttentionProductsModal;
