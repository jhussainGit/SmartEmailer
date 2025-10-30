import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { SiGoogle, SiGithub, SiApple } from "react-icons/si";

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/composer');
    }
  }, [isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <>
      <Helmet>
        <title>Login | Smart Emailer Pro</title>
        <meta 
          name="description" 
          content="Sign in to Smart Emailer Pro to access your saved email drafts, generate history, and personalized AI email writing features."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://smart-emailer-pro.replit.app/login/" />
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-primary text-primary-foreground w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome to Smart Emailer Pro</h1>
          <p className="text-muted-foreground">
            Sign in to access your email templates and drafts
          </p>
        </div>

        <Button
          onClick={handleLogin}
          size="lg"
          className="w-full mb-4"
          data-testid="button-login"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>

        <div className="mb-6">
          <p className="text-xs text-center text-muted-foreground mb-3">
            Choose from multiple sign-in options:
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <SiGoogle className="w-4 h-4" />
              <span>Google</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <SiGithub className="w-4 h-4" />
              <span>GitHub</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <SiApple className="w-4 h-4" />
              <span>Apple</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-3">
            No Replit account required
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2 text-sm">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Save and manage email drafts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Access to all 30+ writing styles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Advanced customization options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>LinkedIn & job description integration</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </Card>
    </div>
    </>
  );
}
