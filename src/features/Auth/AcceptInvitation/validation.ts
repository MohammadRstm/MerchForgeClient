import z from "zod";

export const acceptInvitationSchema = z.object({
    FirstName: z.string().trim().min(1, "First name is required"),
    LastName: z.string().trim().min(1, "Last name is required"),
    BusinessName: z.string().trim().min(1, "Business name is required"),
    Email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
    InvitationToken: z.string().trim(),
});
