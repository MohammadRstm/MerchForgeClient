import { useMutation } from "@tanstack/react-query"
import { loginService } from "../../services/loginService"
import { useNavigate } from "react-router";
import useAuth from "../../../../../context/Auth/useAuth";

const useLogin = () =>{
    const { saveSession } = useAuth();
    const naviagte = useNavigate();

    return useMutation({
        mutationFn: loginService,
        onSuccess : (data) =>{
            // initialize the user session
            saveSession(data.token, data.user);
            naviagte("/");
        },
        onError : (error) =>{
            console.log(error);
        }
});
};

export default useLogin;