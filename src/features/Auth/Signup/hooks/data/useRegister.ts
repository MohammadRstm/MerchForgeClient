import { useMutation } from "@tanstack/react-query"
import { registerUser } from "../../services/registerUser";
import { useNavigate } from "react-router";
import useAuth from "../../../../../context/Auth/useAuth";

const useRegister = () =>{

    const naviagte = useNavigate();
    const { saveSession } = useAuth();

    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) =>{
            saveSession(data.token, data.user);
            naviagte("/");// landing page
        },
        onError:(error) =>{
            console.log(error);
        }
    });
};

export default useRegister;