import { formatCurrency } from "../utils/formatCurrency";
import type { SubscriptionPlanGroup } from "../types";

type PlanCardProps = {
    group: SubscriptionPlanGroup;
    onEdit: () => void;
    onManageSubscribers: () => void;
    onDeactivate: () => void;
};

const IntervalPrice = ({
    label,
    interval,
    currency,
}: {
    label: string;
    interval: SubscriptionPlanGroup["monthly"];
    currency: string;
}) => {
    if (!interval) {
        return (
            <div className="plan-card-price plan-card-price--empty">
                <span className="dashboard-table-muted">No {label.toLowerCase()} option</span>
            </div>
        );
    }

    return (
        <div className="plan-card-price">
            <span className="plan-card-price-amount">{formatCurrency(interval.price, currency)}</span>
            <span className="dashboard-table-muted">/ {label.toLowerCase()}</span>
            {!interval.isActive && <span className="dashboard-badge dashboard-badge--neutral">Inactive</span>}
        </div>
    );
};

const PlanCard = ({ group, onEdit, onManageSubscribers, onDeactivate }: PlanCardProps) => {
    const anyActive = group.monthly?.isActive || group.yearly?.isActive;

    return (
        <div className="plan-card">
            <div className="plan-card-header">
                <h3>{group.name}</h3>
                <span className={`dashboard-badge ${anyActive ? "dashboard-badge--success" : "dashboard-badge--neutral"}`}>
                    {anyActive ? "Active" : "Inactive"}
                </span>
            </div>

            {group.description && <p className="plan-card-description">{group.description}</p>}

            <div className="plan-card-prices">
                <IntervalPrice label="Month" interval={group.monthly} currency={group.currency} />
                <IntervalPrice label="Year" interval={group.yearly} currency={group.currency} />
            </div>

            <button type="button" className="plan-card-subscribers" onClick={onManageSubscribers}>
                {group.totalActiveSubscriberCount} business{group.totalActiveSubscriberCount === 1 ? "" : "es"} subscribed
                {group.percentOfActiveSubscriptions !== null && (
                    <span className="dashboard-table-muted"> · {group.percentOfActiveSubscriptions}% of active subscriptions</span>
                )}
            </button>

            {group.features.length > 0 && (
                <ul className="plan-card-features">
                    {group.features.map((feature) => (
                        <li key={feature.featureKey}>
                            <span className="plan-card-feature-check">✓</span>
                            <span>{feature.featureName}</span>
                            {feature.limit !== null && (
                                <span className="dashboard-table-muted"> — {feature.limit}/period</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <div className="plan-card-actions">
                <button type="button" className="dashboard-action-btn" onClick={onEdit}>
                    Edit
                </button>
                <button type="button" className="dashboard-action-btn" onClick={onManageSubscribers}>
                    Manage Subscribers
                </button>
                <button type="button" className="dashboard-action-btn" onClick={onDeactivate}>
                    Activate / Deactivate
                </button>
            </div>
        </div>
    );
};

export default PlanCard;
