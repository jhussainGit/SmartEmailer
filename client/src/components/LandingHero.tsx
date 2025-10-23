import { Button } from "@/components/ui/button";
import { Sparkles, Mail, Zap, Globe } from "lucide-react";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export default function LandingHero({ onGetStarted }: LandingHeroProps) {
  return (
    <div className="relative py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          AI-Powered Professional Email Writing
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Write Perfect Emails in
          <br />
          <span className="text-primary">Seconds, Not Minutes</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Choose from 30+ professional writing styles. Generate cover letters, business emails, 
          academic correspondence, and more with AI assistance tailored to your needs.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-card border rounded-lg p-6">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">30+ Writing Styles</h3>
            <p className="text-sm text-muted-foreground">
              From formal business to casual networking, find the perfect tone for any situation
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Smart Customization</h3>
            <p className="text-sm text-muted-foreground">
              Input LinkedIn profiles, job descriptions, and context for personalized emails
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Multi-Language Support</h3>
            <p className="text-sm text-muted-foreground">
              Generate emails in multiple languages with proper cultural context
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
