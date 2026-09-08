import { useState, type ReactNode } from "react";
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
    // Lazily initialised and held in state, not rebuilt in the render body: a new
    // QueryClient is a new empty cache, so any re-render of this provider would
    // discard every cached query and refetch the whole page. It has no state of its
    // own today so it never re-renders in practice - this makes that a property of
    // the code rather than an accident of the current component tree.
    const [queryClient] = useState(() => new QueryClient({
        // Previously unset, so React Query's own defaults applied: staleTime 0,
        // retry 3, refetchOnWindowFocus true. On the owner dashboard - whose
        // overview page issues twelve concurrent queries, several of them heavy
        // analytics aggregations - that meant every alt-tab back to the browser
        // refetched all twelve, and every failure became four requests instead of
        // one. Measured on a 2-core shared host, that is real load for no benefit.
        //
        // A 60-second staleTime does not risk showing stale data after a write:
        // every mutation in this app already calls invalidateQueries for what it
        // changed, and invalidation ignores staleTime.
        defaultOptions: {
            queries: {
                staleTime: 60_000,
                retry: 1,
                refetchOnWindowFocus: false,
            },
        },
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
    }));

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