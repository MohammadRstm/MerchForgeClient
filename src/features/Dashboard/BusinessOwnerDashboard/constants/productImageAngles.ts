export type ProductImageAngle = {
    key: string;
    /** Shown on the picker chip. */
    label: string;
    /** Sent to the AI image-editing endpoint as the edit instruction. */
    prompt: string;
};

/**
 * Strictly camera angle/perspective, nothing more elaborate — an open-ended request
 * ("make it look festive", "add a model wearing it") belongs in the existing
 * AI image-editing chat, which stays around specifically for asks like that.
 *
 * Each prompt repeats the same "keep everything else the same" clause so the four
 * generated angles read as photos of the same product, not four different products.
 */
const KEEP_EVERYTHING_ELSE_THE_SAME =
    "Keep the exact same product, with the same colors, materials, proportions, and background style — only the camera angle changes.";

export const PRODUCT_IMAGE_ANGLES: ProductImageAngle[] = [
    {
        key: "front",
        label: "Front view",
        prompt: `Show this product from a direct front-facing view. ${KEEP_EVERYTHING_ELSE_THE_SAME}`,
    },
    {
        key: "back",
        label: "Back view",
        prompt: `Show this product from directly behind. ${KEEP_EVERYTHING_ELSE_THE_SAME}`,
    },
    {
        key: "left",
        label: "Left side",
        prompt: `Show this product from its left side profile. ${KEEP_EVERYTHING_ELSE_THE_SAME}`,
    },
    {
        key: "right",
        label: "Right side",
        prompt: `Show this product from its right side profile. ${KEEP_EVERYTHING_ELSE_THE_SAME}`,
    },
    {
        key: "three-quarter",
        label: "Three-quarter angle",
        prompt: `Show this product from a three-quarter, 45-degree angle view. ${KEEP_EVERYTHING_ELSE_THE_SAME}`,
    },
    {
        key: "top-down",
        label: "Top-down",
        prompt: `Show this product from directly above, a top-down bird's-eye view. ${KEEP_EVERYTHING_ELSE_THE_SAME}`,
    },
    {
        key: "bottom",
        label: "Bottom view",
        prompt: `Show this product from directly below, a bottom-up view. ${KEEP_EVERYTHING_ELSE_THE_SAME}`,
    },
    {
        key: "close-up",
        label: "Close-up detail",
        prompt: `Show a close-up detail shot of this product, highlighting its texture and material. ${KEEP_EVERYTHING_ELSE_THE_SAME}`,
    },
];

/** Picking more than this many angles in one request isn't offered. */
export const MAX_ANGLES = 4;
