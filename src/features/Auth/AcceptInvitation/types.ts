import z from "zod";
import { acceptInvitationSchema } from "./validation";

export type AcceptInvitationFormDataType = z.infer<typeof acceptInvitationSchema>;
