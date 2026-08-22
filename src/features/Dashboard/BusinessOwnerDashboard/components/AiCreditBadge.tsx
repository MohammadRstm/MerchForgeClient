type AiCreditBadgeProps = {
    creditsRemaining?: number;
    creditsGrantedTotal?: number;
    includedInPlan: boolean;
};

const SIZE = 15;
const STROKE_WIDTH = 2;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Rgb = [number, number, number];

const GREEN: Rgb = [22, 163, 74]; // up to 25% used
const YELLOW: Rgb = [234, 179, 8]; // approaching 75% used
const DARK_RED: Rgb = [153, 27, 27]; // approaching 100% used

const mix = (from: Rgb, to: Rgb, t: number): string => {
    const r = Math.round(from[0] + (to[0] - from[0]) * t);
    const g = Math.round(from[1] + (to[1] - from[1]) * t);
    const b = Math.round(from[2] + (to[2] - from[2]) * t);
    return `rgb(${r}, ${g}, ${b})`;
};

/** Green through most of the balance, sliding to yellow then dark red only as it actually runs low — a flat threshold would jump color with no warning. */
const ringColorForUsage = (usedFraction: number): string => {
    if (usedFraction <= 0.25) return mix(GREEN, GREEN, 0);
    if (usedFraction <= 0.75) return mix(GREEN, YELLOW, (usedFraction - 0.25) / 0.5);
    return mix(YELLOW, DARK_RED, (usedFraction - 0.75) / 0.25);
};

/**
 * A small usage ring beside the chat title, styled after the ones Claude Code
 * itself shows for rate limits: the filled arc is how much of the purchased
 * balance has been *used*, not how much is left, so it reads the same way a
 * "37% of your weekly limit" ring does — empty and green when fresh, sliding
 * through yellow and into dark red as the balance actually runs low.
 */
const AiCreditBadge = ({ creditsRemaining, creditsGrantedTotal, includedInPlan }: AiCreditBadgeProps) => {
    if (includedInPlan) {
        return (
            <span
                className="ai-chat-card__credit-ring ai-chat-card__credit-ring--unlimited"
                title="Unlimited — included in your plan"
                aria-label="Unlimited, included in your plan"
            >
                ∞
            </span>
        );
    }

    // Loading, or this business has never touched the feature — nothing honest to draw yet.
    if (creditsRemaining == null || !creditsGrantedTotal) {
        return null;
    }

    const usedFraction = Math.min(1, Math.max(0, (creditsGrantedTotal - creditsRemaining) / creditsGrantedTotal));

    return (
        <span
            className="ai-chat-card__credit-ring"
            title={`${creditsRemaining} of ${creditsGrantedTotal} credits left`}
            role="img"
            aria-label={`${creditsRemaining} of ${creditsGrantedTotal} credits left`}
        >
            <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
                <circle
                    className="ai-chat-card__credit-ring-track"
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                />
                <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    stroke={ringColorForUsage(usedFraction)}
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={CIRCUMFERENCE * (1 - usedFraction)}
                    // Starts the fill at 12 o'clock rather than 3 o'clock.
                    transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                    style={{ transition: "stroke-dashoffset 0.3s ease, stroke 0.3s ease" }}
                />
            </svg>
        </span>
    );
};

export default AiCreditBadge;
