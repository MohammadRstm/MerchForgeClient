import axios from "axios";
import { env } from "../../config/env";

const apiUrl = env.apiUrl + "api/";

// Both instances send credentials (the HttpOnly refresh-token cookie): login/refresh/
// logout go through unAuthenticatedApi and need it to send/receive that cookie, and
// authenticatedApi needs it for the logout call. The cookie itself is scoped to
// /api/Auth, so it's simply absent from every other request regardless.
export const authenticatedApi = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers:{
        Accept: "application/json",
    }
});

export const unAuthenticatedApi = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
        Accept: "application/json",
    },
});


