import { Route, Routes } from "react-router"
import PagesWithHeaderLayout from "../layout/PagesWithHeaders/PagesWithHeaders";
import AuthenticatedRoutes from "./AuthenticatedRoutes";
import ErrorBoundaryRoutes from "./ErrorBoundaryRoutes";

const AppRoutes = () =>{

    return(
        <Routes>

            <Route element={<PagesWithHeaderLayout />}>

                <Route element={<ErrorBoundaryRoutes />}>
                </Route>

                <Route element={<AuthenticatedRoutes />}>
                </Route>
            </Route>

        </Routes>
    );
}

export default AppRoutes;