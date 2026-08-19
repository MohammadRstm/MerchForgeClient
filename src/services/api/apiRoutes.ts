export const apiRoutes = {
    
    /** AUTH */
    AUTH_LOGIN : "/Auth/login",
    AUTH_ACCEPT_INVITATION : "/Auth/businessOwner/registration",

    /** USER */
    USER_PROFILE : "/profile",

    /** DASHBOARD */
    DASHBOARD_STATS : "/Dashboard/stats",
    DASHBOARD_USERS : "/Dashboard/users",
    DASHBOARD_BUSINESSES : "/Dashboard/businesses",
    DASHBOARD_REVOKE_USER_SESSIONS : (userId : string) => `/Dashboard/users/${userId}/revoke-sessions`,

}