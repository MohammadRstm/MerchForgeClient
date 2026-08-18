import type { NavigateFunction } from "react-router";
import { unAuthenticatedApi ,authenticatedApi } from "./api";
import { routes } from "../../config/routes";
import { notify } from "../toast";

import {
    type AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";

import { ApiError } from "../../Error/ApiError";
import type { ApiErrorResponse } from "../../types/generalTypes";

interface RetryableRequestConfig
    extends InternalAxiosRequestConfig {
    _retry?: boolean;
}


export function setupInterceptors(
    logout: () => void,
    navigate: NavigateFunction
){
    let isLoggingOut = false;
    let refreshPromise: Promise<string> | null = null;

    const refreshAccessToken = async (): Promise<string> => {
        if (!refreshPromise) {
            refreshPromise = performRefresh()
                .finally(() => {
                    refreshPromise = null;
                });
        }

        return refreshPromise;
    };

    const performRefresh = async (): Promise<string> => {
        const refreshToken =
            localStorage.getItem("refreshToken");

        if (!refreshToken) {
            throw new Error("No refresh token available.");
        }

        const response =
            await unAuthenticatedApi.post(
                "Auth/refresh",
                {
                    RefreshToken: refreshToken,
                }
            );

        const {
            accessToken,
            refreshToken : newRefreshToken
        } = response.data;

        localStorage.setItem(
            "token",
            accessToken
        );

        if (newRefreshToken) {
            localStorage.setItem(
                "refreshToken",
                newRefreshToken
            );
        }

        return accessToken;
    };

    const normalizeAxiosErrorIntoApiError = (error : AxiosError) =>{
        
        if (error.response?.data) {
            return Promise.reject(
                new ApiError(
                    error.response.data as ApiErrorResponse,
                    error.response.status
                )
            );
        }

        return Promise.reject(
            new ApiError(
                {
                    type: "Unexpected",
                    code: "NETWORK_ERROR",
                    message:
                        "Unable to connect to the server.",
                    traceId: "",
                },
                error.response?.status ?? 0
            )
        );
    }

    const handleSessionExpired = () => {
        if (isLoggingOut) {
            return;
        }

        isLoggingOut = true;

        notify.error(
            "Your session has expired. Please log in again."
        );

        logout();

        navigate(routes.LOGIN);
    };

    /**
     * Auth expired 
     */
    const authenticatedApiReqInterceptor =
        authenticatedApi.interceptors.request.use(
            (config) => {

                const token =
                    localStorage.getItem("token");

                if (token) {
                    config.headers.Authorization =
                        `Bearer ${token}`;
                }

                return config;
            }
    );

    const authenticatedApiRespInterceptor =
        authenticatedApi.interceptors.response.use(

            response => response,

            async (error: AxiosError) => {

                const originalRequest =
                    error.config as RetryableRequestConfig | undefined;

                if (
                    error.response?.status === 401 &&
                    originalRequest && 
                    !originalRequest?._retry
                ) {

                    originalRequest._retry = true;

                    try {
                        const newAccessToken =
                            await refreshAccessToken();

                        originalRequest.headers.Authorization =
                            `Bearer ${newAccessToken}`;

                        return authenticatedApi(
                            originalRequest
                        );

                    } catch {

                       handleSessionExpired();

                        return Promise.reject(
                            new ApiError(
                                {
                                    type: "Authentication",
                                    code: "SESSION_EXPIRED",
                                    message:
                                        "Your session has expired.",
                                    traceId: "",
                                },
                                401
                            )
                        );
                    }
                }

                return await normalizeAxiosErrorIntoApiError(error);
            }
        );

        const unAuthenticatedApiRespInterceptor =
            unAuthenticatedApi.interceptors.response.use(
                response => response,

                async (error : AxiosError) => {
                    return await normalizeAxiosErrorIntoApiError(error);
                }
        );

    return {
        authenticatedApiReqInterceptor,
        authenticatedApiRespInterceptor,
        unAuthenticatedApiRespInterceptor,
    }
}