import { Link } from "react-router";
import AuthShell from "../../../components/AuthShell/AuthShell";
import "../../../components/AuthShell/AuthForm.css";
import { routes } from "./../../../config/routes";
import useAcceptInvitationPage from "./hooks/useAcceptInvitationPage";

export default function AcceptInvitation() {
  const {
    acceptInvitationFormData,
    errors,
    isInvitationInvalid,
    acceptInvitationPending,
    acceptInvitationError,
    acceptInvitationSuccess,

    domains,
    domainsLoading,
    domainsError,
    domainCategories,
    categoriesLoading,
    productAttributes,
    productAttributesLoading,

    newCategoryInput,
    newCategoryError,

    submit,
    handleChange,
    onDomainChange,
    addNewCategory,
    removeNewCategory,
    toggleProductAttribute,
    handleNewCategoryInputChange,
  } = useAcceptInvitationPage();

  if (isInvitationInvalid) {
    return (
      <AuthShell>
        <div className="auth-form__status">
          <h1 className="auth-form__headline">This invitation link isn't valid.</h1>
          <p className="auth-form__subtext">
            We couldn't find a valid email address on this link. Double-check the invitation
            email, or reach out and we'll send you a new one.
          </p>
        </div>
      </AuthShell>
    );
  }

  if (acceptInvitationSuccess) {
    return (
      <AuthShell>
        <div className="auth-form__status">
          <h1 className="auth-form__headline">You're all set.</h1>
          <p className="auth-form__subtext">
            Your MerchForge account has been created. You can log in now and start setting up
            your catalog.
          </p>
          <Link to={routes.LOGIN} className="auth-form__submit auth-form__submit--link">
            Go to login
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <p className="auth-form__eyebrow">Complete your registration</p>
      <h1 className="auth-form__headline">You're almost in.</h1>
      <p className="auth-form__subtext">
        Fill in your details to finish setting up your MerchForge business account.
      </p>

      <form className="auth-form" onSubmit={submit} noValidate>
        <div className="auth-form__row">
          <div className="auth-form__field">
            <label htmlFor="FirstName" className="auth-form__label">
              First name
            </label>
            <input
              id="FirstName"
              name="FirstName"
              type="text"
              autoComplete="given-name"
              className={`auth-form__input${errors.FirstName ? ' auth-form__input--error' : ''}`}
              value={acceptInvitationFormData.FirstName}
              onChange={handleChange}
              aria-invalid={Boolean(errors.FirstName)}
              aria-describedby={errors.FirstName ? 'FirstName-error' : undefined}
            />
            {errors.FirstName && (
              <span id="FirstName-error" className="auth-form__field-error" role="alert">
                {errors.FirstName}
              </span>
            )}
          </div>

          <div className="auth-form__field">
            <label htmlFor="LastName" className="auth-form__label">
              Last name
            </label>
            <input
              id="LastName"
              name="LastName"
              type="text"
              autoComplete="family-name"
              className={`auth-form__input${errors.LastName ? ' auth-form__input--error' : ''}`}
              value={acceptInvitationFormData.LastName}
              onChange={handleChange}
              aria-invalid={Boolean(errors.LastName)}
              aria-describedby={errors.LastName ? 'LastName-error' : undefined}
            />
            {errors.LastName && (
              <span id="LastName-error" className="auth-form__field-error" role="alert">
                {errors.LastName}
              </span>
            )}
          </div>
        </div>

        <div className="auth-form__field">
          <label htmlFor="BusinessName" className="auth-form__label">
            Business name
          </label>
          <input
            id="BusinessName"
            name="BusinessName"
            type="text"
            autoComplete="organization"
            className={`auth-form__input${errors.BusinessName ? ' auth-form__input--error' : ''}`}
            value={acceptInvitationFormData.BusinessName}
            onChange={handleChange}
            aria-invalid={Boolean(errors.BusinessName)}
            aria-describedby={errors.BusinessName ? 'BusinessName-error' : undefined}
          />
          {errors.BusinessName && (
            <span id="BusinessName-error" className="auth-form__field-error" role="alert">
              {errors.BusinessName}
            </span>
          )}
        </div>

        <div className="auth-form__field">
          <label htmlFor="email" className="auth-form__label">
            Email
          </label>
          <input
            id="email"
            name="Email"
            type="email"
            className="auth-form__input auth-form__input--disabled"
            value={acceptInvitationFormData.Email}
            disabled
            readOnly
          />
          <span className="auth-form__hint">This is the email your invitation was sent to.</span>
        </div>

        <div className="auth-form__row">
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
              value={acceptInvitationFormData.Password}
              onChange={handleChange}
              aria-invalid={Boolean(errors.Password)}
              aria-describedby={errors.Password ? 'Password-error' : undefined}
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
              value={acceptInvitationFormData.ConfirmPassword}
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
        </div>

        <div className="auth-form__field">
          <label htmlFor="BusinessDomainId" className="auth-form__label">
            What does your business sell?
          </label>
          <select
            id="BusinessDomainId"
            name="BusinessDomainId"
            className={`auth-form__input${errors.BusinessDomainId ? ' auth-form__input--error' : ''}`}
            value={acceptInvitationFormData.BusinessDomainId}
            onChange={(e) => onDomainChange(e.target.value)}
            disabled={domainsLoading || domainsError}
            aria-invalid={Boolean(errors.BusinessDomainId)}
            aria-describedby={errors.BusinessDomainId ? 'BusinessDomainId-error' : undefined}
          >
            <option value="">
              {domainsLoading ? 'Loading…' : 'Select a business type'}
            </option>
            {domains?.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </select>
          <span className="auth-form__hint">
            This determines the product categories available to your store.
          </span>
          {domainsError && (
            <span className="auth-form__field-error" role="alert">
              Couldn't load business types. Refresh the page and try again.
            </span>
          )}
          {errors.BusinessDomainId && (
            <span id="BusinessDomainId-error" className="auth-form__field-error" role="alert">
              {errors.BusinessDomainId}
            </span>
          )}
        </div>

        {acceptInvitationFormData.BusinessDomainId && (
          <div className="auth-form__field">
            <span className="auth-form__label">Your categories</span>

            {categoriesLoading ? (
              <span className="auth-form__hint">Loading categories…</span>
            ) : (
              <>
                <span className="auth-form__hint">
                  These come with your business type and are ready to use.
                </span>
                <ul className="auth-form__chips" data-testid="existing-categories">
                  {domainCategories?.map((category) => (
                    <li key={category.id} className="auth-form__chip">
                      {category.name}
                    </li>
                  ))}
                </ul>

                <span className="auth-form__hint">
                  Need something else? Add it below — it'll be private to your store.
                </span>

                {acceptInvitationFormData.NewCategoryNames.length > 0 && (
                  <ul className="auth-form__chips" data-testid="new-categories">
                    {acceptInvitationFormData.NewCategoryNames.map((name) => (
                      <li key={name} className="auth-form__chip auth-form__chip--custom">
                        {name}
                        <button
                          type="button"
                          className="auth-form__chip-remove"
                          onClick={() => removeNewCategory(name)}
                          aria-label={`Remove ${name}`}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="auth-form__category-add">
                  <input
                    id="NewCategory"
                    type="text"
                    placeholder="e.g. Vintage"
                    className={`auth-form__input${newCategoryError ? ' auth-form__input--error' : ''}`}
                    value={newCategoryInput}
                    onChange={(e) => handleNewCategoryInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      // Enter adds a category rather than submitting the whole
                      // form, which would be a surprising way to lose the input.
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addNewCategory();
                      }
                    }}
                    aria-label="New category name"
                    aria-invalid={Boolean(newCategoryError)}
                  />
                  <button
                    type="button"
                    className="auth-form__add-category"
                    onClick={addNewCategory}
                    disabled={!newCategoryInput.trim()}
                  >
                    Add
                  </button>
                </div>

                {newCategoryError && (
                  <span className="auth-form__field-error" role="alert">
                    {newCategoryError}
                  </span>
                )}
                {errors.NewCategoryNames && (
                  <span className="auth-form__field-error" role="alert">
                    {errors.NewCategoryNames}
                  </span>
                )}
              </>
            )}
          </div>
        )}

        {acceptInvitationFormData.BusinessDomainId && (
          <div className="auth-form__field">
            <span className="auth-form__label">Product details</span>
            <span className="auth-form__hint">
              Every product has an image, title, description and price. Pick any
              extra details your products need — you'll be asked for these when
              adding a product.
            </span>

            {productAttributesLoading ? (
              <span className="auth-form__hint">Loading product details…</span>
            ) : (
              <div className="auth-form__checkboxes" data-testid="product-attributes">
                {productAttributes?.map((attribute) => (
                  <label key={attribute.key} className="auth-form__checkbox">
                    <input
                      type="checkbox"
                      checked={acceptInvitationFormData.SelectedProductAttributeKeys.includes(
                        attribute.key
                      )}
                      onChange={() => toggleProductAttribute(attribute.key)}
                    />
                    <span>{attribute.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {acceptInvitationError && (
          <p className="auth-form__server-error" role="alert">
            Something went wrong submitting your registration. Please try again.
          </p>
        )}

        <button type="submit" className="auth-form__submit" disabled={acceptInvitationPending}>
          {acceptInvitationPending ? 'Creating account…' : 'Complete registration'}
        </button>
      </form>
    </AuthShell>
  );
}
