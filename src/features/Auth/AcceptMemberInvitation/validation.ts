import z from "zod";

export const acceptMemberInvitationSchema = z
    .object({
        InvitationToken: z.string().trim().min(1, "This invitation link is missing its token"),
        Password: z.string().min(8, "Password must be at least 8 characters"),
        ConfirmPassword: z.string().min(1, "Confirm your password"),
    })
    .refine((data) => data.Password === data.ConfirmPassword, {
        message: "Passwords don't match",
        path: ["ConfirmPassword"],
    });

export const acceptMemberInvitationResponseSchema = z.object({
    authResponse: z.object({
        accessToken: z.string(),
        accessTokenExpiresAt: z.iso.datetime(),
    }),
});
