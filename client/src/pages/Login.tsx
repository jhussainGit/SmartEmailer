import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock authentication - in real app this would call the backend
    toast({
      title: isLogin ? "Welcome back!" : "Account created!",
      description: isLogin ? "You've been logged in successfully." : "Your account has been created.",
    });
    
    setTimeout(() => {
      setLocation('/composer');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-primary text-primary-foreground w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Log in to access your email templates' : 'Sign up to start writing professional emails'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required={!isLogin}
                data-testid="input-name"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium mb-2">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10"
                required
                data-testid="input-email"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium mb-2">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10"
                required
                data-testid="input-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            data-testid="button-submit"
          >
            {isLogin ? 'Log In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-toggle-mode"
          >
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span className="text-primary font-medium">
              {isLogin ? 'Sign up' : 'Log in'}
            </span>
          </button>
        </div>

        <div className="mt-6 pt-6 border-t">
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </Card>
    </div>
  );
}
