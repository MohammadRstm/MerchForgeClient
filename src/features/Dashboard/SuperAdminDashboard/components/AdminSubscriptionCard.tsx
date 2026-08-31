import { subscriptionStatusBadge } from "../utils/subscriptionStatusBadge";
import { formatCurrency } from "../utils/formatCurrency";
import type { BusinessDetailResponse } from "../types";

type AdminSubscriptionCardProps = {
    subscription: BusinessDetailResponse["subscription"];
    activeSubscriberCountForPlan: number | null;
};

const AdminSubscriptionCard = ({ subscription, activeSubscriberCountForPlan }: AdminSubscriptionCardProps) => {
    const badge = subscriptionStatusBadge(subscription?.status ?? null);

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Subscription</h3>
                <span className={`dashboard-badge ${badge.className}`}>{badge.label}</span>
            </div>

            {!subscription ? (
                <p className="dashboard-table-message">No active subscription.</p>
            ) : (
                <>
                    <dl className="business-detail-grid">
                        <div>
                            <dt>Plan</dt>
                            <dd>
                                {subscription.planName} · {subscription.billingInterval}
                            </dd>
                        </div>
                        <div>
                            <dt>Price</dt>
                            <dd>{formatCurrency(subscription.price, subscription.currency)}</dd>
                        </div>
                        <div>
                            <dt>Current period</dt>
                            <dd>
                                {new Date(subscription.currentPeriodStart).toLocaleDateString()} –{" "}
                                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                            </dd>
                        </div>
                        <div>
                            <dt>{subscription.cancelAtPeriodEnd ? "Ends" : "Renews"}</dt>
                            <dd>
                                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                {subscription.cancelAtPeriodEnd && (
                                    <span className="dashboard-table-muted"> · not renewing</span>
                                )}
                            </dd>
                        </div>
                        {activeSubscriberCountForPlan !== null && (
                            <div>
                                <dt>Active subscribers on this plan</dt>
                                <dd>{activeSubscriberCountForPlan}</dd>
                            </div>
                        )}
                    </dl>

                    {subscription.features.length > 0 && (
                        <>
                            <h4 className="dashboard-subsection-heading">Included features</h4>
                            <div className="product-overview-categories">
                                {subscription.features.map((feature) => (
                                    <span key={feature.featureKey} className="dashboard-badge dashboard-badge--info">
                                        {feature.featureName}
                                        {feature.limit != null && ` · ${feature.limit}/period`}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            <p className="dashboard-chart-disclaimer">
                Subscription management isn't available yet — this is a read-only view.
            </p>
        </section>
    );
};

export default AdminSubscriptionCard;
