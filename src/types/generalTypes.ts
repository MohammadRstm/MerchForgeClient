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

    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
}