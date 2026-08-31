import { useState } from "react";
import Modal from "../../../../components/Modal/Modal";

type LowStockThresholdModalProps = {
    isOpen: boolean;
    currentThreshold?: number;
    isSubmitting: boolean;
    error?: string;
    onConfirm: (threshold: number) => void;
    onCancel: () => void;
};

const LowStockThresholdModal = ({
    isOpen,
    currentThreshold,
    isSubmitting,
    error,
    onConfirm,
    onCancel,
}: LowStockThresholdModalProps) => {
    const [value, setValue] = useState(String(currentThreshold ?? ""));

    // Re-seed the input from the latest known threshold each time the modal opens
    // (or the threshold changes while open). Adjusting state during render, per
    // https://react.dev/reference/react/useState#storing-information-from-previous-renders,
    // rather than in an effect, so this doesn't trigger an extra cascading render.
    const [prevResetState, setPrevResetState] = useState({ isOpen, currentThreshold });
    if (isOpen && (isOpen !== prevResetState.isOpen || currentThreshold !== prevResetState.currentThreshold)) {
        setPrevResetState({ isOpen, currentThreshold });
        setValue(String(currentThreshold ?? ""));
    } else if (isOpen !== prevResetState.isOpen) {
        setPrevResetState({ isOpen, currentThreshold });
    }

    const parsed = Number(value);
    const isValid = value.trim() !== "" && Number.isInteger(parsed) && parsed >= 1;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        onConfirm(parsed);
    };

    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <Modal.Header>
                <h2>Low stock threshold</h2>
            </Modal.Header>

            <form className="business-dashboard-form" onSubmit={handleSubmit} noValidate>
                <Modal.Body>
                    <p className="business-dashboard-member-intro">
                        A tracked product counts as "low stock" once it has this many units or
                        fewer left.
                    </p>

                    <div className="business-dashboard-form-field">
                        <label className="business-dashboard-form-label" htmlFor="low-stock-threshold">
                            Units
                        </label>
                        <input
                            id="low-stock-threshold"
                            className="business-dashboard-form-input"
                            type="number"
                            min="1"
                            step="1"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            autoFocus
                            required
                        />
                    </div>

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
                        type="submit"
                        className="business-dashboard-button-primary"
                        disabled={!isValid || isSubmitting}
                    >
                        {isSubmitting ? "Saving…" : "Save"}
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default LowStockThresholdModal;
