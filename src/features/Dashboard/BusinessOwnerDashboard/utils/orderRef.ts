/** A short, human-friendly order reference derived from the order's real id — not a separate stored field. */
export const shortOrderRef = (orderId: string) => `MF-${orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
