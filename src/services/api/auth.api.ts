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