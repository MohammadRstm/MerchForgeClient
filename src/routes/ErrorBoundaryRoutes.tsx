import { ErrorBoundary } from "react-error-boundary";
import { Outlet } from "react-router";
import ErrorFallback from "../features/ErrorFallBack/ErrorFallBack";


const ErrorBoundaryRoutes = () =>{
    return(
        <ErrorBoundary
        FallbackComponent={ErrorFallback}
        >
            <Outlet />
        </ErrorBoundary>  
    );
}

export default ErrorBoundaryRoutes;