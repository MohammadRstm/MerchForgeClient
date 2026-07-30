import { unAuthenticatedApi } from "../../../../services/api";
import type { LoginFormDataType, LoginResponse } from "../types";
import { loginResponseSchema } from "../validation";

export const loginService = async (loginFormData : LoginFormDataType) : Promise<LoginResponse> =>{
    const { data } = await unAuthenticatedApi.post<LoginResponse>(
        "/login" ,
        loginFormData
    );

    return loginResponseSchema.parse(data);
}