import type { ApiErrorResponse, ErrorType } from "../types/generalTypes";

export class ApiError extends Error {
    readonly status: number;
    readonly type: ErrorType;
    readonly code: string;
    readonly traceId: string;
    readonly errors?: Record<string, string[]>;

    constructor(
        response: ApiErrorResponse,
        status: number
    ) {
        super(response.message);

        this.name = "ApiError";

        this.status = status;
        this.type = response.type;
        this.code = response.code;
        this.traceId = response.traceId;
        this.errors = response.errors;
    }
}