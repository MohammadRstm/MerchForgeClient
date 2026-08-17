import { useMemo, useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import logo from '../../assets/logo.svg';
import './AcceptInvitation.css';

const registrationSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  businessName: z.string().trim().min(1, 'Business name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
});

type RegistrationFormValues = z.infer<typeof registrationSchema>;
type FieldErrors = Partial<Record<keyof RegistrationFormValues, string>>;

const REGISTRATION_ENDPOINT = 'https://localhost:7021/api/AuthController/businessOwner/registration';

async function submitBusinessOwnerRegistration(payload: RegistrationFormValues): Promise<void> {
  const response = await fetch(REGISTRATION_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Registration request failed with status ${response.status}`);
  }
}

function readInvitationEmail(): string | null {
  const params = new URLSearchParams(window.location.search);
  const rawEmail = params.get('email');
  if (!rawEmail) return null;

  const parsed = z.string().trim().email().safeParse(rawEmail);
  return parsed.success ? parsed.data : null;
}

export default function AcceptInvitation() {
  const invitationEmail = useMemo(() => readInvitationEmail, []);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const registration = useMutation({
    mutationFn: submitBusinessOwnerRegistration,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!invitationEmail) return;

    const result = registrationSchema.safeParse({
      firstName,
      lastName,
      businessName,
      email: invitationEmail,
    });

    if (!result.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof RegistrationFormValues;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    registration.mutate(result.data);
  };

  const Brand = (
    <a href="/" className="invite__brand">
      <img src={logo} alt="" className="invite__brand-mark" />
      <span className="invite__brand-name">MerchForge</span>
    </a>
  );

  if (!invitationEmail) {
    return (
      <main className="invite">
        <div className="invite__panel">
          {Brand}
          <div className="invite__card invite__card--status">
            <h1 className="invite__headline">This invitation link isn't valid.</h1>
            <p className="invite__subtext">
              We couldn't find a valid email address on this link. Double-check the invitation
              email, or reach out and we'll send you a new one.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (registration.isSuccess) {
    return (
      <main className="invite">
        <div className="invite__panel">
          {Brand}
          <div className="invite__card invite__card--status">
            <h1 className="invite__headline">You're all set.</h1>
            <p className="invite__subtext">
              Your MerchForge account has been created. You can log in now and start setting up
              your catalog.
            </p>
            <a href="/login" className="invite__submit invite__submit--link">
              Go to login
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="invite">
      <div className="invite__panel">
        {Brand}

        <div className="invite__card">
          <p className="invite__eyebrow">Complete your registration</p>
          <h1 className="invite__headline">You're almost in.</h1>
          <p className="invite__subtext">
            Fill in your details to finish setting up your MerchForge business account.
          </p>

          <form className="invite__form" onSubmit={handleSubmit} noValidate>
            <div className="invite__row">
              <div className="invite__field">
                <label htmlFor="firstName" className="invite__label">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  className={`invite__input${fieldErrors.firstName ? ' invite__input--error' : ''}`}
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  aria-invalid={Boolean(fieldErrors.firstName)}
                  aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
                />
                {fieldErrors.firstName && (
                  <span id="firstName-error" className="invite__error" role="alert">
                    {fieldErrors.firstName}
                  </span>
                )}
              </div>

              <div className="invite__field">
                <label htmlFor="lastName" className="invite__label">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  className={`invite__input${fieldErrors.lastName ? ' invite__input--error' : ''}`}
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  aria-invalid={Boolean(fieldErrors.lastName)}
                  aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
                />
                {fieldErrors.lastName && (
                  <span id="lastName-error" className="invite__error" role="alert">
                    {fieldErrors.lastName}
                  </span>
                )}
              </div>
            </div>

            <div className="invite__field">
              <label htmlFor="businessName" className="invite__label">
                Business name
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                autoComplete="organization"
                className={`invite__input${fieldErrors.businessName ? ' invite__input--error' : ''}`}
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                aria-invalid={Boolean(fieldErrors.businessName)}
                aria-describedby={fieldErrors.businessName ? 'businessName-error' : undefined}
              />
              {fieldErrors.businessName && (
                <span id="businessName-error" className="invite__error" role="alert">
                  {fieldErrors.businessName}
                </span>
              )}
            </div>

            <div className="invite__field">
              <label htmlFor="email" className="invite__label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="invite__input invite__input--disabled"
                value={invitationEmail ?? ""}
                disabled
                readOnly
              />
              <span className="invite__hint">This is the email your invitation was sent to.</span>
            </div>

            {registration.isError && (
              <p className="invite__form-error" role="alert">
                Something went wrong submitting your registration. Please try again.
              </p>
            )}

            <button type="submit" className="invite__submit" disabled={registration.isPending}>
              {registration.isPending ? 'Creating account…' : 'Complete registration'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}