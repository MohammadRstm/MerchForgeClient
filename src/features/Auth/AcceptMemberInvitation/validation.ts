import z from "zod";

export const acceptMemberInvitationSchema = z
    .object({
        InvitationToken: z.string().trim().min(1, "This invitation link is missing its token"),
        Password: z.string().min(8, "Password must be at least 8 characters"),
        ConfirmPassword: z.string().min(1, "Confirm your password"),
        // Not pre-checked (see the initial state in useAcceptMemberInvitationPage)
        // and required true — the backend enforces the identical rule independently.
        AgreedToTerms: z
            .boolean()
            .refine((value) => value === true, {
                message: "You must agree to the Terms of Service and Privacy Policy to create an account.",
            }),
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
