import axios from "axios";
import { ApiError } from "../../../Error/ApiError";


export function toApiError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
        const response = error.response;

        if (response?.data) {
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