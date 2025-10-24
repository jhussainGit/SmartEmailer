import { Link } from "wouter";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Smart Emailer Pro</title>
        <meta 
          name="description" 
          content="Read our privacy policy to understand how Smart Emailer Pro collects, uses, and protects your personal information. GDPR and CCPA compliant."
        />
        <meta 
          name="keywords" 
          content="privacy policy, data protection, GDPR, CCPA, personal information, data security"
        />
        <meta property="og:title" content="Privacy Policy | Smart Emailer Pro" />
        <meta property="og:description" content="Read our privacy policy to understand how Smart Emailer Pro protects your personal information." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://smart-emailer-pro.replit.app/privacy" />
        <link rel="canonical" href="https://smart-emailer-pro.replit.app/privacy" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/">
            <a className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block" data-testid="link-home">
              ← Back to Home
            </a>
          </Link>

        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last Updated: October 23, 2025</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              This Privacy Policy describes how Indus Bridge Ventures Inc. ("we," "us," or "our") collects, uses, 
              and protects your information when you use Smart Emailer Pro (the "Service"), our AI-powered email 
              generation platform. We are committed to protecting your privacy and handling your data with 
              transparency and security.
            </p>
            <p className="mt-4">
              By using our Service, you agree to the collection and use of information in accordance with this 
              policy. If you do not agree with our policies and practices, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Information You Provide</h3>
            <p>When you use Smart Emailer Pro, we collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Account Information:</strong> Email address, name, and profile information through Replit authentication</li>
              <li><strong>Email Generation Data:</strong> Information you input for email generation including sender/recipient names, 
              subject lines, topics, LinkedIn profiles, job descriptions, and additional context</li>
              <li><strong>Saved Drafts:</strong> Email drafts you choose to save to your account</li>
              <li><strong>Contact Information:</strong> Name, email address, subject, and message when you contact us through our contact form</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <p>We automatically collect certain information when you use our Service:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Usage Data:</strong> Information about how you interact with our Service, including pages visited, 
              features used, and time spent</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers</li>
              <li><strong>Session Information:</strong> Session cookies to maintain your login state and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Provide the Service:</strong> Generate AI-powered emails based on your inputs and preferences</li>
              <li><strong>Maintain Your Account:</strong> Create and manage your user account and saved drafts</li>
              <li><strong>Improve Our Service:</strong> Analyze usage patterns to enhance features and user experience</li>
              <li><strong>Customer Support:</strong> Respond to your inquiries and provide technical assistance</li>
              <li><strong>Security:</strong> Detect, prevent, and address technical issues and security threats</li>
              <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. AI and Data Processing</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">4.1 AI-Powered Email Generation</h3>
            <p>
              Smart Emailer Pro uses OpenAI's GPT-5 model to generate email content. When you use our email generation feature:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Your input data (prompts, context, preferences) is sent to OpenAI's API for processing</li>
              <li>Generated emails are created using advanced AI reasoning capabilities</li>
              <li>We do not use your inputs or generated outputs to train AI models</li>
              <li>Generated content is returned to you and, if you choose, saved as a draft in our database</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Accuracy and Reliability</h3>
            <p>
              AI-generated content may not always be accurate, complete, or suitable for your specific needs. 
              You are responsible for reviewing, verifying, and editing all generated content before use. 
              We do not guarantee the accuracy or suitability of AI-generated emails.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Third-Party AI Services</h3>
            <p>
              We use OpenAI's services for AI processing. OpenAI's data usage policies apply to data sent 
              to their API. We recommend not including highly sensitive or confidential information in your 
              email generation requests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
            <p>We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Third-Party Service Providers:</strong> We share data with service providers who perform 
              services on our behalf (OpenAI for AI processing, Replit for authentication, Neon for database hosting)</li>
              <li><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, 
              or governmental request</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or 
              acquisition, your information may be transferred</li>
              <li><strong>With Your Consent:</strong> We may share information when you explicitly consent</li>
            </ul>
            <p className="mt-4">
              <strong>We do not sell your personal information to third parties.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Encrypted data transmission using HTTPS/TLS</li>
              <li>Secure database storage with access controls</li>
              <li>Session-based authentication with HTTP-only cookies</li>
              <li>Regular security assessments and updates</li>
            </ul>
            <p className="mt-4">
              However, no method of transmission over the internet or electronic storage is 100% secure. 
              While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Privacy Rights</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">7.1 General Rights</h3>
            <p>You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a structured format</li>
              <li><strong>Objection:</strong> Object to certain types of data processing</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.2 GDPR Rights (EU Users)</h3>
            <p>If you are located in the European Economic Area, you have additional rights under GDPR:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Right to withdraw consent at any time</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
              <li>Right to explanation of automated decision-making (AI processing)</li>
              <li>Right to data portability in a machine-readable format</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.3 CCPA Rights (California Users)</h3>
            <p>If you are a California resident, you have rights under the California Consumer Privacy Act:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or shared</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to request deletion of personal information</li>
              <li>Right to non-discrimination for exercising CCPA rights</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.4 Exercising Your Rights</h3>
            <p>
              To exercise any of these rights, please contact us through our{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact Form
              </Link>. We will respond to your request within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
            <p>We retain your information for as long as necessary to provide the Service and fulfill the purposes outlined in this policy:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Account Data:</strong> Retained until you delete your account</li>
              <li><strong>Email Drafts:</strong> Retained until you delete them or delete your account</li>
              <li><strong>Email Generation Inputs:</strong> Not stored permanently; only used for immediate processing</li>
              <li><strong>Usage Logs:</strong> Retained for up to 90 days for security and analytics purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Cookies and Tracking</h2>
            <p>We use the following types of cookies:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Essential Cookies:</strong> Required for authentication and session management</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings. However, disabling cookies may affect 
              your ability to use certain features of our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p>
              Our Service is not intended for individuals under the age of 13. We do not knowingly collect 
              personal information from children under 13. If you believe we have inadvertently collected 
              information from a child under 13, please contact us immediately through our{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact Form
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. 
              These countries may have data protection laws different from those of your country. We ensure appropriate 
              safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
              We will notify you of any material changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Posting the updated policy on this page with a new "Last Updated" date</li>
              <li>Sending an email notification to registered users (for significant changes)</li>
            </ul>
            <p className="mt-4">
              Your continued use of the Service after changes become effective constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-semibold">Indus Bridge Ventures Inc.</p>
              <p>801 Route 1 #1017</p>
              <p>Iselin, NJ 08831</p>
              <p>United States</p>
              <p className="mt-3">
                For inquiries, please use our <Link href="/contact" className="text-primary hover:underline">Contact Form</Link>
              </p>
            </div>
          </section>

          <section className="border-t pt-8 mt-8">
            <p className="text-sm text-muted-foreground">
              This Privacy Policy is effective as of October 23, 2025. Smart Emailer Pro is a digital asset owned 
              and operated by Indus Bridge Ventures Inc. All rights reserved.
            </p>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
