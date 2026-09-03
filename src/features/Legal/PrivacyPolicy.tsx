import { Link } from "react-router";
import LegalPage from "./components/LegalPage";
import Placeholder from "./components/Placeholder";
import { routes } from "../../config/routes";
import { LEGAL_EFFECTIVE_DATE, LEGAL_VERSIONS } from "./legalMeta";

const PrivacyPolicy = () => (
    <LegalPage
        title="Privacy Policy"
        version={LEGAL_VERSIONS.privacyPolicy}
        effectiveDate={LEGAL_EFFECTIVE_DATE}
    >
        <p>
            This Privacy Policy explains what information MerchForge collects, why, how
            it's stored, who can access it, and the choices you have. It applies to
            Business owners and team members, and to Customers who create an account or
            place an order on a storefront MerchForge powers.
        </p>
        <p>
            This policy describes what the MerchForge software actually does, written
            directly from its implementation, so that every statement here reflects a real
            behavior rather than a generic description. Where something is sent to a named
            third party rather than kept by MerchForge, that distinction is called out
            explicitly.
        </p>

        <h2>1. Information We Collect</h2>

        <h3>1.1 Information you provide</h3>
        <ul>
            <li>
                <strong>Business owner / team member accounts:</strong> first name, last
                name, email address, and password (stored as a one-way hash, never in
                readable form). Owner registration also collects a business name and the
                business type you select.
            </li>
            <li>
                <strong>Customer accounts:</strong> first name, last name, email address,
                and password (also hashed). Optionally, if you save it for checkout: phone
                number and address.
            </li>
            <li>
                <strong>Business/storefront information:</strong> a business's description,
                tagline, logo, contact email and phone, WhatsApp number, physical address,
                social media links, business hours, and brand color — whatever a Merchant
                chooses to fill in for their storefront.
            </li>
            <li>
                <strong>Orders:</strong> when a Customer checks out — with or without an
                account — we collect the name, email, phone, and shipping address needed to
                fulfill that order. This is captured as a snapshot at the time of the order,
                separate from a Customer account's own saved details, so an order's record
                doesn't change if the account information is later edited.
            </li>
            <li>
                <strong>Product reviews:</strong> a required 1–5 star rating and an optional
                written comment, which a Customer may leave only for a product they have
                actually ordered.
            </li>
            <li>
                <strong>Images you upload:</strong> product photos, business logos/favicons,
                and storefront customization images.
            </li>
        </ul>

        <h3>1.2 Information collected automatically</h3>
        <p>
            MerchForge does not currently run any analytics, tracking, or error-monitoring
            service (see Section 4). The backend does write operational application logs —
            request outcomes, timings, and, for the AI features, token counts and which
            action was taken — but these logs are deliberately written to exclude message
            text, prompt contents, or draft contents. Standard web server request
            information (such as IP address, as part of normal HTTP handling) may pass
            through our infrastructure but is not separately collected into a profile about
            you.
        </p>

        <h3>1.3 Authentication information</h3>
        <p>
            When you sign in, we issue a short-lived access token and a longer-lived
            refresh token. The refresh token is stored as a one-way hash in our database —
            never in a form we can read back — and delivered to your browser only as an
            HttpOnly cookie your browser holds, not the raw value we store. Refresh tokens
            are rotated (replaced with a new one) each time they're used, and can be
            revoked — by you signing out, or by a platform administrator for security
            reasons.
        </p>

        <h3>1.4 AI inputs and outputs</h3>
        <p>
            If you use an AI-assisted feature, see Section 3 below for exactly what's sent
            to which provider, and Section 6 for what MerchForge itself stores from that
            interaction.
        </p>

        <h3>1.5 Cookies and local storage</h3>
        <p>
            MerchForge sets one cookie: the HttpOnly refresh-token cookie described above,
            which is strictly necessary to keep you signed in and is not used for tracking
            or advertising. Because it is strictly necessary for the service to function, it
            does not require a separate cookie-consent banner, and MerchForge does not
            currently publish a standalone Cookie Policy for this reason.
        </p>

        <h2>2. Why We Collect Information</h2>
        <p>We collect the information above to:</p>
        <ul>
            <li>Create and secure your account, and keep you signed in;</li>
            <li>Operate your storefront and process orders on it;</li>
            <li>Show product reviews and let Merchants moderate them;</li>
            <li>Provide the AI-assisted product-listing and image-editing features, when you choose to use them;</li>
            <li>Send transactional emails — invitations and order/business notifications (see Section 4);</li>
            <li>Maintain security — for example, detecting and stopping abuse via rate limiting, and keeping an audit trail of sensitive administrative actions.</li>
        </ul>
        <p>MerchForge does not use your information for advertising or sell it to third parties.</p>

        <h2>3. AI Features and What Is Sent to AI Providers</h2>
        <p>
            MerchForge's AI-assisted features are optional — a Merchant chooses to use
            them. Depending on the feature, the following is sent to a third-party AI
            provider in order to generate a result:
        </p>
        <ul>
            <li>
                <strong>AI product-listing assistant</strong> (text conversation) — sent to{" "}
                <strong>OpenAI</strong> (model: gpt-4o-mini): your conversation with the
                assistant, the current draft product details, your business name, your
                business's real category list, and your configured product-field
                definitions. No Customer personal data is sent through this feature.
            </li>
            <li>
                <strong>Voice input for the product-listing assistant</strong> — the raw
                audio you record is sent to <strong>OpenAI's</strong> transcription
                endpoint (model: whisper-1) and converted to text. The audio itself is not
                stored by MerchForge; only the resulting text becomes part of the
                conversation described above.
            </li>
            <li>
                <strong>AI image editing</strong> — sent to <strong>Google (Gemini)</strong>
                : the full bytes of the product photo(s) you select, plus your text
                instruction describing the edit.
            </li>
            <li>
                <strong>AI "suggest details from a photo"</strong> — sent to{" "}
                <strong>Google (Gemini)</strong>: the full bytes of one product photo, plus
                your business's real category and product-field list, so the model can
                propose values based only on what's visible in the photo.
            </li>
        </ul>
        <p>
            We do not control, and cannot guarantee, how an AI provider itself handles data
            it receives, including whether it is used to improve or train that provider's
            own models. See each provider's own privacy/data-use terms for that. If you
            learn more about a provider's specific retention/training commitments, that
            detail should be added here — this document does not assert facts about a
            provider's internal practices that MerchForge cannot verify from its own
            integration.
        </p>

        <h2>4. Third-Party Service Providers</h2>
        <p>
            The following third parties process data on MerchForge's behalf. Each is used
            only for what's listed — MerchForge does not share your information beyond
            what each integration actually needs to function.
        </p>
        <ul>
            <li>
                <strong>OpenAI</strong> — text conversation and audio transcription for the
                AI product-listing assistant (Section 3).
            </li>
            <li>
                <strong>Google (Gemini)</strong> — image editing and photo-based field
                suggestions (Section 3).
            </li>
            <li>
                <strong>Email delivery</strong> — transactional emails (business/team
                invitations, order and website-request notifications) are sent via SMTP.
                No marketing or newsletter email is sent.
            </li>
        </ul>
        <p>
            MerchForge does not currently use any analytics service, error/crash-monitoring
            service, advertising network, or CDN. Background job processing (for example,
            sending an invitation email asynchronously) runs on MerchForge's own
            infrastructure and database — it is not an external queueing service.
        </p>
        <p>
            There is currently no real payment processor connected to MerchForge — see our{" "}
            <Link to={routes.TERMS}>Terms of Service</Link>, Section 14. No payment card or
            bank information is collected or sent anywhere today. If a payment processor is
            added, this Privacy Policy will be updated to name it and describe what it
            receives before it goes live.
        </p>

        <h2>5. Where Information Is Stored</h2>
        <p>
            Structured data (accounts, orders, product catalogs, reviews, and so on) is
            stored in MerchForge's own database.
        </p>
        <p>
            <strong>Uploaded files and images</strong> — product photos, business
            logos/favicons, and storefront customization images — are stored on local disk
            on MerchForge's own server, not in any third-party cloud storage service.
        </p>
        <div className="legal-page__callout">
            <p>
                <strong>Uploaded images are publicly accessible by URL.</strong> Once an
                image is uploaded, its web address can be opened by anyone who has or
                guesses that address — there is no additional login check on the image file
                itself, the same way a normal storefront's product photos are meant to be
                publicly viewable. Do not upload an image you don't want to be publicly
                reachable this way. This applies to product and storefront images; it does
                not apply to account data like your name, email, password, or order
                details, which are not exposed this way.
            </p>
        </div>

        <h2>6. What Is Stored From AI Interactions</h2>
        <p>
            For the AI product-listing assistant, MerchForge stores the conversation text
            (your messages and the assistant's replies) and the resulting draft product
            details, tied to your business account. For AI image editing, MerchForge stores
            the instruction text you gave and the URLs of the input and output images (the
            image files themselves are stored as described in Section 5, not as part of
            this record). This is kept as a record of what was asked for and what came
            back.
        </p>
        <p>
            Separately, MerchForge's own operational application logs are deliberately
            written to exclude the actual prompt or response text — they record only which
            action was taken, timing, and token-usage counts, for diagnosing problems
            without retaining conversation content in that particular log.
        </p>

        <h2>7. Who Can Access Your Information</h2>
        <ul>
            <li>You, for your own account information;</li>
            <li>
                The Business owner/team, for information tied to their own business
                (products, orders, reviews on their storefront, business profile);
            </li>
            <li>
                MerchForge platform administrators, where necessary for support, security,
                or enforcing these terms — administrative actions like disabling an account
                or revoking sessions are recorded in an internal audit trail;
            </li>
            <li>The third-party service providers listed in Section 4, only for the specific purpose described there.</li>
        </ul>

        <h2>8. Data Transfers</h2>
        <p>
            Using a third-party AI or email provider may involve transferring data to
            servers outside the country you or your business are located in, depending on
            where that provider operates. <Placeholder>
                [WHETHER MERCHFORGE TARGETS EU USERS, AND ANY RESULTING GDPR/CROSS-BORDER
                TRANSFER OBLIGATIONS, NEEDS TO BE CONFIRMED BY THE BUSINESS AND REVIEWED BY
                COUNSEL]
            </Placeholder>.
        </p>

        <h2>9. Data Retention</h2>
        <p>
            Account, business, order, and review data is retained for as long as the
            related account exists. Some specific gaps to be aware of, stated plainly
            rather than glossed over:
        </p>
        <ul>
            <li>
                Expired or revoked sign-in session tokens are not automatically purged
                today — they remain in the database, marked expired/revoked, rather than
                being deleted on a schedule.
            </li>
            <li>
                When a product photo or other uploaded image is removed from the catalog,
                the underlying file is not automatically deleted from disk — only the
                catalog reference to it is removed.
            </li>
        </ul>
        <p>
            Both of these are known gaps we intend to close; they are stated here rather
            than described as something they are not.
        </p>

        <h2>10. Data Deletion and Your Rights</h2>
        <div className="legal-page__callout">
            <p>
                <strong>There is currently no self-service "delete my account" option</strong>{" "}
                for either a Business owner/team-member account or a Customer account. A
                platform administrator can disable an account, which blocks sign-in and
                revokes its sessions, but this does not delete the underlying data. To
                request deletion of your account or personal information today, contact us
                at <Placeholder>[CONTACT EMAIL]</Placeholder> and we will handle it manually
                until self-service deletion is built.
            </p>
        </div>
        <p>
            Depending on where you live, you may have rights to access, correct, or request
            deletion of your personal information, or to object to certain processing.{" "}
            <Placeholder>
                [A FULL, JURISDICTION-SPECIFIC RIGHTS SECTION — E.G. GDPR/CCPA-STYLE RIGHTS —
                NEEDS TO BE ADDED BASED ON WHERE MERCHFORGE'S USERS ARE LOCATED, REVIEWED BY
                COUNSEL]
            </Placeholder>
            .
        </p>

        <h2>11. Security</h2>
        <p>MerchForge applies the following security measures, as actually implemented:</p>
        <ul>
            <li>Passwords are never stored in plain text — only as a one-way, salted hash.</li>
            <li>
                Refresh tokens are stored as a one-way hash and rotated on every use;
                access tokens are short-lived.
            </li>
            <li>
                Business owner/staff, SuperAdmin, and Customer accounts use structurally
                separate authentication, so a Customer's credentials can never be used to
                access a business dashboard, or vice versa.
            </li>
            <li>Rate limiting is applied to login, signup, AI-feature, and storefront endpoints to reduce abuse.</li>
            <li>Uploaded files are validated by their actual content, not just their file extension, before being accepted.</li>
            <li>
                Sensitive administrative actions (disabling an account, revoking sessions)
                are recorded in an internal audit trail.
            </li>
        </ul>
        <p>
            No method of storage or transmission is perfectly secure. MerchForge does not
            currently apply database-level encryption at rest beyond the hashing described
            above; any additional at-rest protection depends on the hosting infrastructure
            MerchForge runs on rather than the application itself.
        </p>

        <h2>12. Children's Data</h2>
        <p>
            MerchForge is not directed at children, and account creation requires the
            capacity to enter a binding agreement (see our{" "}
            <Link to={routes.TERMS}>Terms of Service</Link>). We do not knowingly collect
            information from children under the age applicable in their jurisdiction.
        </p>

        <h2>13. Changes to This Policy</h2>
        <p>
            We may update this Privacy Policy from time to time. We'll update the
            "Effective" date above when we do. MerchForge's design already records which
            version of this policy each account agreed to, which is the foundation for
            requiring re-acceptance of a materially changed version in the future — that
            re-acceptance flow does not exist yet.
        </p>

        <h2>14. Contact</h2>
        <p>
            Questions about this Privacy Policy, or a request to access or delete your
            information, can be sent to <Placeholder>[CONTACT EMAIL]</Placeholder>.
        </p>
    </LegalPage>
);

export default PrivacyPolicy;
