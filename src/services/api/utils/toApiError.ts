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