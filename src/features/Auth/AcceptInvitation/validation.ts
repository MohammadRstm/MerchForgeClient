import z from "zod";

export const acceptInvitationSchema = z.object({
    FirstName: z.string().trim().min(1, "First name is required"),
    LastName: z.string().trim().min(1, "Last name is required"),
    BusinessName: z.string().trim().min(1, "Business name is required"),
    Email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
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
    valueType: z.enum(["Text", "Number", "Boolean", "TextList"]),
    displayOrder: z.number(),
});

export const productAttributesSchema = z.array(productAttributeSchema);

export const acceptInvitationResponseSchema = z.object({
    authResponse: z.object({
        accessToken: z.string(),
        accessTokenExpiresAt: z.iso.datetime(),
    }),

    rawPassword: z.string(),
});
