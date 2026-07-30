import type { LoginFormDataType, LoginResponse } from "../../features/Auth/Login/types";
import { loginResponseSchema } from "../../features/Auth/Login/validation";
import { unAuthenticatedApi } from "./api";

export const loginService = async (loginFormData : LoginFormDataType) : Promise<LoginResponse> =>{
    const { data } = await unAuthenticatedApi.post<LoginResponse>(
        "/login" ,
        loginFormData
    );

    return loginResponseSchema.parse(data);
}