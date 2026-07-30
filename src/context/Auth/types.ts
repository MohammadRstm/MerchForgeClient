import type { User } from "../../types/generalTypes";

export interface AuthContextType{
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string , user : User) => void;
    logout: () => void;
};