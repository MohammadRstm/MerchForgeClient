import type { NavigateFunction } from "react-router";
import { unAuthenticatedApi ,authenticatedApi } from "./api";
import { refreshSessionOnce } from "./auth.api";
import { routes } from "../../config/routes";
import { notify } from "../toast";
import { buildSessionFromLoginResponse } from "../../context/Auth/sessionMapper";

import {
    type AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";

import { ApiError } from "../../Error/ApiError";
import { toApiError } from "./utils/toApiError";

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
        // No refresh token to read: the browser sends the HttpOnly cookie on its own.
        // refreshSessionOnce also dedupes against AuthProvider's startup restore, on
        // top of this closure's own refreshPromise dedupe below.
        const data = await refreshSessionOnce();

        const updatedSession = buildSessionFromLoginResponse(data);

        localStorage.setItem(
            "userSession",
            JSON.stringify(updatedSession)
        );

        return updatedSession.accessToken;
    };

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

                const storedSession =
                localStorage.getItem("userSession");

                const session = storedSession
                    ? JSON.parse(storedSession)
                    : null;

                const token = session?.accessToken;

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
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

                return Promise.reject(toApiError(error));
            }
        );

        const unAuthenticatedApiRespInterceptor =
            unAuthenticatedApi.interceptors.response.use(
                response => response,
                error => Promise.reject(toApiError(error))
        );

    return {
        authenticatedApiReqInterceptor,
        authenticatedApiRespInterceptor,
        unAuthenticatedApiRespInterceptor,
    }
}