type ChangeIndicatorProps = {
    percent: number | null;
    /** Defaults to "vs previous period" — callers can shorten/customize for tighter layouts. */
    suffix?: string;
};

/** Omits itself entirely rather than showing a fabricated "0%" when there's nothing real to compare against. */
const ChangeIndicator = ({ percent, suffix = "vs previous period" }: ChangeIndicatorProps) => {
    if (percent === null) return null;

    const isPositive = percent >= 0;

    return (
        <span className={`analytics-change${isPositive ? " analytics-change--up" : " analytics-change--down"}`}>
            {isPositive ? "↑" : "↓"} {Math.abs(percent).toFixed(1)}%{suffix ? ` ${suffix}` : ""}
        </span>
    );
};

export default ChangeIndicator;
