import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router";
import useAuth from "../../../../../context/Auth/useAuth";
import { loginService } from "../../../../../services/api/auth.api";



const useLogin = () =>{
    const { login } = useAuth();
    const naviagte = useNavigate();

    return useMutation({
        mutationFn: loginService,
        onSuccess : (data) =>{
            // initialize the user session
            login(data.token, data.user);
            naviagte("/");
        },
        onError : (error) =>{
            console.log(error);
        }
});
};

export default useLogin;