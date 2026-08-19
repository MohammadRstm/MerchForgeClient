export const apiRoutes = {
    
    /** AUTH */
    AUTH_LOGIN : "/Auth/login",
    AUTH_ACCEPT_INVITATION : "/Auth/businessOwner/registration",
    AUTH_REFRESH : "/Auth/refresh",
    AUTH_LOGOUT : "/Auth/logout",

    /** USER */
    USER_PROFILE : "/profile",

    /** DASHBOARD */
    DASHBOARD_STATS : "/Dashboard/stats",
    DASHBOARD_USERS : "/Dashboard/users",
    DASHBOARD_BUSINESSES : "/Dashboard/businesses",
    DASHBOARD_REVOKE_USER_SESSIONS : (userId : string) => `/Dashboard/users/${userId}/revoke-sessions`,

    /** BUSINESS DASHBOARD */
    BUSINESS_DASHBOARD_STATS : (businessId : string) => `/businesses/${businessId}/dashboard/stats`,
    BUSINESS_DASHBOARD_PRODUCTS : (businessId : string) => `/businesses/${businessId}/dashboard/products`,
    BUSINESS_DASHBOARD_MEMBERS : (businessId : string) => `/businesses/${businessId}/dashboard/members`,
    BUSINESS_DASHBOARD_SUBSCRIPTION : (businessId : string) => `/businesses/${businessId}/dashboard/subscription`,

}