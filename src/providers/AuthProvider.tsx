import AuthContext from "../context/Auth/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) =>{
    // const [user, setUser] = useState<User | null>(null);

    const login = (token: string, refreshToken : string) =>{
        localStorage.setItem("token" , token);
        localStorage.setItem("refreshToken" , refreshToken);
    };
    
    const logout = () => {
       localStorage.removeItem("token");
       localStorage.removeItem("refreshToken");
    }; 

    return(
        <AuthContext
            value={{
                isAuthenticated: !!localStorage.getItem("token"),
                login,
                logout,
            }}
        >
            {children}
        </AuthContext>
    );
};