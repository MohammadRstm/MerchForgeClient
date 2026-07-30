import type { User } from "../../types/generalTypes";

export interface AuthContextType{
    user: User | null;
    isAuthenticated: boolean;
    saveSession: (token: string , user : User) => void;
    deleteSession: () => void;
};