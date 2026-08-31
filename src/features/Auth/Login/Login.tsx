import "./Login.css";
import { Link, Navigate } from "react-router";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useLoginPage from "./hooks/useLoginPage";
import useAuth from "../../../context/Auth/useAuth";
import { routes } from "../../../config/routes";

const Login = () => {
    const {
        loginFormData,
        loginError,
        errors,
        loginPending,
        submit,
        handleChange,
    } = useLoginPage();

    const { isAuthenticated, isInitializing } = useAuth();

    // An already-signed-in owner landing on /login (e.g. a stale bookmark, or
    // browser back) should never see the form again — just take them straight
    // in. Waiting on isInitializing avoids redirecting before the silent-refresh
    // on page load has had a chance to resolve.
    if (!isInitializing && isAuthenticated) {
        return <Navigate to={routes.DASHBOARD} replace />;
    }

    return (
        <main className="login-page">
            <form className="login-form" onSubmit={submit}>

                <h1 className="login-title">Welcome Back</h1>

                <p className="login-subtitle">
                    Sign in to continue to your account.
                </p>

                {loginError && (
                    <div className="login-server-errors">
                        Invalid email or password.
                    </div>
                )}

                <label className="login-field">
                    <span className="login-label-text">Username</span>

                    <input
                        id="email"
                        name="Email"
                        className="login-form-inp"
                        type="text"
                        placeholder="Enter your email"
                        value={loginFormData.Email}
                        onChange={handleChange}
                    />

                    {errors?.Email && (
                        <p className="validation-errors">{errors.Email}</p>
                    )}
                </label>

                <label className="login-field">
                    <span className="login-label-text">Password</span>

                    <input
                        id="password"
                        name="Password"
                        className="login-form-inp"
                        type="password"
                        placeholder="Enter your password"
                        value={loginFormData.Password}
                        onChange={handleChange}
                    />

                    {errors?.Password && (
                        <p className="validation-errors">{errors.Password}</p>
                    )}
                </label>

                <button
                    className="login-submit-btn"
                    disabled={loginPending}
                >
                    {loginPending ? (
                        <Spinner size={20} />
                    ) : (
                        "Login"
                    )}
                </button>

                <p className="signup-suggestion">
                    Don't have an account?{" "}
                    <Link
                        className="signup-suggestion-link"
                        to={routes.SIGNUP}
                    >
                        Create one
                    </Link>
                </p>

            </form>
        </main>
    );
};

export default Login;