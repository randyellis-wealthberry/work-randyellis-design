import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Randy Ellis Design portfolio website",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>1. Information We Collect</h2>
        <h3>Personal Information</h3>
        <ul>
          <li>
            <strong>Email Address:</strong> When you subscribe to our newsletter
          </li>
          <li>
            <strong>Name:</strong> If provided during newsletter signup
            (optional)
          </li>
          <li>
            <strong>Contact Information:</strong> If you reach out via email or
            contact forms
          </li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <ul>
          <li>
            <strong>Analytics Data:</strong> Via Google Analytics and Vercel
            Analytics
          </li>
          <li>
            <strong>Device Information:</strong> Browser type, operating system,
            screen resolution
          </li>
          <li>
            <strong>Usage Data:</strong> Pages visited, time spent, interaction
            patterns
          </li>
          <li>
            <strong>IP Address:</strong> For rate limiting and analytics
            purposes
          </li>
          <li>
            <strong>Referrer Information:</strong> Source of website visits
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>
            <strong>Newsletter Communications:</strong> Sending business
            strategy insights for product designers
          </li>
          <li>
            <strong>Website Analytics:</strong> Understanding user behavior to
            improve content and experience
          </li>
          <li>
            <strong>Security:</strong> Rate limiting to prevent abuse and
            protect our services
          </li>
          <li>
            <strong>Legal Compliance:</strong> Meeting regulatory requirements
            and protecting rights
          </li>
        </ul>

        <h2>3. Information Sharing and Disclosure</h2>
        <h3>Third-Party Services</h3>
        <ul>
          <li>
            <strong>Loops.so:</strong> Newsletter delivery and management
          </li>
          <li>
            <strong>Google Analytics:</strong> Website analytics and performance
            tracking
          </li>
          <li>
            <strong>Vercel Analytics:</strong> Performance monitoring and
            optimization
          </li>
          <li>
            <strong>Zapier:</strong> Workflow automation (optional)
          </li>
        </ul>

        <h3>We Do Not Sell Personal Information</h3>
        <p>
          We do not sell, rent, or trade your personal information to third
          parties for marketing purposes.
        </p>

        <h2>4. Your Rights and Choices</h2>
        <h3>GDPR Rights (EU Residents)</h3>
        <ul>
          <li>
            <strong>Access:</strong> Request a copy of your personal data
          </li>
          <li>
            <strong>Rectification:</strong> Correct inaccurate personal data
          </li>
          <li>
            <strong>Erasure:</strong> Request deletion of your personal data
          </li>
          <li>
            <strong>Portability:</strong> Receive your data in a
            machine-readable format
          </li>
          <li>
            <strong>Object:</strong> Opt-out of certain data processing
            activities
          </li>
          <li>
            <strong>Restrict:</strong> Limit how we process your data
          </li>
        </ul>

        <h3>CCPA Rights (California Residents)</h3>
        <ul>
          <li>
            <strong>Know:</strong> What personal information we collect and how
            it&apos;s used
          </li>
          <li>
            <strong>Delete:</strong> Request deletion of personal information
          </li>
          <li>
            <strong>Opt-Out:</strong> Opt-out of the sale of personal
            information (we don&apos;t sell data)
          </li>
          <li>
            <strong>Non-Discrimination:</strong> Equal service regardless of
            privacy choices
          </li>
        </ul>

        <h3>Exercise Your Rights</h3>
        <p>
          To exercise any of these rights, contact us at:{" "}
          <a href="mailto:randy.ellis.pro@gmail.com">
            randy.ellis.pro@gmail.com
          </a>
        </p>

        <h2>5. Data Security and Retention</h2>
        <h3>Security Measures</h3>
        <ul>
          <li>HTTPS encryption for all data transmission</li>
          <li>Rate limiting to prevent abuse</li>
          <li>Regular security audits of third-party services</li>
          <li>Local data backup with access controls</li>
        </ul>

        <h3>Data Retention</h3>
        <ul>
          <li>
            <strong>Newsletter Subscriptions:</strong> Until you unsubscribe or
            request deletion
          </li>
          <li>
            <strong>Analytics Data:</strong> 26 months (Google Analytics
            default)
          </li>
          <li>
            <strong>Contact Communications:</strong> As long as necessary for
            business purposes
          </li>
        </ul>

        <h2>6. Cookies and Tracking</h2>
        <h3>Essential Cookies</h3>
        <ul>
          <li>
            <strong>Theme Preference:</strong> Remembers your dark/light mode
            choice
          </li>
          <li>
            <strong>Rate Limiting:</strong> Prevents abuse of our services
          </li>
        </ul>

        <h3>Analytics Cookies</h3>
        <ul>
          <li>
            <strong>Google Analytics:</strong> Tracks website usage and
            performance
          </li>
          <li>
            <strong>Vercel Analytics:</strong> Monitors site performance and
            user experience
          </li>
        </ul>

        <h3>Cookie Control</h3>
        <p>
          You can control cookies through your browser settings. Note that
          disabling cookies may affect website functionality.
        </p>

        <h2>7. Children&apos;s Privacy</h2>
        <p>
          Our website is not intended for children under 13. We do not knowingly
          collect personal information from children under 13. If you believe we
          have collected information from a child under 13, please contact us
          immediately.
        </p>

        <h2>8. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries
          other than your own. We ensure appropriate safeguards are in place for
          international transfers, including:
        </p>
        <ul>
          <li>Standard Contractual Clauses with third-party providers</li>
          <li>Adequacy decisions by relevant authorities</li>
          <li>Certification schemes and codes of conduct</li>
        </ul>

        <h2>9. Changes to This Policy</h2>
        <p>
          We may update this privacy policy to reflect changes in our practices
          or legal requirements. We will notify you of material changes by:
        </p>
        <ul>
          <li>Posting the updated policy on our website</li>
          <li>Updating the &quot;Last updated&quot; date</li>
          <li>
            Sending email notifications for significant changes (if you&apos;re
            subscribed)
          </li>
        </ul>

        <h2>10. Contact Information</h2>
        <p>For questions about this privacy policy or your personal data:</p>
        <ul>
          <li>
            <strong>Email:</strong> randy.ellis.pro@gmail.com
          </li>
          <li>
            <strong>Website:</strong> work.randyellis.design
          </li>
          <li>
            <strong>Response Time:</strong> We aim to respond within 30 days
          </li>
        </ul>

        <h2>11. Legal Basis for Processing (GDPR)</h2>
        <ul>
          <li>
            <strong>Consent:</strong> Newsletter subscriptions and optional
            analytics
          </li>
          <li>
            <strong>Legitimate Interest:</strong> Website analytics, security,
            and improvements
          </li>
          <li>
            <strong>Legal Obligation:</strong> Compliance with applicable laws
          </li>
          <li>
            <strong>Contract:</strong> Providing requested services or
            information
          </li>
        </ul>

        <h2>12. Data Protection Officer</h2>
        <p>
          For data protection inquiries specific to GDPR compliance, you can
          reach our privacy contact at the email address above.
        </p>
      </div>
    </div>
  );
}
