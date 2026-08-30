import type { AnalyticsRangePreset } from "../types";

type RangeOption = { value: AnalyticsRangePreset; label: string };

type OverviewHeaderProps = {
    greeting: string;
    ownerFirstName: string;
    businessName: string;
    rangePreset: AnalyticsRangePreset;
    rangePresets: RangeOption[];
    onChangeRangePreset: (preset: AnalyticsRangePreset) => void;
    customFrom: string;
    customTo: string;
    onCustomFromChange: (value: string) => void;
    onCustomToChange: (value: string) => void;
};

/** Compact by design — the greeting is one line, the subtitle one line, so the fold isn't spent on chrome. */
const OverviewHeader = ({
    greeting,
    ownerFirstName,
    businessName,
    rangePreset,
    rangePresets,
    onChangeRangePreset,
    customFrom,
    customTo,
    onCustomFromChange,
    onCustomToChange,
}: OverviewHeaderProps) => {
    return (
        <div className="overview-header">
            <div className="business-dashboard-page-header overview-header__row">
                <div>
                    <h1 className="business-dashboard-heading">
                        {greeting}
                        {ownerFirstName ? `, ${ownerFirstName}` : ""}
                    </h1>
                    <p className="business-dashboard-page-subtitle">
                        Here's what's happening with {businessName || "your store"} today.
                    </p>
                </div>

                <div className="analytics-range-selector">
                    {rangePresets.map((preset) => (
                        <button
                            key={preset.value}
                            type="button"
                            className={`analytics-range-btn${rangePreset === preset.value ? " analytics-range-btn--active" : ""}`}
                            onClick={() => onChangeRangePreset(preset.value)}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            {rangePreset === "custom" && (
                <div className="orders-toolbar-date-range analytics-custom-range">
                    <input
                        type="date"
                        className="business-dashboard-form-input"
                        aria-label="From date"
                        value={customFrom}
                        onChange={(e) => onCustomFromChange(e.target.value)}
                    />
                    <span>to</span>
                    <input
                        type="date"
                        className="business-dashboard-form-input"
                        aria-label="To date"
                        value={customTo}
                        min={customFrom || undefined}
                        onChange={(e) => onCustomToChange(e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};

export default OverviewHeader;
