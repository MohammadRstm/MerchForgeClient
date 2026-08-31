import { Link } from "react-router";
import { buildAdminBusinessDetailRoute } from "../../../../config/routes";
import type { RecentSubscriptionActivityEntry } from "../types";

const timeAgo = (isoDate: string): string => {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.round(diffMs / 60_000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

    const days = Math.round(hours / 24);
    if (days === 1) return "yesterday";
    if (days < 30) return `${days} days ago`;

    return new Date(isoDate).toLocaleDateString();
};

type RecentSubscriptionActivityProps = {
    entries?: RecentSubscriptionActivityEntry[];
    isLoading: boolean;
    isError: boolean;
};

/** Only ever shows real Subscription-row events (new subscription or a plan switch) - no fabricated activity, and nothing renders at all when there's none to show. */
const RecentSubscriptionActivity = ({ entries, isLoading, isError }: RecentSubscriptionActivityProps) => {
    if (isLoading || isError || !entries || entries.length === 0) {
        return null;
    }

    return (
        <section className="dashboard-table-card">
            <div className="dashboard-table-header">
                <h3>Recent Subscription Activity</h3>
            </div>
            <ul className="recent-activity-list">
                {entries.map((entry, index) => (
                    <li key={`${entry.businessId}-${entry.createdAt}-${index}`}>
                        <div>
                            <Link to={buildAdminBusinessDetailRoute(entry.businessId)} className="dashboard-inline-link">
                                {entry.businessName}
                            </Link>
                            <span className="dashboard-table-muted">
                                {" "}
                                {entry.isNewSubscription ? "started" : "switched to"} {entry.planName} ({entry.billingInterval})
                            </span>
                        </div>
                        <span className="dashboard-table-muted">{timeAgo(entry.createdAt)}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default RecentSubscriptionActivity;
