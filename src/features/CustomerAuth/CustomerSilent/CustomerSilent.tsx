import { useEffect } from "react";
import { customerSilentService } from "../../../services/api/customerAuth.api";

export const CUSTOMER_SILENT_MESSAGE_SOURCE = "merchforge-customer-silent";

export type CustomerSilentMessage =
    | {
          source: typeof CUSTOMER_SILENT_MESSAGE_SOURCE;
          status: "ok";
          accessToken: string;
          accessTokenExpiresAt: string;
          customer: {
              id: string;
              email: string;
              firstName: string;
              lastName: string;
          };
      }
    | {
          source: typeof CUSTOMER_SILENT_MESSAGE_SOURCE;
          status: "unauthenticated";
      };

/**
 * Minimal, invisible page — loaded inside a hidden iframe or a flash-popup by the
 * storefront SDK's silent-renewal chain, never seen by a customer directly. Its whole
 * job: read the platform-origin customerRefreshToken cookie (via /api/CustomerAuth/
 * silent, which behaves exactly like /refresh), and postMessage the result back to
 * whoever opened/framed it. The refresh token itself never leaves this page — only a
 * short-lived access token goes out, and only ever via postMessage, never a cookie
 * set on the caller's origin.
 */
const CustomerSilent = () => {
    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            // Only meaningful when framed cross-site; requestStorageAccess() itself
            // guards against being called from a non-framed top-level context (a
            // popup), so this is safe to attempt unconditionally. Its outcome isn't
            // branched on — regardless of whether access is granted, the /silent call
            // below either succeeds (cookie was readable) or 401s (it wasn't), and
            // that single signal is all the SDK's fallback chain needs.
            if (typeof document.requestStorageAccess === "function") {
                try {
                    await document.requestStorageAccess();
                } catch {
                    // Denied or unavailable — proceed anyway, see comment above.
                }
            }

            const target = window.opener ?? (window.parent !== window ? window.parent : null);

            // The SDK always passes its own origin so the result is only ever
            // delivered to the exact caller that requested it, never broadcast.
            const targetOrigin = new URLSearchParams(window.location.search).get("origin") ?? "*";

            if (!target) {
                return;
            }

            try {
                const session = await customerSilentService();

                if (cancelled) return;

                const message: CustomerSilentMessage = {
                    source: CUSTOMER_SILENT_MESSAGE_SOURCE,
                    status: "ok",
                    accessToken: session.authResponse.accessToken,
                    accessTokenExpiresAt: session.authResponse.accessTokenExpiresAt,
                    customer: {
                        id: session.customerId,
                        email: session.email,
                        firstName: session.firstName,
                        lastName: session.lastName,
                    },
                };

                target.postMessage(message, targetOrigin);
            } catch {
                if (cancelled) return;

                const message: CustomerSilentMessage = {
                    source: CUSTOMER_SILENT_MESSAGE_SOURCE,
                    status: "unauthenticated",
                };

                target.postMessage(message, targetOrigin);
            } finally {
                // Only a popup should close itself — an iframe closing its own window
                // would close the storefront tab that embeds it.
                if (window.opener) {
                    window.close();
                }
            }
        };

        run();

        return () => {
            cancelled = true;
        };
    }, []);

    return null;
};

export default CustomerSilent;
