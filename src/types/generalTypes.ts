export interface User{
    firstname: string,
    lastname: string,

    username: string,
    id: number
};

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type ErrorType =
    | "Validation"
    | "Authentication"
    | "Authorization"
    | "NotFound"
    | "Conflict"
    | "Unexpected";

export interface ApiErrorResponse {
    type: ErrorType;
    code: string;
    message: string;
    traceId: string;
    errors?: Record<string, string[]>;
}

export interface UserSession {
    userId: string;

    firstName: string;
    lastName: string;

    systemRole: string;

    business: {
        id: string;
        name: string;
        role: "Owner" | "Admin" | "Member";
    } | null;

    // The refresh token is never present here or in localStorage — it lives
    // only in an HttpOnly cookie the browser manages on its own.
    accessToken: string;
    accessTokenExpiresAt: string;
}