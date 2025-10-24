import { Helmet } from "react-helmet-async";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us | Smart Emailer Pro</title>
        <meta 
          name="description" 
          content="Get in touch with Smart Emailer Pro. Send us your questions, feedback, or support requests. We're here to help with your email writing needs."
        />
        <meta 
          name="keywords" 
          content="contact Smart Emailer Pro, email support, customer service, feedback, help"
        />
        <meta property="og:title" content="Contact Us | Smart Emailer Pro" />
        <meta property="og:description" content="Get in touch with Smart Emailer Pro. We're here to help with your email writing needs." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://smart-emailer-pro.replit.app/contact" />
        <link rel="canonical" href="https://smart-emailer-pro.replit.app/contact" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <ContactForm />
      </div>
    </>
  );
}
