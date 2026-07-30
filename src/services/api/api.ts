import axios from "axios";
import { env } from "../../config/env";

export const authenticatedApi = axios.create({
    baseURL: env.apiUrl,
});

authenticatedApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


export const unAuthenticatedApi = axios.create({
    baseURL: env.apiUrl,
    headers: {
        Accept: "application/json",
    },
});


