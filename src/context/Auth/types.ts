import type { LoginResponse } from "../../features/Auth/Login/types";
import type { UserSession } from "../../types/generalTypes";

export interface AuthContextType{
    isAuthenticated: boolean;
    session : UserSession | null;
    login: (data : LoginResponse) => void;
    logout: () => void;
};