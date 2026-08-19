import "./DashboardWidgets.css";

export type StatCard = {
    label: string;
    value: string | number;
};

type StatCardsProps = {
    cards: StatCard[];
};

const StatCards = ({ cards }: StatCardsProps) => {
    return (
        <div className="widget-stat-cards">
            {cards.map((card) => (
                <div className="widget-stat-card" key={card.label}>
                    <span className="widget-stat-card-value">{card.value}</span>
                    <span className="widget-stat-card-label">{card.label}</span>
                </div>
            ))}
        </div>
    );
};

export default StatCards;
