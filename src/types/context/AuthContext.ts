import type { User } from "../generalTypes";

export interface AuthContextType{
    user: User | null;
    isAuthenticated: boolean;
    saveSession: (token: string , user : User) => void;
    deleteSession: () => void;
};