export const apiRoutes = {
    
    /** AUTH */
    AUTH_LOGIN : "/Auth/login",
    AUTH_ACCEPT_INVITATION : "/Auth/businessOwner/registration",
    AUTH_REFRESH : "/Auth/refresh",
    AUTH_LOGOUT : "/Auth/logout",

    /** DOMAINS (public reference data, read during registration) */
    DOMAINS : "/domains",
    DOMAIN_CATEGORIES : (domainId : string) => `/domains/${domainId}/categories`,
    DOMAIN_PRODUCT_ATTRIBUTES : (domainId : string) => `/domains/${domainId}/product-attributes`,

    /** USER */
    USER_PROFILE : "/profile",

    /** INVITATIONS */
    INVITATION_BUSINESS_OWNER : "/Invitation/business-owner",

    /** DASHBOARD */
    DASHBOARD_STATS : "/Dashboard/stats",
    DASHBOARD_USERS : "/Dashboard/users",
    DASHBOARD_BUSINESSES : "/Dashboard/businesses",
    DASHBOARD_REVOKE_USER_SESSIONS : (userId : string) => `/Dashboard/users/${userId}/revoke-sessions`,
    DASHBOARD_WEBSITE_TEMPLATES : "/Dashboard/website-templates",

    /** BUSINESS DASHBOARD */
    BUSINESS_DASHBOARD_STATS : (businessId : string) => `/businesses/${businessId}/dashboard/stats`,
    BUSINESS_DASHBOARD_PRODUCTS : (businessId : string) => `/businesses/${businessId}/dashboard/products`,
    BUSINESS_DASHBOARD_MEMBERS : (businessId : string) => `/businesses/${businessId}/dashboard/members`,
    BUSINESS_DASHBOARD_SUBSCRIPTION : (businessId : string) => `/businesses/${businessId}/dashboard/subscription`,
    BUSINESS_DASHBOARD_PRODUCT_FORM : (businessId : string) => `/businesses/${businessId}/dashboard/product-form`,
    BUSINESS_DASHBOARD_PRODUCT : (businessId : string, productId : string) => `/businesses/${businessId}/dashboard/products/${productId}`,
    BUSINESS_DASHBOARD_PRODUCT_IMAGE : (businessId : string) => `/businesses/${businessId}/dashboard/products/image`,
    BUSINESS_DASHBOARD_WEBSITE_TEMPLATE : (businessId : string) => `/businesses/${businessId}/dashboard/website-template`,
    BUSINESS_DASHBOARD_FEATURES : (businessId : string) => `/businesses/${businessId}/dashboard/features`,
    BUSINESS_DASHBOARD_FEATURE_PURCHASES : (businessId : string) => `/businesses/${businessId}/dashboard/features/purchases`,

    /** AI PRODUCT DRAFTS */
    PRODUCT_DRAFTS : (businessId : string) => `/businesses/${businessId}/dashboard/product-drafts`,
    PRODUCT_DRAFT : (businessId : string, draftId : string) => `/businesses/${businessId}/dashboard/product-drafts/${draftId}`,
    PRODUCT_DRAFT_VOICE : (businessId : string, draftId : string) => `/businesses/${businessId}/dashboard/product-drafts/${draftId}/voice`,
    PRODUCT_DRAFT_IMAGE : (businessId : string, draftId : string) => `/businesses/${businessId}/dashboard/product-drafts/${draftId}/image`,
    PRODUCT_DRAFT_IMAGE_APPROVAL : (businessId : string, draftId : string) => `/businesses/${businessId}/dashboard/product-drafts/${draftId}/image-approval`,
    PRODUCT_DRAFT_CONFIRM : (businessId : string, draftId : string) => `/businesses/${businessId}/dashboard/product-drafts/${draftId}/confirm`,
    PRODUCT_DRAFT_CANCEL : (businessId : string, draftId : string) => `/businesses/${businessId}/dashboard/product-drafts/${draftId}/cancel`,

    /** AI IMAGE EDITING */
    IMAGE_EDITS : (businessId : string) => `/businesses/${businessId}/dashboard/image-edits`,

}