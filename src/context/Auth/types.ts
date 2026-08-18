export interface AuthContextType{
    isAuthenticated: boolean;
    login: (token: string , refreshToken : string) => void;
    logout: () => void;
};