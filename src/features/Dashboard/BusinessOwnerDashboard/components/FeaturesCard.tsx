import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { FeatureCreditOverview } from "../types";

type FeaturesCardProps = {
    features?: FeatureCreditOverview[];
    isLoading: boolean;
    isError: boolean;
    onPurchase: (packageId: string) => void;
    purchasingPackageId?: string;
    purchaseError?: string;
};

const currencyFormatter = (currency: string) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency });

/**
 * Features bought independently of the subscription plan, priced in credits rather
 * than a recurring fee: a business buys a package once, spends credits as it uses
 * the feature, and buys more when they run out. Plan-bundled access (includedInPlan)
 * is shown as unlimited rather than as a balance, since it genuinely isn't metered.
 */
const FeaturesCard = ({
    features,
    isLoading,
    isError,
    onPurchase,
    purchasingPackageId,
    purchaseError,
}: FeaturesCardProps) => {
    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Features</h3>
            </div>

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Failed to load features. Please try again.
                </p>
            ) : !features || features.length === 0 ? (
                <p className="business-dashboard-table-message">
                    No features available to buy right now.
                </p>
            ) : (
                <div className="feature-credit-list">
                    {features.map((feature) => (
                        <div key={feature.featureKey} className="feature-credit">
                            <div className="feature-credit__header">
                                <div>
                                    <span className="feature-credit__name">{feature.featureName}</span>
                                    {feature.featureDescription && (
                                        <span className="feature-credit__description">
                                            {feature.featureDescription}
                                        </span>
                                    )}
                                </div>

                                {feature.includedInPlan ? (
                                    <span className="business-dashboard-badge business-dashboard-badge--status-active">
                                        Included in your plan
                                    </span>
                                ) : (
                                    <span className="feature-credit__balance">
                                        {feature.creditsRemaining} credit{feature.creditsRemaining === 1 ? "" : "s"}{" "}
                                        remaining
                                    </span>
                                )}
                            </div>

                            {!feature.includedInPlan && feature.packages.length > 0 && (
                                <div className="feature-credit-package-grid">
                                    {feature.packages.map((pkg) => {
                                        const isPurchasingThis = purchasingPackageId === pkg.id;

                                        return (
                                            <div key={pkg.id} className="feature-credit-package-card">
                                                <span className="feature-credit-package-card__name">{pkg.name}</span>
                                                <span className="feature-credit-package-card__credits">
                                                    {pkg.credits} credits
                                                </span>
                                                <span className="feature-credit-package-card__price">
                                                    {currencyFormatter(pkg.currency).format(pkg.price)}
                                                </span>

                                                <button
                                                    type="button"
                                                    className="business-dashboard-button-primary"
                                                    onClick={() => onPurchase(pkg.id)}
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
                            )}
                        </div>
                    ))}

                    {purchaseError && (
                        <p className="business-dashboard-table-message business-dashboard-table-message--error">
                            {purchaseError}
                        </p>
                    )}
                </div>
            )}
        </section>
    );
};

export default FeaturesCard;
