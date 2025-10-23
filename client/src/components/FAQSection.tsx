import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How does ProEmail AI work?",
        a: "ProEmail AI uses advanced AI to generate professional emails based on your selected style, context, and requirements. Simply choose a writing style, fill in the details, and our AI will create a polished email in seconds."
      },
      {
        q: "Is ProEmail AI really free?",
        a: "Yes! ProEmail AI is completely free to use. You can generate unlimited emails across all 30+ writing styles without any charges."
      },
      {
        q: "Do I need to create an account?",
        a: "You can use basic features without an account. Creating a free account allows you to save drafts, access email history, and use advanced customization features."
      },
    ]
  },
  {
    category: "Features",
    questions: [
      {
        q: "What writing styles are available?",
        a: "We offer 30+ styles including Professional Formal, Executive, Sales Pitch, Cover Letters, Academic, Networking, Thank You notes, and many more. Each style is optimized for specific situations and contexts."
      },
      {
        q: "Can I input LinkedIn profiles for personalization?",
        a: "Yes! You can add LinkedIn profile URLs for both sender and recipient. Our AI will use this information to create more personalized and contextually relevant emails."
      },
      {
        q: "How do cover letters work?",
        a: "For cover letters, you can input a job description URL, your LinkedIn profile, and specific qualifications. The AI will generate a tailored cover letter that highlights your relevant experience."
      },
      {
        q: "What is the sample email feature?",
        a: "You can paste a sample email to help the AI match a specific writing style or tone. This is perfect when you want to maintain consistency with previous correspondence."
      },
    ]
  },
  {
    category: "Technical",
    questions: [
      {
        q: "Which languages are supported?",
        a: "ProEmail AI supports multiple languages including English, Spanish, French, German, Chinese, Arabic, Portuguese, and Russian. You can switch languages using the language selector in the top navigation."
      },
      {
        q: "How long does it take to generate an email?",
        a: "Most emails are generated in 5-10 seconds. Complex requests with extensive context may take slightly longer."
      },
      {
        q: "Can I edit the generated email?",
        a: "Yes! You can copy the generated email to your preferred email client or text editor and make any modifications you like."
      },
      {
        q: "Is my data secure?",
        a: "Absolutely. We take privacy seriously. Your email content and personal information are never stored or shared. All data is processed securely and deleted after generation."
      },
    ]
  },
  {
    category: "Best Practices",
    questions: [
      {
        q: "How can I get the best results?",
        a: "Be specific with your subject, topic, and context. The more details you provide, the better the AI can tailor the email. Use the additional context field for specific points you want to include."
      },
      {
        q: "Should I always use formal styles for business emails?",
        a: "Not always! Consider your relationship with the recipient. Professional Casual works well for colleagues, while Executive or Professional Formal is better for senior management or external stakeholders."
      },
      {
        q: "Can I use this for academic emails?",
        a: "Yes! We have dedicated academic styles including Research Inquiry, Conference correspondence, and emails to supervisors. These styles follow academic conventions and maintain appropriate formality."
      },
    ]
  },
];

export default function FAQSection() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about ProEmail AI
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-faq-search"
          />
        </div>
      </div>

      <div className="space-y-8">
        {filteredFaqs.map((category, idx) => (
          <div key={idx}>
            <h3 className="text-xl font-semibold mb-4 text-primary">{category.category}</h3>
            <Accordion type="single" collapsible className="space-y-2">
              {category.questions.map((faq, qIdx) => (
                <AccordionItem
                  key={qIdx}
                  value={`${idx}-${qIdx}`}
                  className="border rounded-lg px-4"
                  data-testid={`faq-item-${idx}-${qIdx}`}
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-medium">{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {filteredFaqs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No FAQs found matching your search.</p>
        </div>
      )}
    </div>
  );
}
