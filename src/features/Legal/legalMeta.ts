/**
 * Mirrors the backend's Constants/LegalDocumentVersions.cs. The two are not
 * programmatically linked — the document text lives here as static frontend
 * content, the backend only stores which version string a given account agreed
 * to — so this must be bumped by hand alongside the backend constant whenever a
 * document actually changes, and EFFECTIVE_DATE updated to match.
 */
export const LEGAL_VERSIONS = {
    termsOfService: "1.0",
    privacyPolicy: "1.0",
    acceptableUse: "1.0",
    aiTerms: "1.0",
} as const;

/**
 * A static date, not `new Date()` — every visitor must see the same "last
 * updated" date regardless of when they load the page, and it should only ever
 * change when a document actually changes, not on every deploy.
 */
export const LEGAL_EFFECTIVE_DATE = "September 3, 2026";
