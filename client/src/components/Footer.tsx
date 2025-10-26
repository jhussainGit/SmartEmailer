import { Link } from "wouter";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="max-w-[1800px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Mail className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg">Smart Emailer Pro</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Professional email writing made simple with AI technology.
            </p>
            <p className="text-xs text-muted-foreground">
              A digital asset owned by Indus Bridge Ventures Inc.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/composer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Email Composer
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold">Indus Bridge Ventures Inc.</p>
              <p>801 Route 1 #1017, Iselin, NJ 08831, United States</p>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Indus Bridge Ventures Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
