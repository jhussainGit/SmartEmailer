import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";

interface EmailComposerProps {
  selectedStyle: string;
  onGenerate: (data: EmailFormData) => void;
  isGenerating?: boolean;
}

export interface EmailFormData {
  emailType: string;
  recipientName: string;
  recipientLinkedIn: string;
  senderName: string;
  senderLinkedIn: string;
  subject: string;
  topic: string;
  length: 'short' | 'medium' | 'long';
  tone: string[];
  sampleEmail: string;
  jobDescription: string;
  additionalContext: string;
  language: string;
}

export default function EmailComposer({ selectedStyle, onGenerate, isGenerating = false }: EmailComposerProps) {
  const [formData, setFormData] = useState<EmailFormData>({
    emailType: 'business',
    recipientName: '',
    recipientLinkedIn: '',
    senderName: '',
    senderLinkedIn: '',
    subject: '',
    topic: '',
    length: 'medium',
    tone: [],
    sampleEmail: '',
    jobDescription: '',
    additionalContext: '',
    language: 'English',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Email Details</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="emailType" className="text-sm font-medium mb-2">Email Type</Label>
              <Select
                value={formData.emailType}
                onValueChange={(value) => setFormData({ ...formData, emailType: value })}
              >
                <SelectTrigger id="emailType" data-testid="select-email-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business Email</SelectItem>
                  <SelectItem value="cover-letter">Cover Letter</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="follow-up">Follow-Up</SelectItem>
                  <SelectItem value="thank-you">Thank You</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipientName" className="text-sm font-medium mb-2">Recipient Name</Label>
                <Input
                  id="recipientName"
                  placeholder="e.g., Dr. Jane Smith"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  data-testid="input-recipient-name"
                />
              </div>
              <div>
                <Label htmlFor="recipientLinkedIn" className="text-sm font-medium mb-2">Recipient LinkedIn (Optional)</Label>
                <Input
                  id="recipientLinkedIn"
                  placeholder="LinkedIn profile URL"
                  value={formData.recipientLinkedIn}
                  onChange={(e) => setFormData({ ...formData, recipientLinkedIn: e.target.value })}
                  data-testid="input-recipient-linkedin"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="senderName" className="text-sm font-medium mb-2">Your Name</Label>
                <Input
                  id="senderName"
                  placeholder="Your full name"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  data-testid="input-sender-name"
                />
              </div>
              <div>
                <Label htmlFor="senderLinkedIn" className="text-sm font-medium mb-2">Your LinkedIn (Optional)</Label>
                <Input
                  id="senderLinkedIn"
                  placeholder="Your LinkedIn profile URL"
                  value={formData.senderLinkedIn}
                  onChange={(e) => setFormData({ ...formData, senderLinkedIn: e.target.value })}
                  data-testid="input-sender-linkedin"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="language" className="text-sm font-medium mb-2">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger id="language" data-testid="select-language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish (Español)</SelectItem>
                  <SelectItem value="French">French (Français)</SelectItem>
                  <SelectItem value="German">German (Deutsch)</SelectItem>
                  <SelectItem value="Italian">Italian (Italiano)</SelectItem>
                  <SelectItem value="Portuguese">Portuguese (Português)</SelectItem>
                  <SelectItem value="Chinese">Chinese (中文)</SelectItem>
                  <SelectItem value="Japanese">Japanese (日本語)</SelectItem>
                  <SelectItem value="Korean">Korean (한국어)</SelectItem>
                  <SelectItem value="Arabic">Arabic (العربية)</SelectItem>
                  <SelectItem value="Russian">Russian (Русский)</SelectItem>
                  <SelectItem value="Hindi">Hindi (हिन्दी)</SelectItem>
                  <SelectItem value="Dutch">Dutch (Nederlands)</SelectItem>
                  <SelectItem value="Polish">Polish (Polski)</SelectItem>
                  <SelectItem value="Turkish">Turkish (Türkçe)</SelectItem>
                  <SelectItem value="Swedish">Swedish (Svenska)</SelectItem>
                  <SelectItem value="Vietnamese">Vietnamese (Tiếng Việt)</SelectItem>
                  <SelectItem value="Thai">Thai (ไทย)</SelectItem>
                  <SelectItem value="Hebrew">Hebrew (עברית)</SelectItem>
                  <SelectItem value="Greek">Greek (Ελληνικά)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject" className="text-sm font-medium mb-2">Subject / Purpose</Label>
              <Input
                id="subject"
                placeholder="What is this email about?"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                data-testid="input-subject"
              />
            </div>

            <div>
              <Label htmlFor="topic" className="text-sm font-medium mb-2">Main Topic</Label>
              <Input
                id="topic"
                placeholder="Key points to cover"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                data-testid="input-topic"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2">Length</Label>
              <div className="flex gap-2">
                {['short', 'medium', 'long'].map((len) => (
                  <Button
                    key={len}
                    type="button"
                    variant={formData.length === len ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFormData({ ...formData, length: len as any })}
                    data-testid={`button-length-${len}`}
                    className="flex-1"
                  >
                    {len.charAt(0).toUpperCase() + len.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {formData.emailType === 'cover-letter' && (
              <div>
                <Label htmlFor="jobDescription" className="text-sm font-medium mb-2">Job Description URL (Optional)</Label>
                <Input
                  id="jobDescription"
                  placeholder="Link to job posting"
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  data-testid="input-job-description"
                />
              </div>
            )}

            <div>
              <Label htmlFor="sampleEmail" className="text-sm font-medium mb-2">Sample Email (Optional)</Label>
              <Textarea
                id="sampleEmail"
                placeholder="Paste a sample email to match its style and tone..."
                value={formData.sampleEmail}
                onChange={(e) => setFormData({ ...formData, sampleEmail: e.target.value })}
                className="min-h-24"
                data-testid="textarea-sample-email"
              />
            </div>

            <div>
              <Label htmlFor="additionalContext" className="text-sm font-medium mb-2">Additional Context (Optional)</Label>
              <Textarea
                id="additionalContext"
                placeholder="Any other details or specific points to include..."
                value={formData.additionalContext}
                onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
                className="min-h-20"
                data-testid="textarea-additional-context"
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isGenerating || !formData.subject || !formData.topic}
          data-testid="button-generate-email"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Email
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
