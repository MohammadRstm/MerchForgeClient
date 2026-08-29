import { useState } from "react";
import { currencyFormatter, numberFormatter } from "../utils/chartMetrics";
import type { CategoryPerformanceEntry } from "../types";

type CategoryMetric = "revenue" | "unitsSold" | "products";

const METRIC_LABEL: Record<CategoryMetric, string> = {
    revenue: "Revenue",
    unitsSold: "Units Sold",
    products: "Products",
};

const metricValue = (category: CategoryPerformanceEntry, metric: CategoryMetric) =>
    metric === "revenue" ? category.revenue : metric === "unitsSold" ? category.unitsSold : category.productCount;

const formatMetricValue = (category: CategoryPerformanceEntry, metric: CategoryMetric) =>
    metric === "revenue" ? currencyFormatter.format(category.revenue) : numberFormatter.format(metricValue(category, metric));

type CategoryPerformanceSectionProps = {
    categories: CategoryPerformanceEntry[];
};

/** Which categories are pulling their weight — one section covering both "catalog breakdown" and "switchable category performance", since they're the same underlying data viewed two ways. */
const CategoryPerformanceSection = ({ categories }: CategoryPerformanceSectionProps) => {
    const [metric, setMetric] = useState<CategoryMetric>("revenue");

    const ranked = [...categories].sort((a, b) => metricValue(b, metric) - metricValue(a, metric));
    const maxValue = ranked[0] ? metricValue(ranked[0], metric) : 0;

    return (
        <section className="business-dashboard-table-card">
            <div className="analytics-header">
                <h3>Category Performance</h3>

                <div className="analytics-range-selector">
                    {(["revenue", "unitsSold", "products"] as CategoryMetric[]).map((option) => (
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
                                            {numberFormatter.format(category.productCount)} product
                                            {category.productCount === 1 ? "" : "s"} · {numberFormatter.format(category.unitsSold)} sold
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

export default CategoryPerformanceSection;
