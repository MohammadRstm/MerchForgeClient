import type { ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/Auth";
import queryClient from "./queryCleint";


/**
 * This component is used for GLOBAL PROVIDERS only
 */

export default function AppProviders({children,}:{children: ReactNode;}){
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}