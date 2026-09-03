import z from "zod";

export const acceptInvitationSchema = z
    .object({
        FirstName: z.string().trim().min(1, "First name is required"),
        LastName: z.string().trim().min(1, "Last name is required"),
        BusinessName: z.string().trim().min(1, "Business name is required"),
        Email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
        // Chosen here, not generated server-side — this is the account's real
        // password from the start, never shown back or emailed anywhere.
        Password: z.string().min(8, "Password must be at least 8 characters"),
        ConfirmPassword: z.string().min(1, "Confirm your password"),
        InvitationToken: z.string().trim(),
        BusinessDomainId: z.string().trim().min(1, "Select what your business sells"),
        // Names only. The backend generates slugs and rejects anything that duplicates
        // an existing platform category, so the form never invents ids.
        NewCategoryNames: z
            .array(z.string().trim().min(1).max(100))
            .max(20, "Add at most 20 custom categories"),
        // Keys only. The backend resolves them against the domain's catalogue and owns
        // the resulting metadata shape, so the form never constructs the schema itself.
        SelectedProductAttributeKeys: z.array(z.string().trim().min(1)),
        // Not pre-checked (see INITIAL_ACCEPT_INVITATION_FORM_DATA) and required
        // true — the backend enforces the identical rule independently.
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

export const domainSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
});

export const domainsSchema = z.array(domainSchema);

export const domainCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
});

export const domainCategoriesSchema = z.array(domainCategorySchema);

export const productAttributeSchema = z.object({
    key: z.string(),
    label: z.string(),
    valueType: z.enum(["Text", "Number", "Boolean", "TextList", "ColorList"]),
    displayOrder: z.number(),
});

export const productAttributesSchema = z.array(productAttributeSchema);

export const acceptInvitationResponseSchema = z.object({
    authResponse: z.object({
        accessToken: z.string(),
        accessTokenExpiresAt: z.iso.datetime(),
    }),
});
