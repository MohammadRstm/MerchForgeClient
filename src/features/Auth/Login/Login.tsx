import { Link, Navigate } from "react-router";
import AuthShell from "../../../components/AuthShell/AuthShell";
import "../../../components/AuthShell/AuthForm.css";
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
        <AuthShell>
            <form className="auth-form" onSubmit={submit}>
                <h1 className="auth-form__headline">Good to see you again.</h1>

                <p className="auth-form__subtext">
                    Sign in to manage your storefront, orders, and catalog.
                </p>

                {loginError && (
                    <div className="auth-form__server-error">
                        Invalid email or password.
                    </div>
                )}

                <label className="auth-form__field">
                    <span className="auth-form__label">Email</span>

                    <input
                        id="email"
                        name="Email"
                        className="auth-form__input"
                        type="text"
                        placeholder="Enter your email"
                        value={loginFormData.Email}
                        onChange={handleChange}
                    />

                    {errors?.Email && (
                        <p className="auth-form__field-error">{errors.Email}</p>
                    )}
                </label>

                <label className="auth-form__field">
                    <span className="auth-form__label">Password</span>

                    <input
                        id="password"
                        name="Password"
                        className="auth-form__input"
                        type="password"
                        placeholder="Enter your password"
                        value={loginFormData.Password}
                        onChange={handleChange}
                    />

                    {errors?.Password && (
                        <p className="auth-form__field-error">{errors.Password}</p>
                    )}
                </label>

                <button className="auth-form__submit" disabled={loginPending}>
                    {loginPending ? <Spinner size={20} /> : "Log in"}
                </button>

                <p className="auth-form__suggestion">
                    Don't have an account?{" "}
                    <Link className="auth-form__suggestion-link" to={routes.SIGNUP}>
                        Create one
                    </Link>
                </p>
            </form>
        </AuthShell>
    );
};

export default Login;
