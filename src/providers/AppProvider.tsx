import type { ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { notify } from "../services/toast";
import { ApiError } from "../Error/ApiError";


/**
 * This component is used for GLOBAL PROVIDERS only
 */

export default function AppProviders({children,}:{children: ReactNode;}){
    const queryClient = new QueryClient({
        mutationCache: new MutationCache({
            // A safety net, not the primary error-handling path: most mutations
            // already call notify.error themselves with a specific message, so
            // this only fires for one that doesn't (a future mutation someone
            // forgets to wire up) - checking mutation.options.onError is what
            // avoids double-toasting the ones that already handle it.
            onError: (error, _variables, _context, mutation) => {
                if (mutation.options.onError) {
                    return;
                }

                notify.error(
                    error instanceof ApiError
                        ? error.message
                        : "Something went wrong. Please try again."
                );
            },
        }),
    });

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}