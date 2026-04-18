import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Zap, Globe } from "lucide-react";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export default function LandingHero({ onGetStarted }: LandingHeroProps) {
  return (
    <div className="relative py-24 md:py-28 px-4 overflow-hidden">
      {/* Subtle background ornament */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] dark:opacity-[0.25]"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 50% 0%, hsl(var(--primary) / 0.10) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-7">
          <Sparkles className="w-3.5 h-3.5" />
          100% Free · AI-Powered Email Writing
        </div>

        <h1 className="font-display text-[2.75rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
          Write perfect emails in
          <br />
          <span className="italic text-primary">seconds, not minutes.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Choose from 50+ professional writing styles. Generate cover letters, business
          emails, academic correspondence, and more — tailored to your context.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Button
            size="lg"
            onClick={onGetStarted}
            data-testid="button-hero-get-started"
            className="text-base px-8"
          >
            <Mail className="w-5 h-5 mr-2" />
            Get Started Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const element = document.getElementById('examples-section');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            data-testid="button-hero-learn-more"
            className="text-base px-8"
          >
            See Examples
          </Button>
        </div>

        <div className="text-sm text-muted-foreground mb-14 max-w-2xl mx-auto space-y-1.5">
          <p><span className="font-semibold text-foreground">Pro Tip:</span> The more context you provide (LinkedIn profiles, job descriptions, key points), the better your email will be.</p>
          <p><span className="font-semibold text-foreground">File Attachments:</span> Attach resumes, proposals, or email threads — up to 5MB.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
          <div className="bg-card border rounded-lg p-6">
            <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-1.5">50+ Writing Styles</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              From formal business to casual networking, find the perfect tone for any situation.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-1.5">Smart Customization</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Input LinkedIn profiles, job descriptions, and context for personalized emails.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-4">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-1.5">Multi-Language Support</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Generate emails in 22+ languages with proper cultural context.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
