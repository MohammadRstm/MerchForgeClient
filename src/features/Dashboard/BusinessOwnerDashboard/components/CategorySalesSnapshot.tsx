import { currencyFormatter } from "../utils/chartMetrics";
import type { CategoryPerformanceEntry } from "../types";

type CategorySalesSnapshotProps = {
    categories: CategoryPerformanceEntry[];
    isLoading: boolean;
};

/** Compact — the full breakdown with Units/Products toggles lives on the Products page's Category Performance section; this is revenue-only, top 5. */
const CategorySalesSnapshot = ({ categories, isLoading }: CategorySalesSnapshotProps) => {
    const maxRevenue = categories[0]?.revenue ?? 0;

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Sales by Category</h3>
            </div>

            {isLoading ? null : categories.length === 0 ? (
                <p className="business-dashboard-table-message">No category sales in the selected period yet.</p>
            ) : (
                <ul className="revenue-distribution-list">
                    {categories.map((category) => {
                        const widthPercent = maxRevenue > 0 ? (category.revenue / maxRevenue) * 100 : 0;

                        return (
                            <li key={category.categoryName}>
                                <div className="revenue-distribution-row revenue-distribution-row--static">
                                    <span className="revenue-distribution-name">{category.categoryName}</span>
                                    <div className="revenue-distribution-bar-track">
                                        <div className="revenue-distribution-bar" style={{ width: `${widthPercent}%` }} />
                                    </div>
                                    <span className="revenue-distribution-value">{currencyFormatter.format(category.revenue)}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
};

export default CategorySalesSnapshot;
