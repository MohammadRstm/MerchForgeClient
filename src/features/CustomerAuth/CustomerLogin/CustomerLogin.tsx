import AuthShell from "../../../components/AuthShell/AuthShell";
import "../../../components/AuthShell/AuthForm.css";
import { Link } from "react-router";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useCustomerLoginPage from "./hooks/useCustomerLoginPage";
import { routes } from "../../../config/routes";
import secureLoginIllustration from "../../../assets/illustrations/secure-login.svg";

const shellProps = {
    illustration: secureLoginIllustration,
    statementHeadline: "Your account, one login away.",
    statementSubtext: "Sign in securely to pick up right where you left off, at any store MerchForge powers.",
};

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
            <AuthShell {...shellProps}>
                <div className="auth-form__status">
                    <Spinner size={28} />
                    <p className="auth-form__subtext">Taking you back to the store...</p>
                </div>
            </AuthShell>
        );
    }

    // Reached the platform directly (no returnUrl) — there's no storefront to send the
    // customer back to, so this is the terminal state rather than a redirect.
    if (loginResult) {
        return (
            <AuthShell {...shellProps}>
                <div className="auth-form__status">
                    <h1 className="auth-form__headline">You're signed in</h1>
                    <p className="auth-form__subtext">
                        Welcome back, {loginResult.firstName}. You can close this tab and return to the store.
                    </p>
                </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell {...shellProps}>
            <form className="auth-form" onSubmit={submit}>
                <h1 className="auth-form__headline">Welcome back</h1>

                <p className="auth-form__subtext">Sign in to continue to checkout.</p>

                {loginError && (
                    <div className="auth-form__server-error">
                        Invalid email or password.
                    </div>
                )}

                <label className="auth-form__field">
                    <span className="auth-form__label">Email</span>

                    <input
                        id="email"
                        name="email"
                        className="auth-form__input"
                        type="text"
                        placeholder="Enter your email"
                        value={loginFormData.email}
                        onChange={handleChange}
                    />

                    {errors?.email && <p className="auth-form__field-error">{errors.email}</p>}
                </label>

                <label className="auth-form__field">
                    <span className="auth-form__label">Password</span>

                    <input
                        id="password"
                        name="password"
                        className="auth-form__input"
                        type="password"
                        placeholder="Enter your password"
                        value={loginFormData.password}
                        onChange={handleChange}
                    />

                    {errors?.password && <p className="auth-form__field-error">{errors.password}</p>}
                </label>

                <button className="auth-form__submit" disabled={loginPending}>
                    {loginPending ? <Spinner size={20} /> : "Sign in"}
                </button>

                <p className="auth-form__suggestion">
                    Don't have an account?{" "}
                    <Link
                        className="auth-form__suggestion-link"
                        to={`${routes.CUSTOMER_SIGNUP}${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
                    >
                        Create one
                    </Link>
                </p>
            </form>
        </AuthShell>
    );
};

export default CustomerLogin;
