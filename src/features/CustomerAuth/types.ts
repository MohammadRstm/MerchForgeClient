import z from "zod";
import { customerLoginSchema, customerSessionResponseSchema, customerSignupSchema } from "./validation";

export type CustomerSessionResponse = z.infer<typeof customerSessionResponseSchema>;

export type CustomerLoginFormDataType = z.infer<typeof customerLoginSchema>;
export type CustomerSignupFormDataType = z.infer<typeof customerSignupSchema>;
