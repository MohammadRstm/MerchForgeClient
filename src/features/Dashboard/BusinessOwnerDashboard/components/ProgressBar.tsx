type ProgressBarProps = {
    percent: number;
    tone?: "default" | "warning" | "critical";
};

/** A plain animated fill bar — percent is expected pre-clamped to [0, 100] by the caller, which also knows whether the underlying value is even meaningful (e.g. unlimited). */
const ProgressBar = ({ percent, tone = "default" }: ProgressBarProps) => {
    return (
        <div className="usage-progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
            <div className={`usage-progress-fill usage-progress-fill--${tone}`} style={{ width: `${percent}%` }} />
        </div>
    );
};

export default ProgressBar;
