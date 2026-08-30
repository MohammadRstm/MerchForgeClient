import "./DashboardWidgets.css";

export type StatCard = {
    label: string;
    value: string | number;
    onClick?: () => void;
    isActive?: boolean;
};

type StatCardsProps = {
    cards: StatCard[];
};

const StatCards = ({ cards }: StatCardsProps) => {
    return (
        <div className="widget-stat-cards">
            {cards.map((card) => (
                <div
                    className={
                        "widget-stat-card" +
                        (card.onClick ? " widget-stat-card--clickable" : "") +
                        (card.isActive ? " widget-stat-card--active" : "")
                    }
                    key={card.label}
                    role={card.onClick ? "button" : undefined}
                    tabIndex={card.onClick ? 0 : undefined}
                    onClick={card.onClick}
                    onKeyDown={
                        card.onClick
                            ? (e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      card.onClick!();
                                  }
                              }
                            : undefined
                    }
                >
                    <span className="widget-stat-card-value">{card.value}</span>
                    <span className="widget-stat-card-label">{card.label}</span>
                </div>
            ))}
        </div>
    );
};

export default StatCards;
