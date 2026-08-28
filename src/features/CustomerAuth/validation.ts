import z from "zod";

// Shared response shape returned by login/signup/silent — see the backend's
// CustomerSessionResponse. exchangeCode is only ever populated when the request
// carried a returnUrl (i.e. the customer arrived here from a storefront's "sign in").
export const customerAuthResponseSchema = z.object({
    accessToken: z.string(),
    accessTokenExpiresAt: z.iso.datetime(),
});

export const customerSessionResponseSchema = z.object({
    authResponse: customerAuthResponseSchema,
    customerId: z.string().uuid(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    exchangeCode: z.string().nullable(),
});

export const customerLoginSchema = z.object({
    email: z.email().trim(),
    password: z.string().trim().min(8, "Password must be at least 8 characters long"),
});

export const customerSignupSchema = z.object({
    email: z.email().trim(),
    password: z.string().trim().min(8, "Password must be at least 8 characters long"),
    firstName: z.string().trim().min(1, "Enter your first name"),
    lastName: z.string().trim().min(1, "Enter your last name"),
});
