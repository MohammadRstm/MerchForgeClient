import z from "zod";
import {
    acceptInvitationResponseSchema,
    acceptInvitationSchema,
    domainCategorySchema,
    domainSchema,
} from "./validation";

export type AcceptInvitationFormDataType = z.infer<typeof acceptInvitationSchema>;

export type AcceptInvitationResponse = z.infer<typeof acceptInvitationResponseSchema>;

export type Domain = z.infer<typeof domainSchema>;

export type DomainCategory = z.infer<typeof domainCategorySchema>;
