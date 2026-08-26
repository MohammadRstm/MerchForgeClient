export type QuickImageEditKey = "remove-background" | "enhance-photo";

export type QuickImageEditAction = {
    key: QuickImageEditKey;
    label: string;
    prompt: string;
};

/**
 * Fixed, one-click prompts — unlike the freeform edit chat, there's nothing for
 * the owner to type here. Both keep the product itself untouched by instruction,
 * the same "only this one thing changes" clause the angle/color prompts use.
 */
export const QUICK_IMAGE_EDIT_ACTIONS: Record<QuickImageEditKey, QuickImageEditAction> = {
    "remove-background": {
        key: "remove-background",
        label: "Remove background",
        prompt:
            "Remove the background from this product photo and replace it with a clean, neutral " +
            "white studio background. Keep the product itself completely unchanged — same colors, " +
            "shape, and details — only the background changes.",
    },
    "enhance-photo": {
        key: "enhance-photo",
        label: "Enhance photo",
        prompt:
            "Improve this product photo's lighting, sharpness, and color balance so it looks like a " +
            "professional product shot. Keep the product and composition exactly the same — only the " +
            "photo quality changes, don't add or remove anything.",
    },
};
