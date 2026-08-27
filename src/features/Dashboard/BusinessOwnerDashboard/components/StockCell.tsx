const StockCell = ({ stockQuantity }: { stockQuantity: number | null }) => {
    if (stockQuantity === null) {
        return <span className="business-dashboard-badge">Not tracked</span>;
    }

    if (stockQuantity === 0) {
        return <span className="business-dashboard-badge business-dashboard-badge--status-cancelled">Out of stock</span>;
    }

    return <span className="business-dashboard-badge business-dashboard-badge--status-active">{stockQuantity} in stock</span>;
};

export default StockCell;
