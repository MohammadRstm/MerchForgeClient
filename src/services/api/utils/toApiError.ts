import axios from "axios";
import { ApiError } from "../../../Error/ApiError";
import type { ApiErrorResponse } from "../../../types/generalTypes";

function isApiErrorResponse(
    data: unknown
): data is ApiErrorResponse {
    if (!data || typeof data !== "object") {
        return false;
    }

    const value = data as Record<string, unknown>;

    return (
        typeof value.type === "string" &&
        typeof value.code === "string" &&
        typeof value.message === "string" &&
        typeof value.traceId === "string"
    );
}

export function toApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const response = error.response;

        if (response?.data &&
            isApiErrorResponse(response.data)
        ) {
            return new ApiError(
                response.data,
                response.status
            );
        }

        // The rate limiter's rejection response is shaped like every other
        // ApiErrorResponse (so the branch above already handles it in the normal
        // case) - this is only a fallback for a 429 whose body didn't parse, e.g.
        // one that came from a proxy in front of the API rather than the API
        // itself, so a rate-limited request always gets a specific message rather
        // than falling through to the generic "can't connect" one below.
        if (response?.status === 429) {
            return new ApiError(
                {
                    type: "Unexpected",
                    code: "RATE_LIMITED",
                    message: "Too many requests. Please wait a moment and try again.",
                    traceId: "",
                },
                429
            );
        }

        return new ApiError(
            {
                type: "Unexpected",
                code: "NETWORK_ERROR",
                message: "Unable to connect to the server.",
                traceId: "",
            },
            response?.status ?? 0
        );
    }

    return new ApiError(
        {
            type: "Unexpected",
            code: "UNKNOWN_ERROR",
            message: "An unexpected error occurred.",
            traceId: "",
        },
        0
    );
}