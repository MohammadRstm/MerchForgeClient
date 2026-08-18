import z from "zod";

export const loginSchema = z.object({
    Email: z
            .email()
            .trim(),

    Password:z
            .string()
            .trim()
            .min(8 , "Password must be atleast 8 characters long"),
});

export const loginResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),

    accessTokenExpiresAt : z.iso.datetime(),
});