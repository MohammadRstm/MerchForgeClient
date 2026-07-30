import type { NavigateFunction } from "react-router";
import { authenticatedApi } from "./api";
import { routes } from "../../config/routes";

export function setupInterceptors(
    logout: () => void,
    navigate: () => NavigateFunction
){
    /**
     * Auth expired 
     */
    const autheticatedRespInterceptor = authenticatedApi.interceptors.response.use(
        response => response,

        error => {

            if (error.response?.status === 401){
                logout();
                navigate()(routes.LOGIN);
            }

            return Promise.reject(error);
        }
    );

    authenticatedApi.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    return {
        autheticatedRespInterceptor,
    }
}