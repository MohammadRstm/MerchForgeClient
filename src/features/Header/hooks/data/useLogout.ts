import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAuth from "../../../../context/Auth/useAuth";
import { logoutService } from "../../../../services/api/auth.api";
import { routes } from "../../../../config/routes";

// Explicit user logout, distinct from the interceptor's automatic session-expiry
// path: this one calls the backend so the refresh token actually gets revoked and
// its cookie cleared. It goes through unAuthenticatedApi (no Authorization header,
// no refresh-on-401 interceptor), so a failure here can never recursively trigger
// another refresh/logout — and either way we still clear local state and redirect,
// since logout must always succeed from the user's point of view.
const useLogout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logoutService,
        onSettled: () => {
            logout();
            navigate(routes.LOGIN);
        },
    });
};

export default useLogout;
