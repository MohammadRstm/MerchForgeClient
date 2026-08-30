import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import ProgressBar from "./ProgressBar";
import type { FeatureUsage, UsageWarningLevel } from "../utils/subscriptionUsage";

type UsageLimitsSectionProps = {
    aiCreditsUsage?: FeatureUsage;
    aiCreditsWarning: UsageWarningLevel;
    isLoading: boolean;
    isError: boolean;
    hasSubscription: boolean;
    productCount?: number;
    orderCount?: number;
    onUpgrade: () => void;
};

/**
 * Only ai.image_editing is actually metered against a numeric plan limit today —
 * confirmed against the real Feature/PlanFeature configuration, not assumed.
 * Products/orders/inventory/AI product generation/website customization have no
 * limit in the current system, so they're shown as included capabilities (in
 * CurrentPlanHero's checklist) rather than invented progress bars here. Product/
 * order counts are still worth showing as real context, just not framed as
 * "usage against a cap" that doesn't exist.
 */
const UsageLimitsSection = ({
    aiCreditsUsage,
    aiCreditsWarning,
    isLoading,
    isError,
    hasSubscription,
    productCount,
    orderCount,
    onUpgrade,
}: UsageLimitsSectionProps) => {
    if (!hasSubscription) return null;

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Usage</h3>
            </div>

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Unable to load your usage right now.
                </p>
            ) : (
                <>
                    {aiCreditsUsage && (
                        <div className="usage-item">
                            <div className="usage-item__header">
                                <span className="usage-item__name">{aiCreditsUsage.featureName}</span>
                                <span className="usage-item__figure">
                                    {aiCreditsUsage.limit === null
                                        ? "Unlimited"
                                        : `${aiCreditsUsage.used} / ${aiCreditsUsage.limit}`}
                                </span>
                            </div>

                            {aiCreditsUsage.limit !== null && aiCreditsUsage.percent !== null && (
                                <>
                                    <ProgressBar
                                        percent={aiCreditsUsage.percent}
                                        tone={
                                            aiCreditsWarning === "reached"
                                                ? "critical"
                                                : aiCreditsWarning === "approaching"
                                                  ? "warning"
                                                  : "default"
                                        }
                                    />

                                    {aiCreditsWarning === "reached" ? (
                                        <div className="usage-item__warning usage-item__warning--critical">
                                            <span>You've reached your {aiCreditsUsage.featureName.toLowerCase()} limit for this period.</span>
                                            <button type="button" className="business-dashboard-button-primary" onClick={onUpgrade}>
                                                Upgrade Plan
                                            </button>
                                        </div>
                                    ) : aiCreditsWarning === "approaching" ? (
                                        <p className="usage-item__warning">
                                            You're using {aiCreditsUsage.percent!.toFixed(0)}% of your{" "}
                                            {aiCreditsUsage.featureName.toLowerCase()} limit.
                                        </p>
                                    ) : (
                                        <p className="usage-item__hint">
                                            {aiCreditsUsage.remaining} credit{aiCreditsUsage.remaining === 1 ? "" : "s"} remaining
                                            this period.
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {(productCount !== undefined || orderCount !== undefined) && (
                        <div className="usage-context-row">
                            {productCount !== undefined && (
                                <div className="usage-context-item">
                                    <span className="usage-context-value">{productCount}</span>
                                    <span className="usage-context-label">Products in your catalog</span>
                                </div>
                            )}
                            {orderCount !== undefined && (
                                <div className="usage-context-item">
                                    <span className="usage-context-value">{orderCount}</span>
                                    <span className="usage-context-label">Orders all-time</span>
                                </div>
                            )}
                            <p className="usage-context-note">
                                Products, orders, and inventory tools aren't capped on any plan — shown here for context only.
                            </p>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default UsageLimitsSection;
