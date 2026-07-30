import type z from "zod";
import type { signupResponseScehma, signupSchema } from "./validation";

export type SignupFormDataType = z.infer<typeof signupSchema>;

export type SignupResponseType = z.infer<typeof signupResponseScehma>;
