import { useState } from "react";
import AuthContext from "../context/Auth/AuthContext";
import type { LoginResponse } from "../features/Auth/Login/types";
import type { UserSession } from "../types/generalTypes";

const readStoredSession = (): UserSession | null => {
    const stored = localStorage.getItem("userSession");
    return stored ? JSON.parse(stored) : null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) =>{
    const [session, setSession] = useState<UserSession | null>(readStoredSession);

    const login = (data : LoginResponse) =>{
        const newSession: UserSession = {
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            systemRole: data.systemRole,

            business: data.business,

            accessToken: data.authResponse.accessToken,
            refreshToken: data.authResponse.refreshToken,
            accessTokenExpiresAt: data.authResponse.accessTokenExpiresAt,
        };

        localStorage.setItem(
            "userSession",
            JSON.stringify(newSession)
        );

        setSession(newSession);
    };

    const logout = () => {
        localStorage.removeItem("userSession");
        setSession(null);
    };

    return(
        <AuthContext
            value={{
                isAuthenticated: !!session,
                session,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext>
    );
};
