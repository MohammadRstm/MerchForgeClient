import { unAuthenticatedApi } from "../../../../services/api";
import type { SignupFormDataType } from "../types";
import { signupResponseScehma } from "../validation";

export const registerUser = async (signupFormData : SignupFormDataType) =>{
    const { data } = await unAuthenticatedApi.post("/register" , signupFormData);

    return signupResponseScehma.parse(data);
}