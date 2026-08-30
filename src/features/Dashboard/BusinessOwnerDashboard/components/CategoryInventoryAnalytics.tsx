import { useState } from "react";
import { currencyFormatter, numberFormatter } from "../utils/chartMetrics";
import type { InventoryCategoryPerformanceEntry } from "../types";

type CategoryMetric = "unitsInStock" | "unitsSold" | "revenue";

const METRIC_LABEL: Record<CategoryMetric, string> = {
    unitsInStock: "Units in Stock",
    unitsSold: "Units Sold",
    revenue: "Revenue",
};

const metricValue = (category: InventoryCategoryPerformanceEntry, metric: CategoryMetric) =>
    metric === "unitsInStock" ? category.unitsInStock : metric === "unitsSold" ? category.unitsSold : category.revenue;

const formatMetricValue = (category: InventoryCategoryPerformanceEntry, metric: CategoryMetric) =>
    metric === "revenue" ? currencyFormatter.format(category.revenue) : numberFormatter.format(metricValue(category, metric));

type CategoryInventoryAnalyticsProps = {
    categories: InventoryCategoryPerformanceEntry[];
};

/** Which categories are carrying the most stock, moving the fastest, or need attention — mirrors the Products page's Category Performance section, driven by inventory-specific totals instead of catalog performance. */
const CategoryInventoryAnalytics = ({ categories }: CategoryInventoryAnalyticsProps) => {
    const [metric, setMetric] = useState<CategoryMetric>("unitsInStock");

    const ranked = [...categories].sort((a, b) => metricValue(b, metric) - metricValue(a, metric));
    const maxValue = ranked[0] ? metricValue(ranked[0], metric) : 0;

    return (
        <section className="business-dashboard-table-card">
            <div className="analytics-header">
                <h3>Category Inventory</h3>

                <div className="analytics-range-selector">
                    {(["unitsInStock", "unitsSold", "revenue"] as CategoryMetric[]).map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={`analytics-range-btn${metric === option ? " analytics-range-btn--active" : ""}`}
                            onClick={() => setMetric(option)}
                        >
                            {METRIC_LABEL[option]}
                        </button>
                    ))}
                </div>
            </div>

            {ranked.length === 0 ? (
                <p className="business-dashboard-table-message">No categories yet.</p>
            ) : (
                <ul className="revenue-distribution-list">
                    {ranked.map((category) => {
                        const value = metricValue(category, metric);
                        const widthPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;

                        return (
                            <li key={category.categoryName}>
                                <div className="revenue-distribution-row revenue-distribution-row--static">
                                    <span className="revenue-distribution-name">
                                        {category.categoryName}
                                        <span className="category-performance-meta">
                                            {numberFormatter.format(category.trackedProductCount)} tracked
                                            {category.untrackedProductCount > 0
                                                ? ` · ${numberFormatter.format(category.untrackedProductCount)} untracked`
                                                : ""}
                                            {category.lowStockCount + category.outOfStockCount > 0
                                                ? ` · ${category.lowStockCount} low · ${category.outOfStockCount} out`
                                                : ""}
                                        </span>
                                    </span>
                                    <div className="revenue-distribution-bar-track">
                                        <div className="revenue-distribution-bar revenue-distribution-bar--secondary" style={{ width: `${widthPercent}%` }} />
                                    </div>
                                    <span className="revenue-distribution-value">{formatMetricValue(category, metric)}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
};

export default CategoryInventoryAnalytics;
