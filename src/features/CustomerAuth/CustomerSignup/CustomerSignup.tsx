import AuthShell from "../../../components/AuthShell/AuthShell";
import "../../../components/AuthShell/AuthForm.css";
import { Link } from "react-router";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useCustomerSignupPage from "./hooks/useCustomerSignupPage";
import { routes } from "../../../config/routes";
import userAccountIllustration from "../../../assets/illustrations/user-account.svg";

const shellProps = {
    illustration: userAccountIllustration,
    statementHeadline: "One account, every store.",
    statementSubtext: "Create your account once and check out faster everywhere MerchForge powers.",
};

const CustomerSignup = () => {
    const {
        signupFormData,
        signupError,
        errors,
        signupPending,
        signupResult,
        returnUrl,
        submit,
        handleChange,
        handleAgreedToTermsChange,
    } = useCustomerSignupPage();

    if (signupResult?.exchangeCode && returnUrl) {
        return (
            <AuthShell {...shellProps}>
                <div className="auth-form__status">
                    <Spinner size={28} />
                    <p className="auth-form__subtext">Taking you back to the store...</p>
                </div>
            </AuthShell>
        );
    }

    if (signupResult) {
        return (
            <AuthShell {...shellProps}>
                <div className="auth-form__status">
                    <h1 className="auth-form__headline">You're all set</h1>
                    <p className="auth-form__subtext">
                        Welcome, {signupResult.firstName}. You can close this tab and return to the store.
                    </p>
                </div>
            </AuthShell>
        );
    }

    return (
        <AuthShell {...shellProps}>
            <form className="auth-form" onSubmit={submit}>
                <h1 className="auth-form__headline">Create your account</h1>

                <p className="auth-form__subtext">
                    One account, usable at checkout across every store we power.
                </p>

                {signupError && (
                    <div className="auth-form__server-error">
                        {signupError.message}
                    </div>
                )}

                <div className="auth-form__row">
                    <label className="auth-form__field">
                        <span className="auth-form__label">First name</span>

                        <input
                            id="firstName"
                            name="firstName"
                            className="auth-form__input"
                            type="text"
                            placeholder="Jamie"
                            value={signupFormData.firstName}
                            onChange={handleChange}
                        />

                        {errors?.firstName && <p className="auth-form__field-error">{errors.firstName}</p>}
                    </label>

                    <label className="auth-form__field">
                        <span className="auth-form__label">Last name</span>

                        <input
                            id="lastName"
                            name="lastName"
                            className="auth-form__input"
                            type="text"
                            placeholder="Chen"
                            value={signupFormData.lastName}
                            onChange={handleChange}
                        />

                        {errors?.lastName && <p className="auth-form__field-error">{errors.lastName}</p>}
                    </label>
                </div>

                <label className="auth-form__field">
                    <span className="auth-form__label">Email</span>

                    <input
                        id="email"
                        name="email"
                        className="auth-form__input"
                        type="text"
                        placeholder="Enter your email"
                        value={signupFormData.email}
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
                        placeholder="At least 8 characters"
                        value={signupFormData.password}
                        onChange={handleChange}
                    />

                    {errors?.password && <p className="auth-form__field-error">{errors.password}</p>}
                </label>

                <label className="auth-form__checkbox">
                    <input
                        type="checkbox"
                        id="agreedToTerms"
                        name="agreedToTerms"
                        checked={signupFormData.agreedToTerms}
                        onChange={handleAgreedToTermsChange}
                        aria-invalid={Boolean(errors?.agreedToTerms)}
                        aria-describedby={errors?.agreedToTerms ? "agreedToTerms-error" : undefined}
                    />
                    <span>
                        I agree to the MerchForge{" "}
                        <Link to={routes.TERMS} target="_blank" rel="noreferrer">
                            Terms of Service
                        </Link>{" "}
                        and acknowledge the{" "}
                        <Link to={routes.PRIVACY} target="_blank" rel="noreferrer">
                            Privacy Policy
                        </Link>
                        .
                    </span>
                </label>
                {errors?.agreedToTerms && (
                    <p id="agreedToTerms-error" className="auth-form__field-error" role="alert">
                        {errors.agreedToTerms}
                    </p>
                )}

                <button className="auth-form__submit" disabled={signupPending}>
                    {signupPending ? <Spinner size={20} /> : "Create account"}
                </button>

                <p className="auth-form__suggestion">
                    Already have an account?{" "}
                    <Link
                        className="auth-form__suggestion-link"
                        to={`${routes.CUSTOMER_LOGIN}${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthShell>
    );
};

export default CustomerSignup;
