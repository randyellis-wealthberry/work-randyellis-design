import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Randy Ellis Design portfolio website",
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-zinc dark:prose-invert max-w-none">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using work.randyellis.design (&quot;the
          Website&quot;), you accept and agree to be bound by the terms and
          provision of this agreement. These Terms of Service
          (&quot;Terms&quot;) constitute a legally binding agreement between you
          and Randy Ellis (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
        </p>

        <h2>2. Description of Service</h2>
        <p>
          The Website is a professional portfolio showcasing design work,
          articles, and insights in the field of AI product design, UX research,
          and product leadership. We also provide:
        </p>
        <ul>
          <li>
            Newsletter subscription service with business strategy content
          </li>
          <li>Blog articles and professional insights</li>
          <li>Project case studies and portfolio content</li>
          <li>Professional contact and networking opportunities</li>
        </ul>

        <h2>3. User Accounts and Registration</h2>
        <h3>Newsletter Subscription</h3>
        <ul>
          <li>
            You may subscribe to our newsletter by providing a valid email
            address
          </li>
          <li>You must provide accurate and complete information</li>
          <li>
            You are responsible for maintaining the confidentiality of your
            subscription
          </li>
          <li>
            You can unsubscribe at any time using the links provided in our
            emails
          </li>
        </ul>

        <h2>4. Acceptable Use Policy</h2>
        <h3>Permitted Uses</h3>
        <ul>
          <li>
            Viewing and reading content for personal and professional
            development
          </li>
          <li>Sharing content with proper attribution</li>
          <li>Subscribing to our newsletter service</li>
          <li>Contacting us for legitimate business purposes</li>
        </ul>

        <h3>Prohibited Uses</h3>
        <p>You may not use the Website to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>
            Transmit spam, unsolicited communications, or malicious content
          </li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Use automated tools to scrape or download content in bulk</li>
          <li>Interfere with the Website&apos;s functionality or security</li>
          <li>Impersonate others or provide false information</li>
          <li>Use the service for commercial purposes without permission</li>
        </ul>

        <h2>5. Intellectual Property Rights</h2>
        <h3>Our Content</h3>
        <ul>
          <li>
            All content, including text, images, videos, and designs, is owned
            by Randy Ellis or licensed to us
          </li>
          <li>
            Content is protected by copyright, trademark, and other intellectual
            property laws
          </li>
          <li>
            You may not reproduce, distribute, or create derivative works
            without permission
          </li>
        </ul>

        <h3>Fair Use</h3>
        <ul>
          <li>You may share excerpts of our content with proper attribution</li>
          <li>Academic and educational use is permitted with citation</li>
          <li>Commercial use requires explicit written permission</li>
        </ul>

        <h3>User-Generated Content</h3>
        <p>If you submit content to us (comments, feedback, etc.):</p>
        <ul>
          <li>You retain ownership of your intellectual property</li>
          <li>
            You grant us a license to use, modify, and display your content
          </li>
          <li>You represent that you have the right to grant this license</li>
        </ul>

        <h2>6. Privacy and Data Protection</h2>
        <p>
          Your privacy is important to us. Our collection and use of personal
          information is governed by our{" "}
          <a
            href="/privacy-policy"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            Privacy Policy
          </a>
          , which is incorporated into these Terms by reference.
        </p>

        <h2>7. Newsletter Terms</h2>
        <h3>Subscription</h3>
        <ul>
          <li>
            Newsletter content focuses on business strategy for product
            designers
          </li>
          <li>We aim to send newsletters weekly but frequency may vary</li>
          <li>Content is for informational purposes only</li>
        </ul>

        <h3>Unsubscribe</h3>
        <ul>
          <li>You can unsubscribe at any time</li>
          <li>Unsubscribe links are provided in all newsletter emails</li>
          <li>
            Processing unsubscribe requests may take up to 5 business days
          </li>
        </ul>

        <h2>8. Disclaimers</h2>
        <h3>Content Accuracy</h3>
        <ul>
          <li>
            We strive to provide accurate information but make no guarantees
          </li>
          <li>Content is for educational and informational purposes only</li>
          <li>Professional advice should be sought for specific situations</li>
        </ul>

        <h3>Service Availability</h3>
        <ul>
          <li>
            We aim for 99.9% uptime but cannot guarantee uninterrupted service
          </li>
          <li>Maintenance and updates may temporarily affect availability</li>
          <li>We reserve the right to modify or discontinue services</li>
        </ul>

        <h2>9. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, RANDY ELLIS SHALL NOT BE
          LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED
          DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER
          INTANGIBLE LOSSES.
        </p>

        <h2>10. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Randy Ellis from and
          against any claims, damages, obligations, losses, liabilities, costs,
          or debt, and expenses (including attorney&apos;s fees) arising from
          your use of the Website or violation of these Terms.
        </p>

        <h2>11. Termination</h2>
        <h3>By You</h3>
        <ul>
          <li>You may stop using the Website at any time</li>
          <li>Unsubscribe from our newsletter using provided links</li>
          <li>Request deletion of your data per our Privacy Policy</li>
        </ul>

        <h3>By Us</h3>
        <ul>
          <li>We may terminate access for violations of these Terms</li>
          <li>We may discontinue the service with reasonable notice</li>
          <li>Termination does not affect accrued rights and obligations</li>
        </ul>

        <h2>12. Governing Law and Jurisdiction</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of Illinois, United States, without regard to its conflict of law
          provisions. Any disputes arising from these Terms shall be subject to
          the exclusive jurisdiction of the courts in Cook County, Illinois.
        </p>

        <h2>13. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Changes will
          be effective immediately upon posting. Your continued use of the
          Website after changes constitutes acceptance of the new Terms. We will
          notify subscribers of material changes via email.
        </p>

        <h2>14. Severability</h2>
        <p>
          If any provision of these Terms is found to be unenforceable or
          invalid, that provision will be limited or eliminated to the minimum
          extent necessary so that the remaining Terms will remain in full force
          and effect.
        </p>

        <h2>15. Contact Information</h2>
        <p>For questions about these Terms of Service:</p>
        <ul>
          <li>
            <strong>Email:</strong> randy.ellis.pro@gmail.com
          </li>
          <li>
            <strong>Website:</strong> work.randyellis.design
          </li>
          <li>
            <strong>Response Time:</strong> We aim to respond within 5 business
            days
          </li>
        </ul>

        <h2>16. Entire Agreement</h2>
        <p>
          These Terms, together with our Privacy Policy, constitute the entire
          agreement between you and Randy Ellis regarding the use of the Website
          and supersede all prior agreements and understandings.
        </p>
      </div>
    </div>
  );
}
