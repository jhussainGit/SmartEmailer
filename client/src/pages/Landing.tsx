import { Button } from "@/components/ui/button";
import LandingHero from "@/components/LandingHero";
import { useLocation } from "wouter";
import { Check, ArrowRight } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      <LandingHero onGetStarted={() => setLocation('/composer')} />
      
      <div className="bg-muted/30 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ProEmail AI?</h2>
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
  );
}
