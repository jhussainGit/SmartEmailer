import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Loader2, LogIn, ShieldCheck, Lock } from "lucide-react";
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
        <link rel="canonical" href="https://smartemailer.pro/login" />
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

        <div className="mb-4">
          <p className="text-xs text-center text-muted-foreground mb-3">
            Sign in with your existing account — no new account needed:
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
        </div>

        <div className="bg-muted/40 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs font-medium">Secure authentication powered by Replit</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sign-in is handled entirely by Replit's identity platform — a trusted infrastructure provider used by millions of developers worldwide. We never see or store your password. Your credentials stay with your chosen provider (Google, GitHub, Apple, or email), and only your name and email address are shared with us to identify your account.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>No password stored by us</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="w-3 h-3" />
              <span>OAuth 2.0 / OpenID Connect</span>
            </div>
          </div>
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
                <span>Access to all 50+ writing styles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>LinkedIn & job description integration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Full activity log with AI prompt details</span>
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
