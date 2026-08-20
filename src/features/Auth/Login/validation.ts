import z from "zod";

export const loginSchema = z.object({
    Email: z
            .email()
            .trim(),

    Password:z
            .string()
            .trim()
            .min(8 , "Password must be at least 8 characters long"),
});

export const loginResponseSchema = z.object({
    authResponse: z.object({
        accessToken: z.string(),
        accessTokenExpiresAt: z.iso.datetime(),
    }),

    userId: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    systemRole:  z.enum([
        "User",
        "Admin",
        "SuperAdmin",
    ]),

    business: z.object({
        id: z.string().uuid(),
        name: z.string(),
        role: z.enum(["Owner", "Admin", "Member"]),
    }).nullable(),
});