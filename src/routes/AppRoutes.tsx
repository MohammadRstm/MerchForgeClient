import { Route, Routes } from "react-router"
import PagesWithHeaderLayout from "../layout/PagesWithHeaders/PagesWithHeaders";
import AuthenticatedRoutes from "./AuthenticatedRoutes";
import ErrorBoundaryRoutes from "./ErrorBoundaryRoutes";
import Login from "../features/Auth/Login/Login";
import Signup from "../features/Auth/Signup/Signup";
import Home from "../features/Home/Home";

const AppRoutes = () =>{

    return(
        <Routes>
            <Route element={<ErrorBoundaryRoutes />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
            

                <Route element={<PagesWithHeaderLayout />}>


                    <Route path="/" element={<Home />} />

                    <Route element={<AuthenticatedRoutes />}>

                    </Route>
                </Route>
            </Route>

        </Routes>
    );
}

export default AppRoutes;