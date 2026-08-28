import type { WebsiteCustomizableValueType } from "./types";

/**
 * The fixed vocabulary of storefront customization concepts a SuperAdmin can turn on
 * for a template — deliberately a closed list, not a free-typed key/label form. Two
 * things this solves at once: it stops an admin from inventing a field a template
 * doesn't actually have (the original bug — fashion-template got a "hero image" slot
 * it has no real equivalent for, because nothing forced anyone to check the template
 * before registering the key), and it gives every template the same stable
 * vocabulary, so a developer implementing a new template's storefront code always
 * knows exactly what business.templateFields.heroImage etc. means without having to
 * go compare it against some other template's one-off naming.
 *
 * key/label/valueType are fixed here — never typed by an admin. `description` is
 * shown next to the checkbox so the decision is "does this template actually have
 * this," not "what should I call this." `helpText` becomes the owner-facing hint on
 * the customization form (WebsiteTemplateCustomizableComponent.HelpText) when a field
 * is turned on; defaults to `description` when omitted.
 *
 * Adding a new concept later is a one-line addition here, not a schema change — the
 * backend catalogue table doesn't care where a key came from.
 */
export interface WebsiteCustomizableFieldCatalogueEntry {
    key: string;
    label: string;
    valueType: WebsiteCustomizableValueType;
    category: string;
    description: string;
    helpText?: string;
}

export const WEBSITE_CUSTOMIZABLE_FIELD_CATALOGUE: WebsiteCustomizableFieldCatalogueEntry[] = [
    // ---- Hero / homepage banner ----
    {
        key: "heroImage",
        label: "Hero image",
        valueType: "Image",
        category: "Hero & homepage",
        description: "The main large image at the top of the homepage.",
    },
    {
        key: "heroHeadline",
        label: "Hero headline",
        valueType: "Text",
        category: "Hero & homepage",
        description: "The short, bold headline shown over the hero image.",
    },
    {
        key: "heroSubheading",
        label: "Hero subheading",
        valueType: "Text",
        category: "Hero & homepage",
        description: "Smaller supporting text shown under the hero headline.",
    },
    {
        key: "heroCallToAction",
        label: "Hero call-to-action button",
        valueType: "Link",
        category: "Hero & homepage",
        description: "The button in the hero section, with its own label and destination link.",
    },

    // ---- Promotional banner ----
    {
        key: "promoBannerImage",
        label: "Promo banner image",
        valueType: "Image",
        category: "Promotional banner",
        description: "Image used in a secondary promotional banner section, further down the homepage.",
    },
    {
        key: "promoBannerText",
        label: "Promo banner heading",
        valueType: "Text",
        category: "Promotional banner",
        description: "Heading text shown in the promotional banner.",
    },
    {
        key: "promoBannerSubtext",
        label: "Promo banner subtext",
        valueType: "Text",
        category: "Promotional banner",
        description: "Supporting text shown under the promotional banner heading.",
    },

    // ---- About / brand story ----
    {
        key: "aboutImage",
        label: "About section image",
        valueType: "Image",
        category: "About & story",
        description: "Image shown in the \"About us\" or brand-story section.",
    },
    {
        key: "aboutText",
        label: "About section text",
        valueType: "Textarea",
        category: "About & story",
        description: "Longer paragraph text for the \"About us\" or brand-story section.",
    },

    // ---- Announcement bar ----
    {
        key: "announcementText",
        label: "Announcement bar text",
        valueType: "Text",
        category: "Announcement bar",
        description: "Short message in a thin bar at the very top of the site, e.g. \"Free shipping over $50.\"",
    },
    {
        key: "announcementLink",
        label: "Announcement bar link",
        valueType: "Link",
        category: "Announcement bar",
        description: "Optional button/link attached to the announcement bar.",
    },

    // ---- Featured collection ----
    {
        key: "featuredCollectionTitle",
        label: "Featured collection title",
        valueType: "Text",
        category: "Featured collection",
        description: "Heading shown above a featured or curated product collection.",
    },

    // ---- Newsletter ----
    {
        key: "newsletterHeading",
        label: "Newsletter heading",
        valueType: "Text",
        category: "Newsletter",
        description: "Heading text on the newsletter signup section.",
    },
    {
        key: "newsletterSubtext",
        label: "Newsletter subtext",
        valueType: "Text",
        category: "Newsletter",
        description: "Supporting text on the newsletter signup section.",
    },

    // ---- Footer ----
    {
        key: "footerTagline",
        label: "Footer tagline",
        valueType: "Textarea",
        category: "Footer",
        description: "Short brand description shown in the site footer.",
    },

    // ---- Trust / social proof ----
    {
        key: "testimonialQuote",
        label: "Featured testimonial quote",
        valueType: "Textarea",
        category: "Trust & social proof",
        description: "A featured customer quote or testimonial shown on the homepage.",
    },
    {
        key: "testimonialAuthor",
        label: "Featured testimonial author",
        valueType: "Text",
        category: "Trust & social proof",
        description: "Name/attribution shown under the featured testimonial.",
    },
];
