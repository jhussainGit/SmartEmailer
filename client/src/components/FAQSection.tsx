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
        q: "How does Smart Emailer Pro work?",
        a: "Smart Emailer Pro uses an advanced multi-layered AI engine powered by OpenAI GPT-4o to generate professional emails. It analyzes your selected writing style, recipient context, language preferences, and any supporting materials you provide (like LinkedIn profiles or attachments) to craft emails that are strategically structured and culturally appropriate. Optional advanced controls let you tune tone, voice, formatting, and the underlying API parameters, and you can export the generated email together with all input parameters and the actual prompts used. Simply choose a style, fill in the details, and the AI handles the rest."
      },
      {
        q: "Is Smart Emailer Pro really free?",
        a: "Yes! Smart Emailer Pro is completely free to use. You can generate unlimited emails across all 50+ writing styles, in 22+ languages, with file attachments and all advanced features — no charges, no hidden fees, no premium tiers."
      },
      {
        q: "Do I need to create an account?",
        a: "You can generate emails without an account. Creating a free account (via Google, GitHub, Apple, or email) unlocks additional features: saving drafts for later editing, accessing your full email generation history, and syncing across devices."
      },
    ]
  },
  {
    category: "Writing Styles & Features",
    questions: [
      {
        q: "What writing styles are available?",
        a: "We offer 50+ writing styles across four categories. Professional styles include Formal, Executive, Sales Pitch, Cover Letter, Proposal, Recruiter Outreach, Resignation, Recommendation, and 9 internal business styles (announcements, policy updates, meeting minutes, project updates, and more). Academic styles cover Formal, Research Inquiry, Conference, Supervisor, and Peer Review. Casual styles include Friendly, Informal, and Enthusiastic. Creative styles include Storytelling, Marketing, Newsletter, Invitation, and Announcement. We also have 5 Korean-specific and 4 Japanese-specific styles for culturally-aware East Asian business communication."
      },
      {
        q: "What are the Korean email styles?",
        a: "We offer 5 Korean-specific styles designed for culturally-appropriate Korean business communication: Korean Business Formal (for superiors with proper hierarchical etiquette), Korean Business Peer (colleague-level communication), Korean Academic (professor correspondence with academic honorifics), Korean Self-Introduction Letter (the traditional job application format), and Korean Seasonal Greeting (business greetings for holidays like Seollal and Chuseok). When using Korean styles with Korean output, you can also control the honorific level."
      },
      {
        q: "What is the Korean Honorific Level selector?",
        a: "When you select a Korean email style and set the output language to Korean, a special honorific level selector appears. It lets you choose between three speech levels: Formal Highest (gyeoksikche) for the most respectful business situations, Polite Standard (haeyoche) for everyday professional use, and Casual (banmal) for close peers. This ensures the generated email uses the culturally appropriate level of formality."
      },
      {
        q: "What are the Japanese email styles?",
        a: "We offer 4 Japanese-specific styles built around keigo (honorific language) and traditional Japanese email structure. Japanese Business Formal uses proper keigo with sonkeigo and kenjougo for professional correspondence. Japanese Business Request specializes in polite request emails with cushioning phrases (kusshon kotoba). Japanese Academic follows strict sensei honorifics for professor correspondence. Japanese Seasonal Greeting generates traditional jikounoaisatsu seasonal greetings with the haikei/keigu format. All styles follow authentic Japanese email structure and etiquette."
      },
      {
        q: "What is dual-language output?",
        a: "When your input language and output language are different, a dual-language option appears. When enabled, the AI generates the complete email in your chosen output language first, then provides a culturally-adapted version in your input language below it. This isn't a word-for-word translation — both versions are independently crafted to feel natural to native speakers, with proper greetings, closings, and cultural conventions for each language."
      },
      {
        q: "How does the Recruiter Outreach style work?",
        a: "The Recruiter Outreach style is purpose-built for talent acquisition professionals. You can choose between Initial Outreach and Follow-Up message types, and select from 8 approach styles (Professional & Direct, Warm & Friendly, Executive Brief, Consultative, Opportunity-Focused, Industry Insider, Relationship Building, Urgent & Confidential). You can also provide a job description URL, candidate LinkedIn profile, agency website, and client company website. The AI uses all of this to craft highly personalized recruitment messages."
      },
      {
        q: "Can I upload file attachments?",
        a: "Yes! Several styles support file attachments up to 5MB. For Cover Letters, you can upload your resume. For Follow-Up emails, you can upload the previous email thread. For Recruiter Outreach, upload a candidate resume or job description. For Proposals, attach supporting documents. For Korean Self-Introduction Letters, attach your resume. For Policy Updates, attach policy documents. The AI reads and incorporates the content from these files to generate more relevant and personalized emails."
      },
      {
        q: "Can I input LinkedIn profiles for personalization?",
        a: "Yes! You can add LinkedIn profile URLs for both sender and recipient. The AI uses these to understand professional context — industry, seniority level, background — and weaves relevant details naturally into the email without explicitly mentioning that a profile was viewed (unless appropriate for the style, like recruiter outreach)."
      },
      {
        q: "What is the sample email feature?",
        a: "You can paste a sample email to help the AI match a specific writing style or tone. The AI analyzes the sample's sentence structure, vocabulary level, formality, and personality, then replicates those qualities in the generated email. This is perfect for maintaining consistency with previous correspondence or matching a particular voice."
      },
    ]
  },
  {
    category: "Advanced Controls & Export",
    questions: [
      {
        q: "What are the Advanced Controls?",
        a: "Below the standard composer fields you'll find an Advanced Controls accordion with four sections. Tone & Voice gives you sliders (1-10) for formality, warmth, directness, confidence, and urgency. Style gives you reading level, point of view (first / second / third person), a contractions toggle, emoji policy (none / minimal / moderate / liberal), sentence style (short-punchy / balanced / long-flowing), and structure format (paragraphs / bullets / hybrid). Content Shaping covers sender persona, reader seniority, CTA type, must-include words, must-avoid words, and free-form custom instructions. API Parameters gives you direct control over the underlying model call: temperature, top_p, frequency penalty, presence penalty, max tokens, model selection, and an optional seed for reproducible output. There is also a 'Reset advanced to defaults' button that returns every advanced control to its baseline."
      },
      {
        q: "Do I have to use the Advanced Controls?",
        a: "No. The advanced section is collapsed by default and every control has a sensible baseline that matches the legacy behavior. If you don't open the accordion or don't change a value, the email is generated exactly as it would be without the controls. The advanced directives are only added to the prompt when you actually move a control off its default."
      },
      {
        q: "What does the temperature slider actually do?",
        a: "Temperature controls how 'creative' the model is. Lower values (0.0-0.4) produce focused, predictable, mostly deterministic output that's great for formal or legal-style emails. Mid-range values (0.5-0.9) are good for everyday business emails. Higher values (1.0-1.5) produce more varied, surprising, and creative phrasing that's useful for marketing copy or storytelling. Values above 1.5 can get incoherent."
      },
      {
        q: "What about top_p, frequency penalty, and presence penalty?",
        a: "Top_p (nucleus sampling) is an alternative way to constrain randomness — lower values keep the model on a tighter set of likely words. Frequency penalty discourages the model from repeating the same words; raise it slightly if outputs feel repetitive. Presence penalty pushes the model to introduce new topics; raise it slightly if you want broader, less narrow emails. Most users never need to touch these — leave them at their defaults unless you have a specific reason to change them."
      },
      {
        q: "Can I pick which AI model is used?",
        a: "Signed-in users can pick between gpt-4o, gpt-4o-mini, and gpt-4-turbo from the API Parameters section. They can also set a numeric seed for (mostly) reproducible output, and raise the max-tokens cap up to 16,000. Anonymous users always run on gpt-4o with a 5,000-token cap to keep the free tier sustainable; the model and seed fields are simply ignored on those requests."
      },
      {
        q: "What is the 'Export details' button?",
        a: "After an email is generated, the preview panel has an 'Export details' button next to Copy and Download. It downloads a single Markdown file containing: the generated email, every input parameter you used (style, language, tone sliders, custom instructions, must-include / must-avoid lists, etc.), the timestamp, the model and token usage, and the actual system prompt and user prompt that were sent to the model. It's perfect for documenting prompt-engineering experiments, sharing reproducible recipes with a team, or auditing what the AI was actually told."
      },
      {
        q: "How does the recipient field and 'Open in Mail' button work?",
        a: "If you fill in the recipient email address before generating, an 'Open in Mail' button appears in the preview panel after generation. Clicking it opens your default mail client (Gmail, Outlook, Apple Mail, etc.) via a mailto: link with the recipient, subject, and full email body pre-filled. From there you just review and send. Nothing is sent on your behalf and the address is not stored unless you also save the result as a draft."
      },
      {
        q: "Are 'must include' and 'must avoid' word lists strict?",
        a: "Yes. Anything you put in the must-include list is added to the prompt as words or phrases the model is required to weave into the email naturally. Anything in the must-avoid list is added as words or phrases the model must not use under any circumstances — useful for banning corporate buzzwords, clichés, or words that have a specific meaning in your industry."
      },
    ]
  },
  {
    category: "AI & Quality",
    questions: [
      {
        q: "What makes the AI engine advanced?",
        a: "Smart Emailer Pro uses a sophisticated multi-layered prompt engineering system. It automatically selects the right communication framework for each email type (like AIDA for sales, STAR for cover letters, or NVC for complaints), applies culturally-aware language conventions for 10+ languages, uses rhetorical strategies tailored to the email's purpose, and runs a 7-point quality check on every generated email. The result is emails that feel strategically crafted rather than generically written."
      },
      {
        q: "What communication frameworks does the AI use?",
        a: "The AI automatically selects the most effective framework based on your email style. Sales emails use AIDA (Attention, Interest, Desire, Action). Cover letters use STAR (Situation, Task, Action, Result). Proposals use SPIN (Situation, Problem, Implication, Need-Payoff). Marketing emails use PAS (Problem, Agitation, Solution). Complaints use NVC (Nonviolent Communication). Executive emails use an inverted-pyramid approach. Recruiter outreach uses a Value Proposition Canvas. Each framework is chosen to maximize the impact of that specific email type."
      },
      {
        q: "Does the AI support cultural conventions for different languages?",
        a: "Yes. When generating emails in non-English languages, the AI applies language-specific cultural intelligence. For example, Japanese emails follow keigo (honorific) conventions. French emails use proper formules de politesse. German emails respect Sie/du distinctions. Arabic emails include appropriate Islamic or formal greetings. Chinese emails account for guanxi (relationship) norms. Korean emails have dedicated honorific level control. This ensures emails feel natural to native speakers, not like translated English."
      },
    ]
  },
  {
    category: "Languages",
    questions: [
      {
        q: "Which languages are supported?",
        a: "Smart Emailer Pro supports 22 languages: English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, Russian, Hindi, Urdu, Farsi, Dutch, Polish, Turkish, Swedish, Vietnamese, Thai, Hebrew, and Greek. You can set the input language (the language you write your context in) and the output language (the language the email is generated in) independently."
      },
      {
        q: "How do I change the website language?",
        a: "The Smart Emailer Pro website interface is currently in English. To view the site in another language, use your browser's built-in translation feature (usually available by right-clicking on the page or through browser settings). The language selectors in the email composer control what language your generated email will be written in, not the website interface."
      },
    ]
  },
  {
    category: "Account & Privacy",
    questions: [
      {
        q: "Can I edit the generated email?",
        a: "Yes! You can copy the generated email to your clipboard and paste it into your preferred email client or text editor for any modifications. The generated email is ready to send as-is, but you're free to customize it further."
      },
      {
        q: "How do drafts work?",
        a: "When signed in, you can save any generated email as a draft. Drafts preserve the email content along with all the settings you used (style, language, context) so you can revisit and regenerate them later. Access your saved drafts anytime from the Drafts page."
      },
      {
        q: "Is my data secure?",
        a: "Yes. Your email content is processed securely and not stored beyond your session unless you explicitly save a draft. We do not share your data with third parties. Account authentication is handled through secure OAuth providers (Google, GitHub, Apple). For more details, see our Privacy Policy."
      },
    ]
  },
  {
    category: "Best Practices",
    questions: [
      {
        q: "How can I get the best results?",
        a: "Provide as much context as possible. Use the Additional Context field for specific points, tone preferences, or details you want included. Add LinkedIn profiles to help the AI understand professional context. Upload relevant attachments (resumes, previous emails, documents) when available. Choose the right email length — short for quick messages, long for detailed proposals. The more the AI knows about your situation, the better the result."
      },
      {
        q: "Which style should I choose for business emails?",
        a: "It depends on your audience. Use Professional Formal or Executive for senior leadership and external stakeholders. Professional Casual works well for colleagues you interact with regularly. For sales outreach, use Sales Pitch. For job applications, use Cover Letter. For recruitment, use Recruiter Outreach. For internal company communications, we have 9 specialized styles including Internal Announcement, Team Update, Policy Update, Project Update, and Meeting Minutes."
      },
      {
        q: "Can I use this for academic emails?",
        a: "Absolutely. We have dedicated academic styles including Academic Formal, Research Inquiry, Conference correspondence, Supervisor emails, and Peer Review. For Korean academic contexts, the Korean Academic style follows proper professor-student communication norms with appropriate honorifics. These styles follow scholarly conventions and maintain the right level of formality."
      },
      {
        q: "How do I write better recruiter outreach emails?",
        a: "Select the Recruiter Outreach style and provide as much context as possible: the candidate's LinkedIn profile, the job description URL, your agency website, and the hiring company's website. Upload the candidate's resume as an attachment. Choose the outreach approach that fits your strategy (consultative for senior roles, warm & friendly for passive candidates, urgent & confidential for executive searches). The AI will personalize the message based on all these inputs."
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
        <h1 className="font-display text-4xl md:text-5xl mb-4" data-testid="text-faq-title">Frequently asked questions</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about Smart Emailer Pro
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
            <h3 className="text-xl font-semibold mb-4 text-primary" data-testid={`text-faq-category-${idx}`}>{category.category}</h3>
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
