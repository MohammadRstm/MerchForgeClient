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
    // Not pre-checked (see INITIAL_CUSTOMER_SIGNUP_FORM_DATA) and required true —
    // the backend enforces the identical rule independently, so a request that
    // somehow bypassed this form-level check would still be refused server-side.
    agreedToTerms: z
        .boolean()
        .refine((value) => value === true, {
            message: "You must agree to the Terms of Service and Privacy Policy to create an account.",
        }),
});
