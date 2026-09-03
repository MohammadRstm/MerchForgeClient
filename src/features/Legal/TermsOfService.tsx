import { Link } from "react-router";
import LegalPage from "./components/LegalPage";
import Placeholder from "./components/Placeholder";
import { routes } from "../../config/routes";
import { LEGAL_EFFECTIVE_DATE, LEGAL_VERSIONS } from "./legalMeta";

const TermsOfService = () => (
    <LegalPage
        title="Terms of Service"
        version={LEGAL_VERSIONS.termsOfService}
        effectiveDate={LEGAL_EFFECTIVE_DATE}
    >
        <h2>1. Introduction</h2>
        <p>
            These Terms of Service ("Terms") govern access to and use of MerchForge, a
            platform that lets a business ("Merchant", "you", "your business") create and
            operate an online storefront — managing a product catalog, inventory, and
            orders, and optionally using AI-assisted tools to help write product listings
            and edit product photos.
        </p>
        <p>
            MerchForge is operated by <Placeholder>[LEGAL ENTITY NAME]</Placeholder>, of{" "}
            <Placeholder>[BUSINESS ADDRESS]</Placeholder> ("MerchForge", "we", "us", "our").
            By creating an account, accepting a team invitation, or using MerchForge in any
            way, you agree to these Terms and to our{" "}
            <Link to={routes.PRIVACY}>Privacy Policy</Link>.
        </p>
        <p>
            Separate documents cover two things referenced throughout these Terms: our{" "}
            <Link to={routes.ACCEPTABLE_USE}>Acceptable Use Policy</Link> (what you may not
            do with MerchForge or sell through it) and our{" "}
            <Link to={routes.AI_TERMS}>AI Terms</Link> (specific terms for the AI-assisted
            features). Both are part of these Terms by reference.
        </p>

        <h2>2. Definitions</h2>
        <ul>
            <li>
                <strong>"Account"</strong> means a MerchForge user account — either a
                business owner/team-member account (created by accepting an emailed
                invitation) or a Customer account (created by a shopper on a storefront
                MerchForge powers).
            </li>
            <li>
                <strong>"Business"</strong> means the merchant store record a Merchant
                creates in MerchForge, including its catalog, orders, and storefront
                configuration.
            </li>
            <li>
                <strong>"Customer"</strong> means a shopper who creates an account to check
                out on a storefront MerchForge powers, or who places a guest order without
                one.
            </li>
            <li>
                <strong>"Content"</strong> means anything a Merchant or Customer uploads,
                submits, or generates through MerchForge — product text, images, business
                information, reviews, and AI-generated output.
            </li>
        </ul>

        <h2>3. Eligibility</h2>
        <p>
            You must be legally capable of entering into a binding contract to use
            MerchForge. If you are creating a Business account on behalf of a company or
            other legal entity, you represent that you have the authority to bind that
            entity to these Terms.
        </p>

        <h2>4. Account Creation</h2>
        <p>MerchForge accounts are created in one of three ways:</p>
        <ul>
            <li>
                <strong>Business owner accounts</strong> are invite-only. There is no
                self-service sign-up for a new Business — an owner account is created by
                completing an emailed invitation, at which point the Business itself is
                also created.
            </li>
            <li>
                <strong>Team member accounts</strong> are created when a Business owner
                invites someone to their team; the invited person completes registration by
                setting their own password from the invitation link.
            </li>
            <li>
                <strong>Customer accounts</strong> are self-service — a shopper can sign up
                directly, or be sent to sign up when checking out on a storefront.
            </li>
        </ul>
        <p>
            Every account-creation flow requires you to affirmatively agree to these Terms
            and our Privacy Policy before the account is created; this agreement, and the
            version of each document you agreed to, is recorded against your account.
        </p>

        <h2>5. Account Responsibilities</h2>
        <p>
            You are responsible for keeping your password confidential and for all activity
            under your account. Tell us immediately if you believe your account has been
            accessed without authorization.
        </p>
        <p>
            Passwords are stored as a one-way hash, never in a form we can read back.
            Sign-in sessions are time-limited and can be revoked; a platform administrator
            can disable an account or revoke its active sessions if needed for security or
            policy reasons.
        </p>

        <h2>6. Business Accounts</h2>
        <p>
            A Business owner is responsible for their storefront and everything published
            on it: product listings, pricing, images (including AI-edited or AI-generated
            ones), descriptions, and any team members they invite. Inviting a team member
            grants that person access appropriate to the role assigned; the owner is
            responsible for who they invite and what access they grant.
        </p>

        <h2>7. Acceptable Use</h2>
        <p>
            Use of MerchForge, including what you may sell and how you may use the
            AI-assisted features, is governed by our{" "}
            <Link to={routes.ACCEPTABLE_USE}>Acceptable Use Policy</Link>, which is part of
            these Terms. We may suspend or terminate access for a violation of that policy.
        </p>

        <h2>8. User-Generated Content</h2>
        <p>
            "User-Generated Content" includes product reviews left by Customers, business
            profile information, and any other content a user submits that isn't part of a
            Merchant's own catalog. A Customer may leave a rating and an optional written
            review only for a product they have actually ordered from that Business. A
            Business owner may hide a review from their storefront; hiding does not delete
            it, and MerchForge retains the ability to see it.
        </p>
        <p>
            You are responsible for the content you submit. Do not submit anything that
            violates our <Link to={routes.ACCEPTABLE_USE}>Acceptable Use Policy</Link>,
            infringes someone else's rights, or is unlawful.
        </p>

        <h2>9. Merchant Responsibilities and Product/Content Responsibility</h2>
        <p>
            A Merchant is solely responsible for the accuracy, legality, and quality of the
            products and content on their storefront — including product descriptions and
            images produced with AI assistance, which must be reviewed before publishing.
            See our <Link to={routes.AI_TERMS}>AI Terms</Link> for more on this.
        </p>
        <p>
            MerchForge does not review, approve, or endorse Merchant products or listings
            before they go live, and is not a party to the transaction between a Merchant
            and their Customer.
        </p>

        <h2>10. Intellectual Property</h2>
        <h3>10.1 MerchForge's platform</h3>
        <p>
            MerchForge, its software, design, and branding are owned by us or our
            licensors. These Terms grant you a limited, non-exclusive, non-transferable
            right to use MerchForge for its intended purpose — nothing more.
        </p>
        <h3>10.2 Ownership of Merchant content</h3>
        <p>
            You retain ownership of the product text, photos, and other content you upload
            to your storefront. By uploading it, you grant MerchForge a license to host,
            store, display, and process that content as needed to operate the platform and
            your storefront (for example, generating resized copies, or sending an image to
            an AI provider at your request to edit it).
        </p>
        <h3>10.3 AI-generated content</h3>
        <p>
            Ownership and licensing of AI-generated output (product descriptions, edited or
            generated images) raises legal questions this document is not positioned to
            answer definitively — including whether such output is protectable by copyright
            at all in a given jurisdiction, and what rights the underlying AI provider's own
            terms grant or reserve. See our <Link to={routes.AI_TERMS}>AI Terms</Link> for
            what we can say, and treat this as an area requiring lawyer review before
            launch.
        </p>

        <h2>11. Third-Party Services</h2>
        <p>
            MerchForge relies on third-party services to operate — including AI providers
            for the AI-assisted features, and an email provider for account and order
            notifications. These are described in full in our{" "}
            <Link to={routes.PRIVACY}>Privacy Policy</Link>. We are not responsible for the
            acts or omissions of these third parties, though we choose them carefully and
            only send them what each feature actually needs.
        </p>

        <h2>12. Service Availability</h2>
        <p>
            We aim to keep MerchForge available, but do not guarantee uninterrupted or
            error-free operation. MerchForge is provided on an "as is" and "as available"
            basis. See Section 16 (Disclaimers).
        </p>

        <h2>13. Changes to MerchForge</h2>
        <p>
            We may add, change, or remove features over time, including the specific AI
            providers or models used by the AI-assisted features. We'll make reasonable
            efforts to communicate material changes that affect how you use the platform.
        </p>

        <h2>14. Subscriptions and Payments</h2>
        <div className="legal-page__callout">
            <p>
                <strong>Stated plainly:</strong> at this stage, MerchForge does not process
                real payments. Subscription plans, pricing, and billing periods are tracked
                in the platform for record-keeping, but no payment gateway is connected, and
                no charge is actually collected from a Merchant today. This section describes
                how billing is intended to work once payment processing is added, and will
                need to be revised — with the exact fees, billing cadence, and a real refund
                policy — once it is.
            </p>
        </div>
        <h3>14.1 Fees</h3>
        <p>
            Subscription plan pricing is shown in the product. Fees, if and when payment
            processing is enabled, will be as displayed at the time of subscribing.
        </p>
        <h3>14.2 Refunds and cancellation</h3>
        <p>
            <Placeholder>[REFUND AND CANCELLATION POLICY TO BE DEFINED]</Placeholder> — no
            refund terms exist yet because no payment is currently collected. A Merchant may
            cancel a subscription; cancellation takes effect at the end of the current
            billing period rather than immediately.
        </p>

        <h2>15. Suspension and Termination</h2>
        <p>
            We may suspend or disable an account that violates these Terms, our{" "}
            <Link to={routes.ACCEPTABLE_USE}>Acceptable Use Policy</Link>, or applicable
            law, or where we reasonably believe an account poses a security risk to
            MerchForge or others.
        </p>
        <h3>15.1 Account deletion</h3>
        <p>
            <Placeholder>
                [SELF-SERVICE ACCOUNT DELETION IS NOT YET AVAILABLE — CONTACT US TO REQUEST
                DELETION]
            </Placeholder>
            . Today, an account can be disabled by a platform administrator, which blocks
            sign-in and revokes active sessions, but there is no self-service "delete my
            account" action for either a Business owner/team member or a Customer. This is
            a gap to close, and to reflect properly in the Privacy Policy's data-deletion
            section, before public launch — particularly for any jurisdiction where users
            have a legal right to request deletion.
        </p>

        <h2>16. Disclaimers</h2>
        <p>
            MerchForge is provided "as is" and "as available", without warranties of any
            kind, express or implied, including — to the fullest extent permitted by law —
            warranties of merchantability, fitness for a particular purpose, and
            non-infringement. We do not warrant that AI-generated content will be accurate,
            unique, or suitable for any particular use; see our{" "}
            <Link to={routes.AI_TERMS}>AI Terms</Link>.
        </p>

        <h2>17. Limitation of Liability</h2>
        <p>
            To the fullest extent permitted by applicable law, MerchForge and its officers,
            employees, and licensors will not be liable for indirect, incidental, special,
            consequential, or punitive damages, or for any loss of profits, revenue, data,
            or goodwill, arising from your use of MerchForge.
        </p>
        <p>
            <Placeholder>
                [A LIABILITY CAP AND ANY JURISDICTION-SPECIFIC CARVE-OUTS NEED TO BE SET BY
                COUNSEL]
            </Placeholder>
            .
        </p>

        <h2>18. Indemnification</h2>
        <p>
            You agree to indemnify and hold MerchForge harmless from claims, damages, and
            expenses (including reasonable legal fees) arising from: your use of
            MerchForge, your Content, your violation of these Terms or the{" "}
            <Link to={routes.ACCEPTABLE_USE}>Acceptable Use Policy</Link>, or your violation
            of any law or third-party right.
        </p>

        <h2>19. Governing Law</h2>
        <p>
            These Terms are governed by the laws of{" "}
            <Placeholder>[GOVERNING JURISDICTION]</Placeholder>, without regard to its
            conflict-of-laws principles.
        </p>

        <h2>20. Dispute Resolution</h2>
        <p>
            <Placeholder>
                [DISPUTE RESOLUTION MECHANISM — E.G. COURTS OF A SPECIFIC JURISDICTION,
                ARBITRATION — TO BE DEFINED BY COUNSEL]
            </Placeholder>
            .
        </p>

        <h2>21. Changes to These Terms</h2>
        <p>
            We may update these Terms from time to time. We will update the "Effective"
            date above when we do. Continued use of MerchForge after a change takes effect
            constitutes acceptance of the revised Terms. MerchForge's design already
            records which version of these Terms each account agreed to, which is the
            foundation for requiring re-acceptance of a materially changed version in the
            future — that re-acceptance flow does not exist yet.
        </p>

        <h2>22. Contact</h2>
        <p>
            Questions about these Terms can be sent to{" "}
            <Placeholder>[CONTACT EMAIL]</Placeholder>.
        </p>
    </LegalPage>
);

export default TermsOfService;
