import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import LandingHero from "@/components/LandingHero";
import { useLocation } from "wouter";
import { Check, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const emailExamples = [
  {
    title: "Professional Cover Letter",
    style: "Professional Formal",
    inputs: {
      recipient: "Ms. Sarah Chen",
      sender: "John Anderson",
      subject: "Application for Senior Software Engineer Position",
      language: "English"
    },
    content: `Dear Ms. Chen,

I am writing to express my strong interest in the Senior Software Engineer position at TechCorp, as advertised on LinkedIn. With over 7 years of experience in full-stack development and a proven track record of delivering scalable solutions, I am confident in my ability to contribute effectively to your engineering team.

In my current role at InnovateSoft, I have led the development of microservices architectures serving over 2 million users, resulting in a 40% improvement in system performance. My expertise in React, Node.js, and cloud infrastructure aligns perfectly with the requirements outlined in your job description.

I am particularly drawn to TechCorp's commitment to innovation and would welcome the opportunity to discuss how my skills and experience can support your team's objectives. Please find my resume attached for your review.

Thank you for considering my application. I look forward to the possibility of discussing this opportunity further.

Best regards,
John Anderson`
  },
  {
    title: "Networking Email",
    style: "Friendly Professional",
    inputs: {
      recipient: "Dr. Emily Rodriguez",
      sender: "Michael Brown",
      subject: "Collaboration on AI Research",
      language: "English"
    },
    content: `Hi Dr. Rodriguez,

I hope this email finds you well! I came across your recent paper on machine learning applications in healthcare and was thoroughly impressed by your innovative approach to predictive diagnostics.

I'm currently leading an AI research team at MedTech Solutions, and we're exploring similar applications in patient outcome prediction. Your work on neural network optimization particularly resonated with our current challenges. I'd love to connect and explore potential collaboration opportunities.

Would you be available for a brief call next week? I'd be happy to work around your schedule. Looking forward to hearing from you!

Best,
Michael Brown
AI Research Lead, MedTech Solutions`
  },
  {
    title: "Business Proposal",
    style: "Executive",
    inputs: {
      recipient: "Mr. David Thompson",
      sender: "Lisa Wang",
      subject: "Strategic Partnership Proposal",
      language: "English"
    },
    content: `Dear Mr. Thompson,

Following our discussion at the Tech Summit last month, I am pleased to present a strategic partnership proposal that I believe will create significant value for both our organizations.

GlobalTech's expertise in cloud infrastructure, combined with your company's market leadership in enterprise software, presents a compelling opportunity. Our preliminary analysis suggests this partnership could expand market reach by 35% while reducing operational costs by 20%.

I have attached a comprehensive proposal outlining the partnership structure, revenue sharing model, and implementation timeline. I would appreciate the opportunity to discuss this in detail at your earliest convenience.

I am confident this collaboration will position both our companies for sustained growth in the evolving technology landscape.

Best regards,
Lisa Wang
Chief Business Development Officer, GlobalTech`
  },
  {
    title: "Academic Inquiry",
    style: "Academic Formal",
    inputs: {
      recipient: "Professor James Wilson",
      sender: "Anna Martinez",
      subject: "Research Collaboration Inquiry",
      language: "English"
    },
    content: `Dear Professor Wilson,

I am writing to inquire about potential research collaboration opportunities in computational linguistics, an area where your work has been particularly influential.

As a doctoral candidate at State University, my research focuses on natural language processing applications in cross-cultural communication. Your recent publication in the Journal of Computational Linguistics provided valuable insights that directly inform my current dissertation work.

I would be honored to discuss potential collaboration on projects examining multilingual semantic analysis. I am particularly interested in contributing to your ongoing research in this domain and would welcome the opportunity to present my preliminary findings for your consideration.

Thank you for considering this request. I look forward to the possibility of working together.

Respectfully,
Anna Martinez
Ph.D. Candidate, Linguistics Department
State University`
  },
  {
    title: "Thank You Note",
    style: "Warm & Appreciative",
    inputs: {
      recipient: "Jennifer Lee",
      sender: "Robert Chen",
      subject: "Thank You - Interview Follow-up",
      language: "English"
    },
    content: `Dear Jennifer,

I wanted to reach out and express my sincere gratitude for taking the time to meet with me yesterday. Our conversation about the Product Manager role at InnovateCo was truly inspiring, and it reinforced my enthusiasm for the position.

I was particularly excited to learn about your team's user-centered approach to product development. The opportunity to work on projects that directly impact customer experience aligns perfectly with my passion for creating meaningful solutions.

Thank you again for the insightful discussion and for sharing your vision for the product roadmap. I'm very much looking forward to the next steps in the process.

Warm regards,
Robert Chen`
  }
];

export default function Landing() {
  const [, setLocation] = useLocation();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Smart Emailer Pro",
    "description": "Free AI-powered email writing platform with 30+ professional writing styles. Generate perfect emails instantly using GPT-5 technology.",
    "url": "https://smart-emailer-pro.replit.app",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "30+ professional writing styles",
      "Multi-language support (20+ languages)",
      "AI-powered email generation with GPT-5",
      "Draft management for authenticated users",
      "LinkedIn profile integration",
      "Job description parsing",
      "Context-aware file attachments"
    ],
    "creator": {
      "@type": "Organization",
      "name": "Indus Bridge Ventures Inc.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "801 Route 1 #1017",
        "addressLocality": "Iselin",
        "addressRegion": "NJ",
        "postalCode": "08831",
        "addressCountry": "US"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Smart Emailer Pro - Free AI Email Writer | 30+ Professional Writing Styles</title>
        <meta 
          name="description" 
          content="Generate professional emails instantly with Smart Emailer Pro. Free AI-powered email writing tool with 30+ styles, multi-language support, and GPT-5 technology. Perfect for business, academic, and personal emails."
        />
        <meta 
          name="keywords" 
          content="AI email writer, free email generator, professional email, business email, email templates, GPT-5, email writing tool, cold email, cover letter, follow-up email, AI writing assistant"
        />
        <meta property="og:title" content="Smart Emailer Pro - Free AI Email Writer | 30+ Professional Writing Styles" />
        <meta property="og:description" content="Generate professional emails instantly with Smart Emailer Pro. Free AI-powered email writing tool with 30+ styles, multi-language support, and GPT-5 technology." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://smart-emailer-pro.replit.app/" />
        <link rel="canonical" href="https://smart-emailer-pro.replit.app/" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen">
        <LandingHero onGetStarted={() => setLocation('/composer')} />
      
      {/* Beta Release Notice */}
      <div className="bg-primary/10 border-y border-primary/20 py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs font-semibold">BETA</Badge>
            <p className="text-sm font-medium">
              This is a beta release. We'd love to hear your feedback!
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation('/contact')}
            data-testid="button-beta-feedback"
            className="bg-background/50 hover:bg-background"
          >
            Send Feedback
          </Button>
        </div>
      </div>
      
      <div id="examples-section" className="bg-muted/30 py-20 px-4">
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Real Email Examples</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what Smart Emailer Pro can create for you. Each example shows the inputs and the professional output.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {emailExamples.map((example, idx) => (
              <Card key={idx} className="p-6">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">{example.title}</h3>
                    <Badge variant="secondary">{example.style}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                    <div>
                      <span className="text-muted-foreground">Recipient:</span>
                      <p className="font-medium">{example.inputs.recipient}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sender:</span>
                      <p className="font-medium">{example.inputs.sender}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Subject:</span>
                      <p className="font-medium">{example.inputs.subject}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Language:</span>
                      <p className="font-medium">{example.inputs.language}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
                    {example.content}
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Smart Emailer Pro?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional email writing made simple with advanced AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card border rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Perfect for Professionals</h3>
              <ul className="space-y-3">
                {[
                  'Generate cover letters with job description integration',
                  'Create networking emails with LinkedIn profile data',
                  'Write executive-level correspondence',
                  'Craft persuasive sales pitches',
                  'Professional follow-ups and thank you notes'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Academic Excellence</h3>
              <ul className="space-y-3">
                {[
                  'Research inquiry emails to professors',
                  'Conference and symposium correspondence',
                  'Communication with supervisors and advisors',
                  'Peer review and academic collaboration',
                  'Formal academic writing style'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => setLocation('/composer')}
              data-testid="button-cta-start-writing"
              className="text-base px-8"
            >
              Start Writing Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
