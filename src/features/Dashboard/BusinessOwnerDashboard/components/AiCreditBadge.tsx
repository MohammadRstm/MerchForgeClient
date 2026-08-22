type AiCreditBadgeProps = {
    creditsRemaining?: number;
    creditsGrantedTotal?: number;
    includedInPlan: boolean;
};

const SIZE = 22;
const STROKE_WIDTH = 3;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * A small usage ring beside the chat title, styled after the ones Claude Code
 * itself shows for rate limits: the filled arc is how much of the purchased
 * balance has been *used*, not how much is left, so it reads the same way a
 * "37% of your weekly limit" ring does — empty when fresh, fills in as credits
 * are spent, full (and flagged) right when the owner is about to be blocked.
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
    const isEmpty = creditsRemaining === 0;

    return (
        <span
            className={`ai-chat-card__credit-ring${isEmpty ? " ai-chat-card__credit-ring--empty" : ""}`}
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
                    className="ai-chat-card__credit-ring-fill"
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={CIRCUMFERENCE * (1 - usedFraction)}
                    // Starts the fill at 12 o'clock rather than 3 o'clock.
                    transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                />
            </svg>
        </span>
    );
};

export default AiCreditBadge;
