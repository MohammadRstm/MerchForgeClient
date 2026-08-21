import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { FeatureCreditOverview } from "../types";

type FeaturesCardProps = {
    features?: FeatureCreditOverview[];
    isLoading: boolean;
    isError: boolean;
    onSelectFeature: (featureKey: string) => void;
};

/**
 * One card per feature that can be bought independently of the subscription plan.
 * A feature already included in the plan gets a badge instead of a buy button - it's
 * unlimited, there's nothing to add credits to. Otherwise the button reads "Add
 * credits" once the business has ever bought a package for it, or "Subscribe to
 * feature" the first time - both open the same package picker.
 */
const FeaturesCard = ({ features, isLoading, isError, onSelectFeature }: FeaturesCardProps) => {
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
                <div className="feature-grid">
                    {features.map((feature) => (
                        <div key={feature.featureKey} className="feature-card">
                            <span className="feature-card__name">{feature.featureName}</span>

                            {feature.featureDescription && (
                                <p className="feature-card__description">{feature.featureDescription}</p>
                            )}

                            <div className="feature-card__footer">
                                {feature.includedInPlan ? (
                                    <span className="business-dashboard-badge business-dashboard-badge--status-active">
                                        Included in your plan
                                    </span>
                                ) : (
                                    <>
                                        {feature.creditsGrantedTotal > 0 && (
                                            <span className="feature-card__balance">
                                                {feature.creditsRemaining} credit
                                                {feature.creditsRemaining === 1 ? "" : "s"} remaining
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            className="business-dashboard-button-primary"
                                            onClick={() => onSelectFeature(feature.featureKey)}
                                        >
                                            {feature.creditsGrantedTotal > 0 ? "Add credits" : "Subscribe to feature"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default FeaturesCard;
