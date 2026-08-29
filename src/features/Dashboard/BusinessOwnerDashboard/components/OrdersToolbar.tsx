import type useOrdersTableState from "../hooks/ui/useOrdersTableState";
import type { OrderDateFilterPreset } from "../types";

const DATE_PRESETS: { value: OrderDateFilterPreset; label: string }[] = [
    { value: "all", label: "All time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "last7", label: "Last 7 days" },
    { value: "last30", label: "Last 30 days" },
    { value: "custom", label: "Custom range" },
];

type OrdersToolbarProps = {
    tableState: ReturnType<typeof useOrdersTableState>;
};

const OrdersToolbar = ({ tableState }: OrdersToolbarProps) => {
    const {
        searchInput,
        datePreset,
        customFrom,
        customTo,
        hasActiveFilters,
        handleSearchChange,
        handleDatePresetChange,
        handleCustomDateChange,
        clearFilters,
    } = tableState;

    return (
        <div className="orders-toolbar">
            <input
                type="text"
                className="business-dashboard-search-input"
                placeholder="Search orders..."
                aria-label="Search orders"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
            />

            <select
                className="business-dashboard-filter-select"
                aria-label="Filter by date"
                value={datePreset}
                onChange={(e) => handleDatePresetChange(e.target.value as OrderDateFilterPreset)}
            >
                {DATE_PRESETS.map((preset) => (
                    <option key={preset.value} value={preset.value}>
                        {preset.label}
                    </option>
                ))}
            </select>

            {datePreset === "custom" && (
                <div className="orders-toolbar-date-range">
                    <input
                        type="date"
                        className="business-dashboard-form-input"
                        aria-label="From date"
                        value={customFrom}
                        onChange={(e) => handleCustomDateChange("from", e.target.value)}
                    />
                    <span>to</span>
                    <input
                        type="date"
                        className="business-dashboard-form-input"
                        aria-label="To date"
                        value={customTo}
                        min={customFrom || undefined}
                        onChange={(e) => handleCustomDateChange("to", e.target.value)}
                    />
                </div>
            )}

            {hasActiveFilters && (
                <button type="button" className="business-dashboard-button-ghost" onClick={clearFilters}>
                    Clear filters
                </button>
            )}
        </div>
    );
};

export default OrdersToolbar;
