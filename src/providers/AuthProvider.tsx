import AuthContext from "../context/Auth/AuthContext";
import type { LoginResponse } from "../features/Auth/Login/types";
import type { UserSession } from "../types/generalTypes";

export const AuthProvider = ({ children }: { children: React.ReactNode }) =>{
    // const [user, setUser] = useState<User | null>(null);

    const login = (data : LoginResponse) =>{
        const session: UserSession = {
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            systemRole: data.systemRole,

            business: data.business,

            accessToken: data.authResponse.accessToken,
            refreshToken: data.authResponse.refreshToken,
            accessTokenExpiresAt: data.authResponse.accessTokenExpiresAt,
        };

        localStorage.setItem(
            "userSession",
            JSON.stringify(session)
        );
    };
    
    const logout = () => {
        localStorage.removeItem("userSession");
    }; 

    const session = localStorage.getItem("userSession");

    return(
        <AuthContext
            value={{
                isAuthenticated: !!session,
                session: session ? JSON.parse(session) : null,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext>
    );
};