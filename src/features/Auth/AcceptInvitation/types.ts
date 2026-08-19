import z from "zod";
import { acceptInvitationResponseSchema, acceptInvitationSchema } from "./validation";

export type AcceptInvitationFormDataType = z.infer<typeof acceptInvitationSchema>;

export type AcceptInvitationResponse = z.infer<typeof acceptInvitationResponseSchema>;