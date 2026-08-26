/** Picking more than this many colors in one request isn't offered. */
export const MAX_COLORS = 4;

/**
 * Unlike angle prompts (a fixed preset catalog, see productImageAngles.ts), color
 * prompts are built at runtime from whatever hex colors the owner already picked
 * for the product — there's no finite list to enumerate ahead of time.
 */
export const buildColorImagePrompt = (hex: string): string =>
    `Recolor this product to ${hex}, keeping the exact same product, shape, materials, ` +
    `proportions, and camera angle — only the color changes. Let the background subtly ` +
    `shift toward ${hex} at low opacity, as a natural, understated ambient tint — not ` +
    `overly bright or saturated.`;
