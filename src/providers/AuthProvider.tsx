import { useState } from "react";
import type { User } from "../types/generalTypes";
import AuthContext from "../context/Auth/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) =>{
    const [user, setUser] = useState<User | null>(null);

    const saveSession = (token: string, user : User) =>{
        localStorage.setItem("token" , token);
        setUser(user);
    };
    
    const deleteSession = () => {
       setUser(null);
    }; 


    return(
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                saveSession,
                deleteSession,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};