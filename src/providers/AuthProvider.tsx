import { useEffect, useState } from "react";
import AuthContext from "../context/Auth/AuthContext";
import { buildSessionFromLoginResponse } from "../context/Auth/sessionMapper";
import type { LoginResponse } from "../features/Auth/Login/types";
import { refreshSessionOnce } from "../services/api/auth.api";
import type { UserSession } from "../types/generalTypes";

export const AuthProvider = ({ children }: { children: React.ReactNode }) =>{
    const [session, setSession] = useState<UserSession | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    // The refresh token cookie is HttpOnly, so we can't just check localStorage for
    // one. Instead, on every app start we ask the backend to try a silent refresh:
    // if the cookie is still valid we come back authenticated with a fresh access
    // token, otherwise the user is simply logged out. This is the only source of
    // truth for "was I logged in" across a browser restart.
    useEffect(() => {
        let cancelled = false;

        const restoreSession = async () => {
            try {
                const data = await refreshSessionOnce();

                if (cancelled) return;

                const restoredSession = buildSessionFromLoginResponse(data);

                localStorage.setItem(
                    "userSession",
                    JSON.stringify(restoredSession)
                );

                setSession(restoredSession);
            } catch {
                if (cancelled) return;

                localStorage.removeItem("userSession");
                setSession(null);
            } finally {
                if (!cancelled) {
                    setIsInitializing(false);
                }
            }
        };

        restoreSession();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = (data : LoginResponse) =>{
        const newSession = buildSessionFromLoginResponse(data);

        localStorage.setItem(
            "userSession",
            JSON.stringify(newSession)
        );

        setSession(newSession);
    };

    // Local-only: clears client state without calling the backend. Used for
    // automatic session expiration (the interceptor's refresh-on-401 flow already
    // hit the network and failed) so it never triggers another request. Explicit
    // user logout is a separate flow (see useLogout) that revokes the refresh token
    // on the server first, then calls this to clear local state.
    const logout = () => {
        localStorage.removeItem("userSession");
        setSession(null);
    };

    return(
        <AuthContext
            value={{
                isAuthenticated: !!session,
                isInitializing,
                session,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext>
    );
};
