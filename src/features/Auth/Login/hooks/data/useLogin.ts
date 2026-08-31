import { useMutation } from "@tanstack/react-query"
import { useLocation, useNavigate, type Location } from "react-router";
import useAuth from "../../../../../context/Auth/useAuth";
import { loginService } from "../../../../../services/api/auth.api";
import { notify } from "../../../../../services/toast";
import { routes } from "../../../../../config/routes";

const useLogin = () =>{
    const { login } = useAuth();
    const naviagte = useNavigate();
    const location = useLocation();

    // Set by AuthenticatedRoutes when it redirected here from a deep link — falls
    // back to the default dashboard route for a direct visit to /login.
    const from = (location.state as { from?: Location } | null)?.from;

    return useMutation({
        mutationFn: loginService,
        onSuccess : (data) =>{
            // initialize the user session

            login(data);// we want to add data later on

            notify.success(
                "Welcome"
            );

            naviagte(from ?? routes.DASHBOARD, { replace: true });
        },
});
};

export default useLogin;