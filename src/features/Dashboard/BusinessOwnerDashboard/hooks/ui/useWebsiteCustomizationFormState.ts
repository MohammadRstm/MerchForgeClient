import { useCallback, useEffect, useState } from "react";
import type { SaveWebsiteCustomizationDraftPayload } from "../../../../../services/api/businessDashboard.api";
import {
    WEEK_DAYS,
    type WebsiteCustomizationDraft,
    type WebsiteCustomizationFormValues,
    type WebsiteCustomizationHoursDayFormValue,
    type WebsiteCustomizationTemplateFieldValue,
    type WebsiteTemplateCustomizableComponent,
    type WeekDay,
} from "../../types";

const EMPTY_DAY: WebsiteCustomizationHoursDayFormValue = { closed: false, open: "", close: "" };

const EMPTY_FORM: WebsiteCustomizationFormValues = {
    tagline: "",
    description: "",
    logoUrl: "",
    faviconUrl: "",
    contactEmail: "",
    contactPhone: "",
    whatsAppNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    socialLinks: { facebook: "", instagram: "", twitter: "", tikTok: "", youTube: "", linkedIn: "" },
    businessHours: {
        monday: EMPTY_DAY,
        tuesday: EMPTY_DAY,
        wednesday: EMPTY_DAY,
        thursday: EMPTY_DAY,
        friday: EMPTY_DAY,
        saturday: EMPTY_DAY,
        sunday: EMPTY_DAY,
    },
    primaryColor: "",
    templateFields: {},
};

const draftToFormValues = (
    draft: WebsiteCustomizationDraft,
    fields: WebsiteTemplateCustomizableComponent[]
): WebsiteCustomizationFormValues => {
    const businessHours = {} as Record<WeekDay, WebsiteCustomizationHoursDayFormValue>;

    for (const day of WEEK_DAYS) {
        const value = draft.businessHours[day];
        businessHours[day] = value
            ? { closed: value.closed, open: value.open ?? "", close: value.close ?? "" }
            : EMPTY_DAY;
    }

    const templateFields: Record<string, WebsiteCustomizationTemplateFieldValue> = {};

    for (const field of fields) {
        const raw = draft.templateFields[field.key];

        if (field.valueType === "Boolean") {
            templateFields[field.key] = raw === true;
        } else if (field.valueType === "Link") {
            const link = raw as { text?: unknown; url?: unknown } | undefined;
            templateFields[field.key] = {
                text: typeof link?.text === "string" ? link.text : "",
                url: typeof link?.url === "string" ? link.url : "",
            };
        } else {
            templateFields[field.key] = raw == null ? "" : String(raw);
        }
    }

    return {
        tagline: draft.tagline ?? "",
        description: draft.description ?? "",
        logoUrl: draft.logoUrl ?? "",
        faviconUrl: draft.faviconUrl ?? "",
        contactEmail: draft.contactEmail ?? "",
        contactPhone: draft.contactPhone ?? "",
        whatsAppNumber: draft.whatsAppNumber ?? "",
        addressLine1: draft.addressLine1 ?? "",
        addressLine2: draft.addressLine2 ?? "",
        city: draft.city ?? "",
        state: draft.state ?? "",
        postalCode: draft.postalCode ?? "",
        country: draft.country ?? "",
        socialLinks: {
            facebook: draft.socialLinks.facebook ?? "",
            instagram: draft.socialLinks.instagram ?? "",
            twitter: draft.socialLinks.twitter ?? "",
            tikTok: draft.socialLinks.tikTok ?? "",
            youTube: draft.socialLinks.youTube ?? "",
            linkedIn: draft.socialLinks.linkedIn ?? "",
        },
        businessHours,
        primaryColor: draft.primaryColor ?? "",
        templateFields,
    };
};

/** Trims and converts blank to null — the shape every plain text field is sent as. */
const cleanOrNull = (value: string): string | null => {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
};

const toTemplateFieldsPayload = (
    values: Record<string, WebsiteCustomizationTemplateFieldValue>,
    fields: WebsiteTemplateCustomizableComponent[]
): Record<string, unknown> => {
    const result: Record<string, unknown> = {};

    for (const field of fields) {
        const raw = values[field.key];

        if (field.valueType === "Boolean") {
            // Sent even when false — for a yes/no field "no" is an answer, same
            // convention product metadata booleans already use.
            result[field.key] = raw === true;
            continue;
        }

        if (field.valueType === "Link") {
            const link = raw as { text: string; url: string } | undefined;
            const text = link?.text.trim();
            const url = link?.url.trim();
            if (text && url) {
                result[field.key] = { text, url };
            }
            continue;
        }

        const text = typeof raw === "string" ? raw.trim() : "";
        if (!text) continue;

        if (field.valueType === "Number") {
            const parsed = Number(text);
            if (!Number.isNaN(parsed)) result[field.key] = parsed;
            continue;
        }

        result[field.key] = text;
    }

    return result;
};

/**
 * Owns the customization form's editable state: every field as the string/boolean an
 * input naturally produces, converted to the draft save payload's real shape only on
 * submit. Mirrors useProductFormState's split between edited-form-shape and
 * wire-shape for exactly the same reason: numbers/booleans arrive as text from
 * inputs, and blank text means "not set" rather than an empty string on the wire.
 */
const useWebsiteCustomizationFormState = (
    draft: WebsiteCustomizationDraft | undefined,
    fields: WebsiteTemplateCustomizableComponent[]
) => {
    const [values, setValues] = useState<WebsiteCustomizationFormValues>(EMPTY_FORM);

    // Repopulates whenever the draft or the current template's catalogue changes —
    // a template switch (elsewhere in the dashboard) means an entirely different set
    // of template-field keys the next time this page loads.
    useEffect(() => {
        if (draft) {
            setValues(draftToFormValues(draft, fields));
        }
    }, [draft, fields]);

    const setField = useCallback(
        <K extends keyof Omit<WebsiteCustomizationFormValues, "socialLinks" | "businessHours" | "templateFields">>(
            key: K,
            value: WebsiteCustomizationFormValues[K]
        ) => {
            setValues((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const setSocialLink = useCallback(
        (platform: keyof WebsiteCustomizationFormValues["socialLinks"], value: string) => {
            setValues((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [platform]: value } }));
        },
        []
    );

    const setBusinessHoursDay = useCallback((day: WeekDay, value: WebsiteCustomizationHoursDayFormValue) => {
        setValues((prev) => ({ ...prev, businessHours: { ...prev.businessHours, [day]: value } }));
    }, []);

    const setTemplateField = useCallback((key: string, value: WebsiteCustomizationTemplateFieldValue) => {
        setValues((prev) => ({ ...prev, templateFields: { ...prev.templateFields, [key]: value } }));
    }, []);

    const toPayload = (): SaveWebsiteCustomizationDraftPayload => {
        const businessHours = {} as Record<WeekDay, WebsiteCustomizationHoursDayFormValue | null>;

        for (const day of WEEK_DAYS) {
            const value = values.businessHours[day];

            if (value.closed) {
                businessHours[day] = { closed: true, open: "", close: "" };
            } else if (!value.open.trim() && !value.close.trim()) {
                // Neither closed nor any time set — this day was never configured.
                businessHours[day] = null;
            } else {
                businessHours[day] = { closed: false, open: value.open.trim(), close: value.close.trim() };
            }
        }

        return {
            tagline: cleanOrNull(values.tagline),
            description: cleanOrNull(values.description),
            logoUrl: cleanOrNull(values.logoUrl),
            faviconUrl: cleanOrNull(values.faviconUrl),
            contactEmail: cleanOrNull(values.contactEmail),
            contactPhone: cleanOrNull(values.contactPhone),
            whatsAppNumber: cleanOrNull(values.whatsAppNumber),
            addressLine1: cleanOrNull(values.addressLine1),
            addressLine2: cleanOrNull(values.addressLine2),
            city: cleanOrNull(values.city),
            state: cleanOrNull(values.state),
            postalCode: cleanOrNull(values.postalCode),
            country: cleanOrNull(values.country),
            socialLinks: {
                facebook: cleanOrNull(values.socialLinks.facebook),
                instagram: cleanOrNull(values.socialLinks.instagram),
                twitter: cleanOrNull(values.socialLinks.twitter),
                tikTok: cleanOrNull(values.socialLinks.tikTok),
                youTube: cleanOrNull(values.socialLinks.youTube),
                linkedIn: cleanOrNull(values.socialLinks.linkedIn),
            },
            businessHours: {
                monday: businessHours.monday,
                tuesday: businessHours.tuesday,
                wednesday: businessHours.wednesday,
                thursday: businessHours.thursday,
                friday: businessHours.friday,
                saturday: businessHours.saturday,
                sunday: businessHours.sunday,
            },
            primaryColor: cleanOrNull(values.primaryColor)?.toUpperCase() ?? null,
            templateFields: toTemplateFieldsPayload(values.templateFields, fields),
        };
    };

    return {
        values,
        setField,
        setSocialLink,
        setBusinessHoursDay,
        setTemplateField,
        toPayload,
    };
};

export default useWebsiteCustomizationFormState;
