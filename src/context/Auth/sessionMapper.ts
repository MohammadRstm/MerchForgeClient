import type { LoginResponse } from "../../features/Auth/Login/types";
import type { UserSession } from "../../types/generalTypes";

// Login and refresh both return this same shape, so both AuthProvider (startup
// restoration) and the axios interceptor (silent refresh) build a session from it
// the same way.
export const buildSessionFromLoginResponse = (data: LoginResponse): UserSession => ({
    userId: data.userId,
    firstName: data.firstName,
    lastName: data.lastName,
    systemRole: data.systemRole,

    business: data.business,

    accessToken: data.authResponse.accessToken,
    accessTokenExpiresAt: data.authResponse.accessTokenExpiresAt,
});
