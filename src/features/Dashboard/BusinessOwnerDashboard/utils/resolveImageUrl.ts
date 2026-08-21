import { env } from "../../../../config/env";

/**
 * Stored image URLs are relative to the API, not the frontend, so they need the API
 * origin prefixed to render. Left relative on the wire so the same value stays
 * correct across environments.
 */
export const resolveImageUrl = (imageUrl: string): string =>
    imageUrl.startsWith("http") ? imageUrl : `${env.apiUrl.replace(/\/$/, "")}${imageUrl}`;
