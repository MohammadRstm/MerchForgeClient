import "../CustomerAuth.css";
import { Link } from "react-router";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useCustomerLoginPage from "./hooks/useCustomerLoginPage";
import { routes } from "../../../config/routes";

const CustomerLogin = () => {
    const {
        loginFormData,
        loginError,
        errors,
        loginPending,
        loginResult,
        returnUrl,
        submit,
        handleChange,
    } = useCustomerLoginPage();

    // A successful login with a returnUrl redirects immediately (see
    // useCustomerLoginPage) — this only renders while that redirect is in flight, so
    // the form never flashes back into view.
    if (loginResult?.exchangeCode && returnUrl) {
        return (
            <main className="customer-auth-page">
                <div className="customer-auth-form customer-auth-success">
                    <Spinner size={28} />
                    <p className="customer-auth-subtitle">Taking you back to the store...</p>
                </div>
            </main>
        );
    }

    // Reached the platform directly (no returnUrl) — there's no storefront to send the
    // customer back to, so this is the terminal state rather than a redirect.
    if (loginResult) {
        return (
            <main className="customer-auth-page">
                <div className="customer-auth-form customer-auth-success">
                    <h1 className="customer-auth-title">You're signed in</h1>
                    <p className="customer-auth-subtitle">
                        Welcome back, {loginResult.firstName}. You can close this tab and return to the store.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="customer-auth-page">
            <form className="customer-auth-form" onSubmit={submit}>
                <h1 className="customer-auth-title">Welcome Back</h1>

                <p className="customer-auth-subtitle">Sign in to continue to checkout.</p>

                {loginError && (
                    <div className="customer-auth-server-errors">
                        Invalid email or password.
                    </div>
                )}

                <label className="customer-auth-field">
                    <span className="customer-auth-label-text">Email</span>

                    <input
                        id="email"
                        name="email"
                        className="customer-auth-form-inp"
                        type="text"
                        placeholder="Enter your email"
                        value={loginFormData.email}
                        onChange={handleChange}
                    />

                    {errors?.email && <p className="validation-errors">{errors.email}</p>}
                </label>

                <label className="customer-auth-field">
                    <span className="customer-auth-label-text">Password</span>

                    <input
                        id="password"
                        name="password"
                        className="customer-auth-form-inp"
                        type="password"
                        placeholder="Enter your password"
                        value={loginFormData.password}
                        onChange={handleChange}
                    />

                    {errors?.password && <p className="validation-errors">{errors.password}</p>}
                </label>

                <button className="customer-auth-submit-btn" disabled={loginPending}>
                    {loginPending ? <Spinner size={20} /> : "Sign in"}
                </button>

                <p className="customer-auth-suggestion">
                    Don't have an account?{" "}
                    <Link
                        className="customer-auth-suggestion-link"
                        to={`${routes.CUSTOMER_SIGNUP}${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
                    >
                        Create one
                    </Link>
                </p>
            </form>
        </main>
    );
};

export default CustomerLogin;
