import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type useFeatureCreditsModal from "../hooks/ui/useFeatureCreditsModal";

type FeatureCreditsModalProps = {
    modal: ReturnType<typeof useFeatureCreditsModal>;
};

const currencyFormatter = (currency: string) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency });

/** The package picker a Features card button opens - buying is immediate per package, no separate confirm step. */
const FeatureCreditsModal = ({ modal }: FeatureCreditsModalProps) => {
    const { isOpen, activeFeature, error, purchasingPackageId, close, purchase } = modal;

    if (!activeFeature) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={close}>
            <Modal.Header>
                <h2>{activeFeature.featureName}</h2>
            </Modal.Header>

            <Modal.Body>
                {activeFeature.featureDescription && (
                    <p className="business-dashboard-form-hint">{activeFeature.featureDescription}</p>
                )}

                <div className="feature-package-grid">
                    {activeFeature.packages.map((pkg) => {
                        const isPurchasingThis = purchasingPackageId === pkg.id;

                        return (
                            <div key={pkg.id} className="feature-package-card">
                                <span className="feature-package-card__name">{pkg.name}</span>
                                <span className="feature-package-card__credits">{pkg.credits} credits</span>
                                <span className="feature-package-card__price">
                                    {currencyFormatter(pkg.currency).format(pkg.price)}
                                </span>

                                <button
                                    type="button"
                                    className="business-dashboard-button-primary"
                                    onClick={() => purchase(pkg.id)}
                                    disabled={purchasingPackageId != null}
                                >
                                    {isPurchasingThis ? (
                                        <>
                                            <Spinner size={14} /> Buying…
                                        </>
                                    ) : (
                                        "Buy"
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {error && (
                    <p className="business-dashboard-form-error" role="alert">
                        {error}
                    </p>
                )}
            </Modal.Body>

            <Modal.Footer>
                <button type="button" className="business-dashboard-button-secondary" onClick={close}>
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default FeatureCreditsModal;
