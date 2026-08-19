import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { BusinessSubscriptionResponse } from "../types";

type SubscriptionCardProps = {
    subscription?: BusinessSubscriptionResponse;
    isLoading: boolean;
    isError: boolean;
};

const currencyFormatter = (currency: string) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency });

const SubscriptionCard = ({ subscription, isLoading, isError }: SubscriptionCardProps) => {
    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Subscription</h3>
            </div>

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Failed to load subscription. Please try again.
                </p>
            ) : !subscription ? (
                <p className="business-dashboard-table-message">
                    No subscription yet. Your business isn't on a plan.
                </p>
            ) : (
                <div className="business-dashboard-subscription">
                    <div className="business-dashboard-subscription-header">
                        <div>
                            <span className="business-dashboard-subscription-plan">{subscription.planName}</span>
                            <span className="business-dashboard-subscription-price">
                                {currencyFormatter(subscription.currency).format(subscription.price)} /{" "}
                                {subscription.billingInterval.toLowerCase()}
                            </span>
                        </div>
                        <span
                            className={`business-dashboard-badge business-dashboard-badge--status-${subscription.status.toLowerCase()}`}
                        >
                            {subscription.status}
                        </span>
                    </div>

                    <p className="business-dashboard-subscription-period">
                        Current period: {new Date(subscription.currentPeriodStart).toLocaleDateString()} –{" "}
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>

                    {subscription.features.length > 0 && (
                        <ul className="business-dashboard-subscription-features">
                            {subscription.features.map((feature) => (
                                <li key={feature.featureKey}>
                                    {feature.featureName}
                                    {feature.limit != null && (
                                        <span className="business-dashboard-subscription-feature-limit">
                                            {" "}
                                            (up to {feature.limit})
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </section>
    );
};

export default SubscriptionCard;
