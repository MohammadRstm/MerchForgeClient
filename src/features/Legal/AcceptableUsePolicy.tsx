import { Link } from "react-router";
import LegalPage from "./components/LegalPage";
import { routes } from "../../config/routes";
import { LEGAL_EFFECTIVE_DATE, LEGAL_VERSIONS } from "./legalMeta";

const AcceptableUsePolicy = () => (
    <LegalPage
        title="Acceptable Use Policy"
        version={LEGAL_VERSIONS.acceptableUse}
        effectiveDate={LEGAL_EFFECTIVE_DATE}
    >
        <p>
            This Acceptable Use Policy is part of our{" "}
            <Link to={routes.TERMS}>Terms of Service</Link> and applies to every Business
            owner, team member, and Customer using MerchForge. It exists to keep MerchForge
            safe, lawful, and usable for everyone — merchants and shoppers alike.
        </p>

        <h2>1. Illegal Activity</h2>
        <p>
            Do not use MerchForge for any purpose that is illegal, or to sell, list, or
            promote anything illegal to sell, own, or distribute in the jurisdictions your
            storefront serves.
        </p>

        <h2>2. Fraud and Misrepresentation</h2>
        <ul>
            <li>Do not create fake accounts, businesses, orders, or reviews.</li>
            <li>
                Do not misrepresent a product — its condition, authenticity, origin,
                pricing, or availability — to customers.
            </li>
            <li>Do not use MerchForge to run a scam, pyramid scheme, or deceptive promotion.</li>
            <li>
                Do not submit a product review for a product you did not actually
                purchase, or attempt to manipulate reviews (yours or another merchant's)
                through fake accounts, coercion, or incentives conditioned on a specific
                rating.
            </li>
        </ul>

        <h2>3. Abuse of the Platform</h2>
        <ul>
            <li>Do not attempt to disrupt, overload, or degrade MerchForge's service for other users.</li>
            <li>Do not attempt to circumvent rate limits, feature-usage credits, or any other usage restriction.</li>
            <li>Do not attempt to gain unauthorized access to another account, business, or storefront.</li>
            <li>Do not probe, scan, or test the platform's security other than through a responsible, authorized disclosure process.</li>
            <li>Do not upload malware, or any file designed to exploit or disrupt a system.</li>
        </ul>

        <h2>4. Intellectual Property Violations</h2>
        <p>
            Do not upload, list, or sell anything that infringes someone else's copyright,
            trademark, patent, or other intellectual property right — including using
            counterfeit branding, stolen product photography, or plagiarized descriptions.
        </p>

        <h2>5. Harmful or Prohibited Content</h2>
        <p>Do not use MerchForge to upload, list, or generate content that is:</p>
        <ul>
            <li>Sexually explicit, or exploits or endangers a minor in any way;</li>
            <li>Hateful, harassing, or intended to incite violence against a person or group;</li>
            <li>Defamatory or knowingly false in a way intended to harm someone;</li>
            <li>A weapon (firearms, ammunition, explosives) where its sale is restricted or illegal in the relevant jurisdiction;</li>
            <li>A controlled substance, or drug paraphernalia marketed for illegal drug use;</li>
            <li>Stolen goods, or goods you do not have the right to sell.</li>
        </ul>

        <h2>6. Misleading or Fraudulent Products</h2>
        <p>
            A product listing must accurately represent what the customer will receive.
            This applies with equal force to listings created or edited with AI assistance
            — see our <Link to={routes.AI_TERMS}>AI Terms</Link>. An AI-drafted description
            that overstates a product's condition, materials, or capabilities is still a
            misleading listing, and the Merchant who publishes it is responsible for it.
        </p>

        <h2>7. Abuse of AI Functionality</h2>
        <ul>
            <li>
                Do not use MerchForge's AI-assisted features to generate content that
                violates any other section of this policy — for example, generating
                misleading product claims, infringing imagery, or content that would
                otherwise be prohibited if written or created by hand.
            </li>
            <li>
                Do not attempt to use the AI product-listing assistant or image tools for a
                purpose unrelated to creating or editing your own product listings.
            </li>
            <li>
                Do not attempt to extract, reverse-engineer, or misuse the underlying AI
                provider's system through MerchForge.
            </li>
        </ul>

        <h2>8. Circumventing Limits and Credits</h2>
        <p>
            AI-assisted features are metered by usage credits tied to your subscription
            plan. Do not attempt to bypass, multiply, or falsify credit usage — for example,
            by automating requests to the AI features outside of normal use, or by
            exploiting a bug to obtain credits you have not been granted.
        </p>

        <h2>9. Attacks on the Platform</h2>
        <p>
            Do not attempt to attack, disable, or gain unauthorized access to MerchForge's
            infrastructure, other users' accounts or businesses, or any system MerchForge
            depends on (including the third-party services listed in our{" "}
            <Link to={routes.PRIVACY}>Privacy Policy</Link>).
        </p>

        <h2>10. Enforcement</h2>
        <p>
            A violation of this policy may result in content removal, feature restriction,
            account suspension, or termination, as described in our{" "}
            <Link to={routes.TERMS}>Terms of Service</Link>. We may also be required to
            report certain conduct — such as content that endangers a minor — to the
            appropriate authorities.
        </p>

        <h2>11. Reporting a Violation</h2>
        <p>
            If you believe a Business, Customer, or piece of content on MerchForge violates
            this policy, contact us — see the Terms of Service for our contact details.
        </p>
    </LegalPage>
);

export default AcceptableUsePolicy;
