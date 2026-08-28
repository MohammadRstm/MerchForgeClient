export const routes = {
    LOGIN: "/login",
    // There is no self-service registration: accounts are created by completing an
    // emailed invitation. "Sign up" therefore points at the landing page's
    // get-started section rather than a signup form that does not exist.
    SIGNUP: "/#get-started",
    HOME: "/",
    ABOUTUS: "/aboutus",
    ACCEPT_INVITATION: "/accept-invitation",
    PLAN_DETAIL: "/plans/:planId",

    // Business owner dashboard
    DASHBOARD: "/dashboard",
    DASHBOARD_PRODUCTS: "/dashboard/products",
    DASHBOARD_INVENTORY: "/dashboard/inventory",
    DASHBOARD_ORDERS: "/dashboard/orders",
    DASHBOARD_WEBSITE: "/dashboard/website",
    DASHBOARD_WEBSITE_CUSTOMIZE: "/dashboard/website/customize",
    CHOOSE_WEBSITE_TEMPLATE: "/dashboard/website/choose",
    DASHBOARD_SETTINGS: "/dashboard/settings",
    DASHBOARD_BILLING: "/dashboard/billing",

    // Super admin dashboard
    ADMIN: "/admin",
    ADMIN_BUSINESSES: "/admin/businesses",
    ADMIN_BUSINESS_DETAIL: "/admin/businesses/:businessId",
    ADMIN_WEBSITE_REQUESTS: "/admin/website-requests",
    ADMIN_TEMPLATES: "/admin/templates",
    ADMIN_PRODUCT_FIELDS: "/admin/product-fields",
    ADMIN_USERS: "/admin/users",
    ADMIN_CUSTOMERS: "/admin/customers",
    ADMIN_CUSTOMER_DETAIL: "/admin/customers/:customerId",
    ADMIN_PLANS: "/admin/plans",

    // Customer (shopper) identity — public, platform-hosted pages a storefront sends a
    // customer to for signup/login, and the hidden silent-renewal page. Entirely
    // separate from the business-owner LOGIN above: distinct auth scheme, distinct
    // session, no shared state.
    CUSTOMER_LOGIN: "/customer/login",
    CUSTOMER_SIGNUP: "/customer/signup",
    CUSTOMER_SILENT: "/customer/silent",
};

export const buildAdminBusinessDetailRoute = (businessId: string) =>
    `/admin/businesses/${businessId}`;

export const buildPlanDetailRoute = (planId: string) =>
    `/plans/${planId}`;

export const buildAdminCustomerDetailRoute = (customerId: string) =>
    `/admin/customers/${customerId}`;