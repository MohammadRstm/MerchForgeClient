import { classifyRisk } from "../utils/inventoryRisk";
import type { InventoryProductPerformanceEntry, InventoryRiskLevel } from "../types";

const MAX_LISTED = 6;

const RISK_LABEL: Record<InventoryRiskLevel, string> = {
    OutOfStock: "Out of Stock",
    Critical: "Critical",
    Watch: "Watch",
    Healthy: "Healthy",
};

const RISK_BADGE_CLASS: Record<InventoryRiskLevel, string> = {
    OutOfStock: "business-dashboard-badge--status-cancelled",
    Critical: "business-dashboard-badge--status-cancelled",
    Watch: "business-dashboard-badge--status-pastdue",
    Healthy: "business-dashboard-badge--status-active",
};

type InventoryRiskSectionProps = {
    products: InventoryProductPerformanceEntry[];
    threshold: number;
    periodDays: number;
};

const InventoryRiskSection = ({ products, threshold, periodDays }: InventoryRiskSectionProps) => {
    const classified = products
        .map((p) => ({ product: p, risk: classifyRisk(p, threshold, periodDays) }))
        .filter((entry): entry is { product: InventoryProductPerformanceEntry; risk: InventoryRiskLevel } => entry.risk !== null);

    const counts: Record<InventoryRiskLevel, number> = { OutOfStock: 0, Critical: 0, Watch: 0, Healthy: 0 };
    for (const entry of classified) counts[entry.risk]++;

    const actionable = classified
        .filter((entry) => entry.risk === "Critical" || entry.risk === "OutOfStock")
        .sort((a, b) => (a.product.stockQuantity ?? 0) - (b.product.stockQuantity ?? 0))
        .slice(0, MAX_LISTED);

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Inventory Risk</h3>
            </div>

            <ul className="revenue-distribution-list inventory-risk-summary">
                {(Object.keys(RISK_LABEL) as InventoryRiskLevel[]).map((risk) => (
                    <li key={risk} className="inventory-risk-summary-item">
                        <span className={`business-dashboard-badge ${RISK_BADGE_CLASS[risk]}`}>{RISK_LABEL[risk]}</span>
                        <span className="inventory-risk-summary-count">{counts[risk]}</span>
                    </li>
                ))}
            </ul>

            {actionable.length === 0 ? (
                <p className="business-dashboard-table-message">No tracked products need urgent restocking right now.</p>
            ) : (
                <ul className="needs-attention-list">
                    {actionable.map(({ product, risk }) => (
                        <li key={product.productId} className="needs-attention-item">
                            <span>
                                <strong>{product.title}</strong>
                                <br />
                                <span className={`business-dashboard-badge ${RISK_BADGE_CLASS[risk]}`}>{RISK_LABEL[risk]}</span>{" "}
                                {product.stockQuantity} unit{product.stockQuantity === 1 ? "" : "s"} left
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default InventoryRiskSection;
