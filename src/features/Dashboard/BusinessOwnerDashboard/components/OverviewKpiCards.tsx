import useCountUp from "../hooks/ui/useCountUp";
import ChangeIndicator from "./ChangeIndicator";
import { currencyFormatter, numberFormatter } from "../utils/chartMetrics";

type KpiCardProps = {
    label: string;
    value: number;
    format: "currency" | "number";
    changePercent: number | null;
};

const KpiCard = ({ label, value, format, changePercent }: KpiCardProps) => {
    const animated = useCountUp(value);
    const formatted = format === "currency" ? currencyFormatter.format(animated) : numberFormatter.format(Math.round(animated));

    return (
        <div className="overview-kpi-card">
            <span className="overview-kpi-card__label">{label}</span>
            <span className="overview-kpi-card__value">{formatted}</span>
            <ChangeIndicator percent={changePercent} />
        </div>
    );
};

type OverviewKpiCardsProps = {
    revenue: number;
    revenueChangePercent: number | null;
    orderCount: number;
    orderCountChangePercent: number | null;
    aov: number | null;
    aovChangePercent: number | null;
    productsSold: number;
    productsSoldChangePercent: number | null;
};

const OverviewKpiCards = ({
    revenue,
    revenueChangePercent,
    orderCount,
    orderCountChangePercent,
    aov,
    aovChangePercent,
    productsSold,
    productsSoldChangePercent,
}: OverviewKpiCardsProps) => {
    return (
        <div className="overview-kpi-grid">
            <KpiCard label="Revenue" value={revenue} format="currency" changePercent={revenueChangePercent} />
            <KpiCard label="Orders" value={orderCount} format="number" changePercent={orderCountChangePercent} />
            {aov !== null ? (
                <KpiCard label="Average Order Value" value={aov} format="currency" changePercent={aovChangePercent} />
            ) : (
                <div className="overview-kpi-card">
                    <span className="overview-kpi-card__label">Average Order Value</span>
                    <span className="overview-kpi-card__value overview-kpi-card__value--empty">—</span>
                </div>
            )}
            <KpiCard label="Products Sold" value={productsSold} format="number" changePercent={productsSoldChangePercent} />
        </div>
    );
};

export default OverviewKpiCards;
