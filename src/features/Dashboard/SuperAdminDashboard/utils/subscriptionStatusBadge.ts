/**
 * Maps a Subscription.Status value to a badge modifier + label — reused everywhere
 * subscription status is shown (Businesses list, Business detail). This is
 * subscription status, never a business-suspension state: no such concept exists.
 */
export const subscriptionStatusBadge = (status: string | null): { className: string; label: string } => {
    switch (status) {
        case "Active":
            return { className: "dashboard-badge--success", label: "Active" };
        case "Trialing":
            return { className: "dashboard-badge--info", label: "Trialing" };
        case "PastDue":
            return { className: "dashboard-badge--warning", label: "Past due" };
        case "Cancelled":
            return { className: "dashboard-badge--danger", label: "Cancelled" };
        case "Expired":
            return { className: "dashboard-badge--danger", label: "Expired" };
        default:
            return { className: "dashboard-badge--neutral", label: "No active plan" };
    }
};
