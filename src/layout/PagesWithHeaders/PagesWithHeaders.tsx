import { Outlet } from "react-router";
import Header from "../../features/Header/Header";
import "./PagesWithHeaderLayout.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../features/ErrorFallBack/ErrorFallBack";

const PagesWithHeaderLayout = () =>{
    return(
        <>
            <Header />
            <ErrorBoundary
            FallbackComponent={ErrorFallback}
            >
                <Outlet />
            </ErrorBoundary>
        </>
    );
}

export default PagesWithHeaderLayout;