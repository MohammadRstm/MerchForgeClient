import z from "zod";
import { acceptMemberInvitationResponseSchema, acceptMemberInvitationSchema } from "./validation";

export type AcceptMemberInvitationFormDataType = z.infer<typeof acceptMemberInvitationSchema>;

export type AcceptMemberInvitationResponse = z.infer<typeof acceptMemberInvitationResponseSchema>;
