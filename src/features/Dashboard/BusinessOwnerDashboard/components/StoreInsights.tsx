import type { OverviewInsight } from "../utils/overviewInsights";

type StoreInsightsProps = {
    insights: OverviewInsight[];
};

const StoreInsights = ({ insights }: StoreInsightsProps) => {
    if (insights.length === 0) return null;

    return (
        <section className="business-dashboard-table-card">
            <div className="business-dashboard-table-header">
                <h3>Store Insights</h3>
            </div>

            <ul className="product-insights overview-insights">
                {insights.map((insight) => (
                    <li key={insight.key} className="product-insight-card">
                        <span className="product-insight-text">{insight.text}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default StoreInsights;
