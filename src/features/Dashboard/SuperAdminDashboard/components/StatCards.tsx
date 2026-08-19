import type { DashboardStatsResponse } from "../types";

type StatCardsProps = {
    stats: DashboardStatsResponse;
};

const StatCards = ({ stats }: StatCardsProps) => {
    const cards = [
        { label: "Total Users", value: stats.totalUsers },
        { label: "Total Businesses", value: stats.totalBusinesses },
        { label: "Total Products", value: stats.totalProducts },
        { label: "Product Drafts", value: stats.totalProductDrafts },
        { label: "Pending Invitations", value: stats.pendingInvitations },
    ];

    return (
        <div className="dashboard-stat-cards">
            {cards.map((card) => (
                <div className="dashboard-stat-card" key={card.label}>
                    <span className="dashboard-stat-card-value">{card.value}</span>
                    <span className="dashboard-stat-card-label">{card.label}</span>
                </div>
            ))}
        </div>
    );
};

export default StatCards;
