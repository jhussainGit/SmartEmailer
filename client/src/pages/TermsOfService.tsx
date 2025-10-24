import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/">
          <a className="text-sm text-muted-foreground hover:text-foreground mb-8 inline-block" data-testid="link-home">
            ← Back to Home
          </a>
        </Link>

        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last Updated: October 23, 2025</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement between you and 
              Indus Bridge Ventures Inc. ("Company," "we," "us," or "our") governing your access to and 
              use of ProEmail AI (the "Service"), an AI-powered email generation platform.
            </p>
            <p className="mt-4">
              By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. 
              If you do not agree to these Terms, you may not access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              ProEmail AI is an artificial intelligence-powered platform that generates professional, 
              academic, casual, and creative emails based on user inputs. The Service includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>AI-powered email generation using OpenAI's GPT-5 model</li>
              <li>30+ email writing styles across multiple categories</li>
              <li>Draft saving and management for authenticated users</li>
              <li>Customization options including tone, length, and context</li>
              <li>Contact form for support inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Authentication</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Account Creation</h3>
            <p>
              To access certain features (such as saving drafts), you must create an account using 
              Replit authentication. You agree to provide accurate, current, and complete information 
              during the registration process.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Age Requirements</h3>
            <p>
              You must be at least 13 years old to use the Service. If you are between 13 and 18 years 
              old, you represent that you have obtained parental or legal guardian consent to use the Service.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for 
              all activities that occur under your account. You agree to notify us immediately of any 
              unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use Policy</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Permitted Use</h3>
            <p>You may use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Generate professional, academic, and personal emails</li>
              <li>Save and manage email drafts</li>
              <li>Customize email content according to your needs</li>
              <li>Use generated content for lawful purposes</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Prohibited Use</h3>
            <p>You agree NOT to use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Illegal Activities:</strong> Engage in or promote illegal activities, fraud, or deception</li>
              <li><strong>Spam or Harassment:</strong> Generate unsolicited commercial emails (spam), harassment, 
              threats, or abusive content</li>
              <li><strong>Malicious Content:</strong> Create phishing emails, scams, malware distribution, or 
              social engineering attacks</li>
              <li><strong>Impersonation:</strong> Impersonate any person or entity or misrepresent your affiliation</li>
              <li><strong>Intellectual Property Violation:</strong> Violate any third-party intellectual property rights</li>
              <li><strong>Harmful Content:</strong> Generate content that is defamatory, obscene, discriminatory, 
              or promotes violence or hatred</li>
              <li><strong>Service Abuse:</strong> Attempt to reverse engineer, decompile, or extract source code 
              from the Service</li>
              <li><strong>System Interference:</strong> Disrupt, interfere with, or impose unreasonable load on 
              the Service infrastructure</li>
              <li><strong>Automated Misuse:</strong> Use automated systems or bots to access the Service without 
              express permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. AI-Generated Content and Ownership</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Input Ownership</h3>
            <p>
              You retain all ownership rights to the information you provide as input to the Service 
              (prompts, context, preferences). By submitting inputs, you grant us a limited license to 
              process them solely for the purpose of generating email content.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Output Ownership</h3>
            <p>
              Subject to your compliance with these Terms, you own the AI-generated email content 
              ("Output") created through the Service. However, you acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Similar or identical outputs may be generated for other users based on similar inputs</li>
              <li>We do not claim ownership of your generated content</li>
              <li>You are solely responsible for your use of generated content</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Attribution and Disclosure</h3>
            <p>
              While not required, we encourage transparency. You may, at your discretion, disclose that 
              content was AI-generated. You must not misrepresent AI-generated content as entirely 
              human-written in contexts where such disclosure is legally required or professionally expected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. AI Limitations and Disclaimers</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">6.1 Accuracy and Reliability</h3>
            <p className="font-semibold">
              THE SERVICE GENERATES OUTPUTS USING ARTIFICIAL INTELLIGENCE. AI-GENERATED CONTENT MAY NOT 
              BE ACCURATE, COMPLETE, SUITABLE, OR ERROR-FREE.
            </p>
            <p className="mt-3">You acknowledge and agree that:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Generated emails may contain factual errors, inconsistencies, or inappropriate content</li>
              <li>You are responsible for reviewing, verifying, and editing all generated content before use</li>
              <li>We make no warranties regarding the quality, accuracy, or suitability of generated content</li>
              <li>Generated content does not constitute professional advice (legal, financial, medical, etc.)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Third-Party AI Services</h3>
            <p>
              The Service uses OpenAI's GPT-5 model. While we select reliable AI providers, we are not 
              responsible for the performance, availability, or outputs of third-party AI services.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">6.3 No Guarantee of Results</h3>
            <p>
              We do not guarantee that generated emails will achieve any specific result, response, or 
              outcome. The effectiveness of generated content depends on many factors outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">7.1 Service Ownership</h3>
            <p>
              The Service, including its design, features, software, algorithms, and user interface, is 
              owned by Indus Bridge Ventures Inc. and protected by copyright, trademark, and other 
              intellectual property laws. ProEmail AI is a registered trademark.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.2 Limited License</h3>
            <p>
              We grant you a limited, non-exclusive, non-transferable, revocable license to access and 
              use the Service for your personal or internal business purposes, subject to these Terms.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">7.3 Feedback</h3>
            <p>
              If you provide feedback, suggestions, or ideas about the Service, you grant us a perpetual, 
              irrevocable, worldwide, royalty-free license to use, modify, and incorporate such feedback 
              without compensation or attribution.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Privacy and Data Usage</h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy, which describes how we 
              collect, use, and protect your information. Key points:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>We do not use your inputs or outputs to train AI models</li>
              <li>Your data is processed in accordance with GDPR, CCPA, and other applicable privacy laws</li>
              <li>We implement industry-standard security measures to protect your data</li>
              <li>You can request access, correction, or deletion of your data at any time</li>
            </ul>
            <p className="mt-4">
              Please review our{" "}
              <Link href="/privacy">
                <a className="text-primary hover:underline" data-testid="link-privacy-policy">Privacy Policy</a>
              </Link>{" "}
              for complete details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Disclaimers and Limitation of Liability</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">9.1 "AS IS" and "AS AVAILABLE"</h3>
            <p className="font-semibold">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER 
              EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR 
              A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">9.2 No Liability for AI Outputs</h3>
            <p>
              We are not liable for any damages, losses, or consequences arising from your use of 
              AI-generated content, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Inaccurate, incomplete, or inappropriate content</li>
              <li>Negative responses or outcomes from email recipients</li>
              <li>Professional, financial, or reputational harm</li>
              <li>Lost opportunities or business relationships</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">9.3 Limitation of Liability</h3>
            <p className="font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, INDUS BRIDGE VENTURES INC., ITS OFFICERS, DIRECTORS, 
              EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
              OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, 
              OR ANY LOSS OF DATA, USE, OR GOODWILL ARISING OUT OF YOUR USE OF THE SERVICE.
            </p>
            <p className="mt-4">
              Our total liability to you for any claims arising from your use of the Service shall not 
              exceed the amount you paid to us (if any) in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Indus Bridge Ventures Inc., its officers, 
              directors, employees, contractors, and agents from and against any claims, liabilities, 
              damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or 
              related to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Your use or misuse of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Your use of AI-generated content</li>
              <li>Any content you submit to the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">11.1 Termination by You</h3>
            <p>
              You may stop using the Service at any time. To delete your account and associated data, 
              contact us at{" "}
              <a href="mailto:jaffer.hussain@gmail.com" className="text-primary hover:underline">
                jaffer.hussain@gmail.com
              </a>.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">11.2 Termination by Us</h3>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time, with 
              or without cause or notice, including if we believe you have violated these Terms or engaged 
              in prohibited activities.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">11.3 Effect of Termination</h3>
            <p>
              Upon termination, your right to use the Service will immediately cease. We may delete your 
              account and associated data. Sections of these Terms that by their nature should survive 
              termination (including disclaimers, limitations of liability, and indemnification) will 
              continue to apply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Modifications to Service and Terms</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">12.1 Service Changes</h3>
            <p>
              We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) 
              at any time, with or without notice, without liability to you.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">12.2 Terms Updates</h3>
            <p>
              We may update these Terms from time to time. We will notify you of material changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Posting the updated Terms with a new "Last Updated" date</li>
              <li>Sending email notifications to registered users (for significant changes)</li>
            </ul>
            <p className="mt-4">
              Your continued use of the Service after changes become effective constitutes acceptance of 
              the updated Terms. If you do not agree with the changes, you must stop using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">13.1 Informal Resolution</h3>
            <p>
              Before filing a formal claim, you agree to contact us at{" "}
              <a href="mailto:legal@indusbridgeventures.com" className="text-primary hover:underline">
                legal@indusbridgeventures.com
              </a>{" "}
              to attempt to resolve the dispute informally.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">13.2 Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
              where Indus Bridge Ventures Inc. is registered, without regard to its conflict of law provisions.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">13.3 Arbitration</h3>
            <p>
              Any dispute arising out of or relating to these Terms or the Service shall be resolved through 
              binding arbitration, except that either party may seek injunctive relief in court for 
              intellectual property infringement or violations of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Miscellaneous</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">14.1 Entire Agreement</h3>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between you 
              and Indus Bridge Ventures Inc. regarding the Service.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">14.2 Severability</h3>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, the remaining 
              provisions will remain in full force and effect.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">14.3 Waiver</h3>
            <p>
              Our failure to enforce any right or provision of these Terms shall not constitute a waiver 
              of such right or provision.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">14.4 Assignment</h3>
            <p>
              You may not assign or transfer these Terms or your rights hereunder without our prior written 
              consent. We may assign these Terms without restriction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
            <p>
              If you have questions about these Terms of Service, please contact us:
            </p>
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
              These Terms of Service are effective as of October 23, 2025. ProEmail AI is a digital asset 
              owned and operated by Indus Bridge Ventures Inc. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              By using ProEmail AI, you acknowledge that you have read, understood, and agree to be bound 
              by these Terms of Service and our Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
