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

export const logoutService = async () : Promise<void> =>{
    await unAuthenticatedApi.post(apiRoutes.AUTH_LOGOUT);
}