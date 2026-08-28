import "../CustomerAuth.css";
import { Link } from "react-router";
import Spinner from "../../../components/LoadingSpinner/LoadingSpinner";
import useCustomerSignupPage from "./hooks/useCustomerSignupPage";
import { routes } from "../../../config/routes";

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
    } = useCustomerSignupPage();

    if (signupResult?.exchangeCode && returnUrl) {
        return (
            <main className="customer-auth-page">
                <div className="customer-auth-form customer-auth-success">
                    <Spinner size={28} />
                    <p className="customer-auth-subtitle">Taking you back to the store...</p>
                </div>
            </main>
        );
    }

    if (signupResult) {
        return (
            <main className="customer-auth-page">
                <div className="customer-auth-form customer-auth-success">
                    <h1 className="customer-auth-title">You're all set</h1>
                    <p className="customer-auth-subtitle">
                        Welcome, {signupResult.firstName}. You can close this tab and return to the store.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="customer-auth-page">
            <form className="customer-auth-form" onSubmit={submit}>
                <h1 className="customer-auth-title">Create your account</h1>

                <p className="customer-auth-subtitle">
                    One account, usable at checkout across every store we power.
                </p>

                {signupError && (
                    <div className="customer-auth-server-errors">
                        {signupError.message}
                    </div>
                )}

                <div className="customer-auth-form-row">
                    <label className="customer-auth-field">
                        <span className="customer-auth-label-text">First name</span>

                        <input
                            id="firstName"
                            name="firstName"
                            className="customer-auth-form-inp"
                            type="text"
                            placeholder="Jamie"
                            value={signupFormData.firstName}
                            onChange={handleChange}
                        />

                        {errors?.firstName && <p className="validation-errors">{errors.firstName}</p>}
                    </label>

                    <label className="customer-auth-field">
                        <span className="customer-auth-label-text">Last name</span>

                        <input
                            id="lastName"
                            name="lastName"
                            className="customer-auth-form-inp"
                            type="text"
                            placeholder="Chen"
                            value={signupFormData.lastName}
                            onChange={handleChange}
                        />

                        {errors?.lastName && <p className="validation-errors">{errors.lastName}</p>}
                    </label>
                </div>

                <label className="customer-auth-field">
                    <span className="customer-auth-label-text">Email</span>

                    <input
                        id="email"
                        name="email"
                        className="customer-auth-form-inp"
                        type="text"
                        placeholder="Enter your email"
                        value={signupFormData.email}
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
                        placeholder="At least 8 characters"
                        value={signupFormData.password}
                        onChange={handleChange}
                    />

                    {errors?.password && <p className="validation-errors">{errors.password}</p>}
                </label>

                <button className="customer-auth-submit-btn" disabled={signupPending}>
                    {signupPending ? <Spinner size={20} /> : "Create account"}
                </button>

                <p className="customer-auth-suggestion">
                    Already have an account?{" "}
                    <Link
                        className="customer-auth-suggestion-link"
                        to={`${routes.CUSTOMER_LOGIN}${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""}`}
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </main>
    );
};

export default CustomerSignup;
