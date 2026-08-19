import type { LoginFormDataType, LoginResponse } from "../../features/Auth/Login/types";
import { loginResponseSchema } from "../../features/Auth/Login/validation";
import type { AcceptInvitationFormDataType, AcceptInvitationResponse } from "../../features/Auth/AcceptInvitation/types";
import { acceptInvitationResponseSchema } from "../../features/Auth/AcceptInvitation/validation";
import { unAuthenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

export const loginService = async (loginFormData : LoginFormDataType) : Promise<LoginResponse> =>{
    const { data } = await unAuthenticatedApi.post<LoginResponse>(
        apiRoutes.AUTH_LOGIN ,
        loginFormData
    );

    return loginResponseSchema.parse(data);
}

export const acceptInvitationService = async (acceptInvitationFormData : AcceptInvitationFormDataType) : Promise<AcceptInvitationResponse> =>{
    const { data } = await unAuthenticatedApi.post<AcceptInvitationResponse>(
        apiRoutes.AUTH_ACCEPT_INVITATION,
        acceptInvitationFormData
    );

    return acceptInvitationResponseSchema.parse(data);
}

// The refresh token itself is never in this response — it's an HttpOnly cookie the
// browser sends automatically. This is called both by the request interceptor's
// refresh-on-401 flow and by AuthProvider on app startup to restore the session.
export const refreshSessionService = async () : Promise<LoginResponse> =>{
    const { data } = await unAuthenticatedApi.post<LoginResponse>(
        apiRoutes.AUTH_REFRESH
    );

    return loginResponseSchema.parse(data);
}

// Refresh rotates the token server-side, so two concurrent refresh calls would race:
// whichever reaches the server second gets rejected because the first already
// invalidated the cookie's token. This dedupes at the module level (not per-caller)
// so it protects against every source of concurrent refreshes — simultaneous 401
// retries in the axios interceptor, and React StrictMode's double-invoked effects
// double-firing AuthProvider's startup restore — by having every caller share one
// in-flight request instead of firing their own.
let inFlightSessionRefresh: Promise<LoginResponse> | null = null;

export const refreshSessionOnce = () : Promise<LoginResponse> =>{
    if (!inFlightSessionRefresh) {
        inFlightSessionRefresh = refreshSessionService().finally(() => {
            inFlightSessionRefresh = null;
        });
    }

    return inFlightSessionRefresh;
}

export const logoutService = async () : Promise<void> =>{
    await unAuthenticatedApi.post(apiRoutes.AUTH_LOGOUT);
}