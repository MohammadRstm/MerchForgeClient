import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router";
import useAuth from "../../../../../context/Auth/useAuth";
import { loginService } from "../../../../../services/api/auth.api";
import { notify } from "../../../../../services/toast";
import { routes } from "../../../../../config/routes";

const useLogin = () =>{
    const { login } = useAuth();
    const naviagte = useNavigate();

    return useMutation({
        mutationFn: loginService,
        onSuccess : (data) =>{
            // initialize the user session
            
            login(data);// we want to add data later on

            notify.success(
                "Welcome"
            );
  
            setTimeout(() =>{
                naviagte(routes.DASHBOARD);
            }, 2000);

        },
});
};

export default useLogin;