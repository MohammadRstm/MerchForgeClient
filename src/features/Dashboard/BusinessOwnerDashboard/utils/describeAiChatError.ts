import { ApiError } from "../../../../Error/ApiError";

/**
 * Shared between the AI product chat and the image-edit chat: both are gated by the
 * same feature-authorization policy, and a 403 from either always means the same
 * thing — the business's plan doesn't include this feature and its credit balance
 * (if any) has run out. The policy failure itself carries no response body, so this
 * is the one place that turns a bare 403 into something the owner can act on,
 * rather than the generic network-error fallback toApiError would otherwise produce.
 */
export const describeAiChatError = (e: unknown, fallback: string): string => {
    if (e instanceof ApiError && e.status === 403) {
        return "You're out of credits for this feature. Close this and buy more from Features to continue.";
    }

    return e instanceof ApiError ? e.message : fallback;
};
