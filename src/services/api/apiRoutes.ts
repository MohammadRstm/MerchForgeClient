export const apiRoutes = {
    
    /** AUTH */
    AUTH_LOGIN : "/Auth/login",
    AUTH_ACCEPT_INVITATION : "/Auth/businessOwner/registration",
    AUTH_REFRESH : "/Auth/refresh",
    AUTH_LOGOUT : "/Auth/logout",

    /** CUSTOMER AUTH — the platform's own login/signup/silent-renewal pages. Refresh/
     *  logout/exchange are deliberately not called from MerchForgeClient itself: refresh
     *  is what /silent uses internally on the server, exchange is storefront-SDK-only,
     *  and logout isn't exposed anywhere in this platform UI yet. */
    CUSTOMER_AUTH_LOGIN : "/CustomerAuth/login",
    CUSTOMER_AUTH_SIGNUP : "/CustomerAuth/signup",
    CUSTOMER_AUTH_SILENT : "/CustomerAuth/silent",

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
    DASHBOARD_BUSINESS_DETAIL : (businessId : string) => `/Dashboard/businesses/${businessId}`,
    DASHBOARD_BUSINESS_REVOKE_SESSIONS : (businessId : string) => `/Dashboard/businesses/${businessId}/revoke-sessions`,
    DASHBOARD_BUSINESS_METADATA_SHAPE : (businessId : string) => `/Dashboard/businesses/${businessId}/metadata-shape`,
    DASHBOARD_PRODUCT_ATTRIBUTES : "/Dashboard/product-attributes",
    DASHBOARD_PRODUCT_ATTRIBUTE : (id : string) => `/Dashboard/product-attributes/${id}`,
    DASHBOARD_PRODUCT_ATTRIBUTE_DEACTIVATE : (id : string) => `/Dashboard/product-attributes/${id}/deactivate`,
    DASHBOARD_PRODUCT_ATTRIBUTE_REACTIVATE : (id : string) => `/Dashboard/product-attributes/${id}/reactivate`,
    DASHBOARD_REVOKE_USER_SESSIONS : (userId : string) => `/Dashboard/users/${userId}/revoke-sessions`,
    DASHBOARD_CUSTOMERS : "/Dashboard/customers",
    DASHBOARD_CUSTOMER_DETAIL : (customerId : string) => `/Dashboard/customers/${customerId}`,
    DASHBOARD_WEBSITE_TEMPLATES : "/Dashboard/website-templates",
    DASHBOARD_WEBSITE_TEMPLATE_IMAGE : "/Dashboard/website-templates/image",
    DASHBOARD_WEBSITE_TEMPLATE : (templateId : string) => `/Dashboard/website-templates/${templateId}`,
    DASHBOARD_WEBSITE_TEMPLATE_DEACTIVATE : (templateId : string) => `/Dashboard/website-templates/${templateId}/deactivate`,
    DASHBOARD_WEBSITE_TEMPLATE_CUSTOMIZABLE_COMPONENTS : (templateId : string) => `/Dashboard/website-templates/${templateId}/customizable-components`,
    DASHBOARD_WEBSITE_TEMPLATE_CUSTOMIZABLE_COMPONENT : (templateId : string, id : string) => `/Dashboard/website-templates/${templateId}/customizable-components/${id}`,
    DASHBOARD_WEBSITE_TEMPLATE_CUSTOMIZABLE_COMPONENT_DEACTIVATE : (templateId : string, id : string) => `/Dashboard/website-templates/${templateId}/customizable-components/${id}/deactivate`,
    DASHBOARD_WEBSITE_TEMPLATE_CUSTOMIZABLE_COMPONENT_REACTIVATE : (templateId : string, id : string) => `/Dashboard/website-templates/${templateId}/customizable-components/${id}/reactivate`,
    DASHBOARD_WEBSITE_TEMPLATE_REQUESTS : "/Dashboard/website-template-requests",
    DASHBOARD_WEBSITE_TEMPLATE_REQUEST : (requestId : string) => `/Dashboard/website-template-requests/${requestId}`,
    DASHBOARD_WEBSITE_TEMPLATE_REQUEST_START_BUILD : (requestId : string) => `/Dashboard/website-template-requests/${requestId}/start-build`,
    DASHBOARD_WEBSITE_TEMPLATE_REQUEST_CLOSE : (requestId : string) => `/Dashboard/website-template-requests/${requestId}/close`,

    /** SUBSCRIPTION PLANS (SuperAdmin CRUD; /public needs no auth) */
    SUBSCRIPTION_PLANS : "/subscription-plans",
    SUBSCRIPTION_PLANS_PUBLIC : "/subscription-plans/public",
    SUBSCRIPTION_PLAN_FEATURES : "/subscription-plans/features",
    SUBSCRIPTION_PLAN : (id : string) => `/subscription-plans/${id}`,
    SUBSCRIPTION_PLAN_DEACTIVATE : (id : string) => `/subscription-plans/${id}/deactivate`,
    SUBSCRIPTION_PLAN_REACTIVATE : (id : string) => `/subscription-plans/${id}/reactivate`,

    /** BUSINESS DASHBOARD */
    BUSINESS_DASHBOARD_STATS : (businessId : string) => `/businesses/${businessId}/dashboard/stats`,
    BUSINESS_DASHBOARD_PRODUCTS : (businessId : string) => `/businesses/${businessId}/dashboard/products`,
    BUSINESS_DASHBOARD_MEMBERS : (businessId : string) => `/businesses/${businessId}/dashboard/members`,
    BUSINESS_DASHBOARD_SUBSCRIPTION : (businessId : string) => `/businesses/${businessId}/dashboard/subscription`,
    BUSINESS_DASHBOARD_SUBSCRIPTION_CANCEL : (businessId : string) => `/businesses/${businessId}/dashboard/subscription/cancel`,
    BUSINESS_DASHBOARD_PRODUCT_FORM : (businessId : string) => `/businesses/${businessId}/dashboard/product-form`,
    BUSINESS_DASHBOARD_PRODUCT : (businessId : string, productId : string) => `/businesses/${businessId}/dashboard/products/${productId}`,
    BUSINESS_DASHBOARD_PRODUCT_IMAGE : (businessId : string) => `/businesses/${businessId}/dashboard/products/image`,
    BUSINESS_DASHBOARD_WEBSITE_TEMPLATE_OPTIONS : (businessId : string) => `/businesses/${businessId}/dashboard/website-template-options`,
    BUSINESS_DASHBOARD_WEBSITE_TEMPLATE_REQUESTS : (businessId : string) => `/businesses/${businessId}/dashboard/website-template-requests`,
    BUSINESS_DASHBOARD_FEATURES : (businessId : string) => `/businesses/${businessId}/dashboard/features`,
    BUSINESS_DASHBOARD_FEATURE_PURCHASES : (businessId : string) => `/businesses/${businessId}/dashboard/features/purchases`,

    /** WEBSITE CUSTOMIZATION */
    BUSINESS_DASHBOARD_WEBSITE_CUSTOMIZATION_CATALOGUE : (businessId : string) => `/businesses/${businessId}/dashboard/website-customization/catalogue`,
    BUSINESS_DASHBOARD_WEBSITE_CUSTOMIZATION_DRAFT : (businessId : string) => `/businesses/${businessId}/dashboard/website-customization/draft`,
    BUSINESS_DASHBOARD_WEBSITE_CUSTOMIZATION_IMAGE : (businessId : string) => `/businesses/${businessId}/dashboard/website-customization/image`,
    BUSINESS_DASHBOARD_WEBSITE_CUSTOMIZATION_PUBLISH : (businessId : string) => `/businesses/${businessId}/dashboard/website-customization/publish`,
    BUSINESS_DASHBOARD_WEBSITE_CUSTOMIZATION_PREVIEW_TOKEN_REGENERATE : (businessId : string) => `/businesses/${businessId}/dashboard/website-customization/preview-token/regenerate`,

    /** INVENTORY */
    BUSINESS_DASHBOARD_STOCK_ADJUSTMENT : (businessId : string, productId : string) => `/businesses/${businessId}/dashboard/products/${productId}/stock-adjustments`,
    BUSINESS_DASHBOARD_INVENTORY_SUMMARY : (businessId : string) => `/businesses/${businessId}/dashboard/inventory/summary`,
    BUSINESS_DASHBOARD_INVENTORY_MOVEMENTS : (businessId : string) => `/businesses/${businessId}/dashboard/inventory/movements`,
    BUSINESS_DASHBOARD_LOW_STOCK_THRESHOLD : (businessId : string) => `/businesses/${businessId}/dashboard/inventory/low-stock-threshold`,

    /** ORDERS */
    BUSINESS_DASHBOARD_ORDERS : (businessId : string) => `/businesses/${businessId}/dashboard/orders`,
    BUSINESS_DASHBOARD_ORDER : (businessId : string, orderId : string) => `/businesses/${businessId}/dashboard/orders/${orderId}`,
    BUSINESS_DASHBOARD_ORDER_STATUS : (businessId : string, orderId : string) => `/businesses/${businessId}/dashboard/orders/${orderId}/status`,
    BUSINESS_DASHBOARD_ORDER_PAYMENT_STATUS : (businessId : string, orderId : string) => `/businesses/${businessId}/dashboard/orders/${orderId}/payment-status`,
    BUSINESS_DASHBOARD_ORDER_STATS : (businessId : string) => `/businesses/${businessId}/dashboard/orders/stats`,
    BUSINESS_DASHBOARD_ORDER_NOTES : (businessId : string, orderId : string) => `/businesses/${businessId}/dashboard/orders/${orderId}/notes`,
    BUSINESS_DASHBOARD_ORDER_STATUS_HISTORY : (businessId : string, orderId : string) => `/businesses/${businessId}/dashboard/orders/${orderId}/status-history`,
    BUSINESS_DASHBOARD_ORDER_ANALYTICS : (businessId : string) => `/businesses/${businessId}/dashboard/orders/analytics`,

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

    /** AI IMAGE SUGGESTIONS ("suggest details from photo") */
    IMAGE_SUGGESTIONS : (businessId : string) => `/businesses/${businessId}/dashboard/image-suggestions`,

}