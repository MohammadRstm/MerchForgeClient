import { createContext } from "react";
import type { AuthContextType } from "../../types/context/AuthContext";


const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;