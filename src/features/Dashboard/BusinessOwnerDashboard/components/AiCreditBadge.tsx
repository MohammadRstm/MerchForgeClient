type AiCreditBadgeProps = {
    creditsRemaining?: number;
    includedInPlan: boolean;
};

/** Shown in both AI chat headers so the owner can see how much they have left without leaving the conversation. */
const AiCreditBadge = ({ creditsRemaining, includedInPlan }: AiCreditBadgeProps) => {
    if (includedInPlan) {
        return <span className="ai-chat-card__credits">Unlimited</span>;
    }

    // Still loading, or this business has never touched this feature — nothing
    // useful to show yet rather than a misleading "0".
    if (creditsRemaining == null) {
        return null;
    }

    return (
        <span
            className={`ai-chat-card__credits${creditsRemaining === 0 ? " ai-chat-card__credits--empty" : ""}`}
        >
            {creditsRemaining} credit{creditsRemaining === 1 ? "" : "s"} left
        </span>
    );
};

export default AiCreditBadge;
