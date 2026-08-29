import { useState } from "react";
import type { OrderStats } from "../types";

type NeedsAttentionProps = {
    stats?: OrderStats;
    onViewPending: () => void;
};

/**
 * Surfaces only what's actually derivable from existing order data — pending orders,
 * pending orders that have sat unusually long (>24h), and orders cancelled in the
 * last 24h. Nothing here is invented; every number comes straight from OrderStatsResponse.
 */
const NeedsAttention = ({ stats, onViewPending }: NeedsAttentionProps) => {
    // Read once per mount via useState's lazy initializer rather than calling Date.now()
    // directly in the render body — the "hours waiting" figure only needs to be
    // roughly current, not re-derived on every render.
    const [now] = useState(() => Date.now());

    const items: { key: string; text: string; action?: { label: string; onClick: () => void } }[] = [];

    if (stats) {
        if (stats.pendingCount > 0) {
            items.push({
                key: "pending",
                text: `${stats.pendingCount} order${stats.pendingCount === 1 ? " is" : "s are"} waiting for confirmation.`,
                action: { label: "View Pending Orders →", onClick: onViewPending },
            });
        }

        if (stats.stalePendingCount > 0 && stats.oldestPendingOrderCreatedAt) {
            const hours = Math.floor((now - new Date(stats.oldestPendingOrderCreatedAt).getTime()) / (1000 * 60 * 60));
            items.push({
                key: "stale-pending",
                text: `${stats.stalePendingCount} pending order${stats.stalePendingCount === 1 ? " has" : "s have"} been waiting over 24 hours (oldest: ${hours}h).`,
                action: { label: "View Pending Orders →", onClick: onViewPending },
            });
        }

        if (stats.recentlyCancelledCount > 0) {
            items.push({
                key: "recently-cancelled",
                text: `${stats.recentlyCancelledCount} order${stats.recentlyCancelledCount === 1 ? " was" : "s were"} cancelled in the last 24 hours.`,
            });
        }
    }

    return (
        <section className="business-dashboard-table-card needs-attention">
            <div className="business-dashboard-table-header">
                <h3>Needs Attention</h3>
            </div>

            {items.length === 0 ? (
                <p className="business-dashboard-table-message">You're all caught up. No orders need attention.</p>
            ) : (
                <ul className="needs-attention-list">
                    {items.map((item) => (
                        <li key={item.key} className="needs-attention-item">
                            <span>{item.text}</span>
                            {item.action && (
                                <button
                                    type="button"
                                    className="business-dashboard-button-ghost"
                                    onClick={item.action.onClick}
                                >
                                    {item.action.label}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default NeedsAttention;
