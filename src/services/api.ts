import axios from "axios";



export const authenticatedApi = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

authenticatedApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


export const unAuthenticatedApi = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        Accept: "application/json",
    },
});


