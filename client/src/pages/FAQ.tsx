import { Helmet } from "react-helmet-async";
import FAQSection from "@/components/FAQSection";

export default function FAQ() {
  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions (FAQ) | Smart Emailer Pro</title>
        <meta 
          name="description" 
          content="Find answers to common questions about Smart Emailer Pro. Learn about our AI email writing features, language support, authentication, drafts, and more."
        />
        <meta 
          name="keywords" 
          content="email generator FAQ, AI email writer help, Smart Emailer Pro questions, email writing support, GPT-5 email help"
        />
        <meta property="og:title" content="Frequently Asked Questions (FAQ) | Smart Emailer Pro" />
        <meta property="og:description" content="Find answers to common questions about Smart Emailer Pro AI email writing tool." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://smartemailer.pro/faq" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FAQ | Smart Emailer Pro" />
        <meta name="twitter:description" content="Find answers to common questions about Smart Emailer Pro AI email writing tool." />
        <link rel="canonical" href="https://smartemailer.pro/faq" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <FAQSection />
      </div>
    </>
  );
}
