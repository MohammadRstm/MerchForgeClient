import type { LoginFormDataType, LoginResponse } from "../../features/Auth/Login/types";
import { loginResponseSchema } from "../../features/Auth/Login/validation";
import type { AcceptInvitationFormDataType } from "../../features/Auth/AcceptInvitation/types";
import { unAuthenticatedApi } from "./api";
import { apiRoutes } from "./apiRoutes";

export const loginService = async (loginFormData : LoginFormDataType) : Promise<LoginResponse> =>{
    const { data } = await unAuthenticatedApi.post<LoginResponse>(
        apiRoutes.AUTH_LOGIN ,
        loginFormData
    );

    return loginResponseSchema.parse(data);
}

export const acceptInvitationService = async (acceptInvitationFormData : AcceptInvitationFormDataType) : Promise<void> =>{
    await unAuthenticatedApi.post(
        apiRoutes.AUTH_ACCEPT_INVITATION,
        acceptInvitationFormData
    );
}