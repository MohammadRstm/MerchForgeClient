import { Link } from "react-router";
import AuthShell from "../../../components/AuthShell/AuthShell";
import "../../../components/AuthShell/AuthForm.css";
import { routes } from "./../../../config/routes";
import useAcceptMemberInvitationPage from "./hooks/useAcceptMemberInvitationPage";
import teamworkIllustration from "../../../assets/illustrations/teamwork.svg";

const shellProps = {
  illustration: teamworkIllustration,
  statementHeadline: "Better run as a team.",
  statementSubtext: "Invite teammates, share the workload, and keep your storefront running smoothly together.",
};

export default function AcceptMemberInvitation() {
  const {
    formData,
    errors,
    isInvitationInvalid,
    acceptInvitationPending,
    acceptInvitationError,
    acceptInvitationSuccess,
    handleChange,
    handleAgreedToTermsChange,
    submit,
  } = useAcceptMemberInvitationPage();

  if (isInvitationInvalid) {
    return (
      <AuthShell {...shellProps}>
        <div className="auth-form__status">
          <h1 className="auth-form__headline">This invitation link isn't valid.</h1>
          <p className="auth-form__subtext">
            We couldn't find an invitation token on this link. Double-check the
            invitation email, or ask whoever added you to send a new one.
          </p>
        </div>
      </AuthShell>
    );
  }

  if (acceptInvitationSuccess) {
    return (
      <AuthShell {...shellProps}>
        <div className="auth-form__status">
          <h1 className="auth-form__headline">You're all set.</h1>
          <p className="auth-form__subtext">
            Your password is set and your account is ready. You can log in now.
          </p>
          <Link to={routes.LOGIN} className="auth-form__submit auth-form__submit--link">
            Go to login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell {...shellProps}>
      <p className="auth-form__eyebrow">Complete your registration</p>
      <h1 className="auth-form__headline">Set your password.</h1>
      <p className="auth-form__subtext">
        You've been added to a team on MerchForge. Choose a password to finish
        setting up your account.
      </p>

      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="auth-form__field">
          <label htmlFor="Password" className="auth-form__label">
            Password
          </label>
          <input
            id="Password"
            name="Password"
            type="password"
            autoComplete="new-password"
            className={`auth-form__input${errors.Password ? ' auth-form__input--error' : ''}`}
            value={formData.Password}
            onChange={handleChange}
            aria-invalid={Boolean(errors.Password)}
            aria-describedby={errors.Password ? 'Password-error' : undefined}
            autoFocus
          />
          {errors.Password && (
            <span id="Password-error" className="auth-form__field-error" role="alert">
              {errors.Password}
            </span>
          )}
        </div>

        <div className="auth-form__field">
          <label htmlFor="ConfirmPassword" className="auth-form__label">
            Confirm password
          </label>
          <input
            id="ConfirmPassword"
            name="ConfirmPassword"
            type="password"
            autoComplete="new-password"
            className={`auth-form__input${errors.ConfirmPassword ? ' auth-form__input--error' : ''}`}
            value={formData.ConfirmPassword}
            onChange={handleChange}
            aria-invalid={Boolean(errors.ConfirmPassword)}
            aria-describedby={errors.ConfirmPassword ? 'ConfirmPassword-error' : undefined}
          />
          {errors.ConfirmPassword && (
            <span id="ConfirmPassword-error" className="auth-form__field-error" role="alert">
              {errors.ConfirmPassword}
            </span>
          )}
        </div>

        <div className="auth-form__field">
          <label className="auth-form__checkbox">
            <input
              type="checkbox"
              id="AgreedToTerms"
              name="AgreedToTerms"
              checked={formData.AgreedToTerms}
              onChange={handleAgreedToTermsChange}
              aria-invalid={Boolean(errors.AgreedToTerms)}
              aria-describedby={errors.AgreedToTerms ? 'AgreedToTerms-error' : undefined}
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
          {errors.AgreedToTerms && (
            <span id="AgreedToTerms-error" className="auth-form__field-error" role="alert">
              {errors.AgreedToTerms}
            </span>
          )}
        </div>

        {acceptInvitationError && (
          <p className="auth-form__server-error" role="alert">
            Something went wrong setting your password. The link may have expired
            — ask whoever added you to send a new invitation, or try again.
          </p>
        )}

        <button type="submit" className="auth-form__submit" disabled={acceptInvitationPending}>
          {acceptInvitationPending ? 'Setting password…' : 'Set password'}
        </button>
      </form>
    </AuthShell>
  );
}
