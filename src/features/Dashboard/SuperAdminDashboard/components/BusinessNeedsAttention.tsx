import { Link } from "react-router";
import { routes } from "../../../../config/routes";
import type { BusinessDetailResponse } from "../types";
import type { InventorySummary } from "../../BusinessOwnerDashboard/types";

type BusinessNeedsAttentionProps = {
    business: BusinessDetailResponse;
    inventorySummary?: InventorySummary;
};

type AttentionItem = { text: string; to?: string };

/** Only real, currently-existing signals - no fabricated warning conditions, and no business-suspension logic (that concept doesn't exist yet). */
const buildAttentionItems = (
    business: BusinessDetailResponse,
    inventorySummary?: InventorySummary
): AttentionItem[] => {
    const items: AttentionItem[] = [];

    const openRequest = business.websiteTemplateRequests.find(
        (r) => r.status === "Pending" || r.status === "InProgress"
    );
    if (openRequest) {
        items.push({
            text:
                openRequest.status === "Pending"
                    ? "Has a pending website request awaiting review."
                    : "Has a website request currently in progress.",
            to: routes.ADMIN_WEBSITE_REQUESTS,
        });
    }

    if (!business.subscription) {
        items.push({ text: "No active subscription." });
    } else if (business.subscription.status === "PastDue") {
        items.push({ text: "Subscription payment is past due." });
    } else if (business.subscription.cancelAtPeriodEnd) {
        items.push({
            text: `Subscription won't renew — access ends ${new Date(
                business.subscription.currentPeriodEnd
            ).toLocaleDateString()}.`,
        });
    }

    if (inventorySummary && inventorySummary.outOfStockCount > 0) {
        items.push({
            text: `${inventorySummary.outOfStockCount} product${inventorySummary.outOfStockCount === 1 ? " is" : "s are"} out of stock.`,
        });
    }

    return items;
};

const BusinessNeedsAttention = ({ business, inventorySummary }: BusinessNeedsAttentionProps) => {
    const items = buildAttentionItems(business, inventorySummary);

    if (items.length === 0) {
        return null;
    }

    return (
        <section className="dashboard-table-card needs-attention-card">
            <div className="dashboard-table-header">
                <h3>Needs Attention</h3>
            </div>
            <ul className="needs-attention-list">
                {items.map((item, index) => (
                    <li key={index}>
                        {item.to ? <Link to={item.to}>{item.text}</Link> : item.text}
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default BusinessNeedsAttention;
