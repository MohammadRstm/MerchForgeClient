import Spinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import type { SubscriptionHistoryEntry } from "../types";

type SubscriptionActivitySectionProps = {
    history?: SubscriptionHistoryEntry[];
    isLoading: boolean;
    isError: boolean;
};

/**
 * A Cancelled row's CancelAtPeriodEnd flag alone doesn't say whether it actually
 * ran to that date or was cut short by an earlier plan switch (SubscribeToPlanAsync
 * marks the prior row Cancelled immediately, regardless of that flag) — comparing
 * CurrentPeriodEnd against now disambiguates the two without guessing.
 */
const describeOutcome = (entry: SubscriptionHistoryEntry): string | null => {
    const periodEndDate = new Date(entry.currentPeriodEnd).toLocaleDateString(undefined, { dateStyle: "medium" });

    if (entry.status === "Cancelled") {
        return new Date(entry.currentPeriodEnd) <= new Date()
            ? `— ran until ${periodEndDate}`
            : "— replaced by a plan switch";
    }

    if (entry.status === "Active" && entry.cancelAtPeriodEnd) {
        return `— set to end ${periodEndDate}`;
    }

    return null;
};

/** Real plan-change history, read from the business's own Subscription rows (the prior row is marked Cancelled on every switch rather than deleted) — not a fabricated activity feed. */
const SubscriptionActivitySection = ({ history, isLoading, isError }: SubscriptionActivitySectionProps) => {
    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Subscription Activity</h3>
            </div>

            {isLoading ? (
                <div className="business-dashboard-table-loading">
                    <Spinner size={28} />
                </div>
            ) : isError ? (
                <p className="business-dashboard-table-message business-dashboard-table-message--error">
                    Unable to load subscription activity.
                </p>
            ) : !history || history.length === 0 ? (
                <p className="business-dashboard-table-message">No subscription activity yet.</p>
            ) : (
                <ul className="subscription-activity-list">
                    {history.map((entry) => (
                        <li key={entry.id} className="subscription-activity-item">
                            <span className="subscription-activity-date">
                                {new Date(entry.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                            </span>
                            <span className="subscription-activity-text">
                                Started <strong>{entry.planName}</strong> ({entry.billingInterval.toLowerCase()})
                                {describeOutcome(entry) && ` ${describeOutcome(entry)}`}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default SubscriptionActivitySection;
