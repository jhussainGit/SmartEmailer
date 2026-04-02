import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Sparkles, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { emailStyles } from "@/lib/emailStyles";

interface EmailComposerProps {
  selectedStyle: string;
  onGenerate: (data: EmailFormData) => void;
  isGenerating?: boolean;
}

export interface EmailFormData {
  recipientName: string;
  recipientEmail: string;
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
  emailSignature: string;
  inputLanguage: string;
  outputLanguage: string;
  attachmentContent?: string;
  attachmentName?: string;
  agencyWebsite?: string;
  endUserHomepage?: string;
  recruiterOutreachType?: 'intro' | 'second-followup';
  recruiterOutreachStyle?: string;
  koreanHonorificLevel: 'formal-highest' | 'polite-standard' | 'casual';
  dualLanguageOutput: boolean;
}

export default function EmailComposer({ selectedStyle, onGenerate, isGenerating = false }: EmailComposerProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<EmailFormData>({
    recipientName: '',
    recipientEmail: '',
    recipientLinkedIn: '',
    senderName: '',
    senderLinkedIn: '',
    subject: '',
    topic: '',
    emailSignature: '',
    length: 'medium',
    tone: [],
    sampleEmail: '',
    jobDescription: '',
    additionalContext: '',
    inputLanguage: 'English',
    outputLanguage: 'English',
    agencyWebsite: '',
    endUserHomepage: '',
    recruiterOutreachType: 'intro',
    recruiterOutreachStyle: 'professional-direct',
    koreanHonorificLevel: 'polite-standard',
    dualLanguageOutput: false,
  });

  const getAttachmentConfig = () => {
    const style = emailStyles.find(s => s.id === selectedStyle);
    return style?.attachmentConfig || null;
  };

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      attachmentContent: undefined,
      attachmentName: undefined,
    }));
  }, [selectedStyle]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await file.text();
      setFormData({
        ...formData,
        attachmentContent: text,
        attachmentName: file.name,
      });
      toast({
        title: "File Uploaded",
        description: `${file.name} has been attached successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Could not read the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeAttachment = () => {
    setFormData({
      ...formData,
      attachmentContent: undefined,
      attachmentName: undefined,
    });
  };

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
                <Label htmlFor="recipientEmail" className="text-sm font-medium mb-2">Recipient Email (Optional)</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="recipient@example.com"
                  value={formData.recipientEmail}
                  onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                  data-testid="input-recipient-email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inputLanguage" className="text-sm font-medium mb-2">Input Language</Label>
                <Select
                  value={formData.inputLanguage}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    inputLanguage: value,
                    outputLanguage: value
                  })}
                >
                  <SelectTrigger id="inputLanguage" data-testid="select-input-language">
                    <SelectValue placeholder="Select input language" />
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
                    <SelectItem value="Urdu">Urdu (اردو)</SelectItem>
                    <SelectItem value="Farsi">Farsi (فارسی)</SelectItem>
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
                <Label htmlFor="outputLanguage" className="text-sm font-medium mb-2">Output Language</Label>
                <Select
                  value={formData.outputLanguage}
                  onValueChange={(value) => setFormData({ ...formData, outputLanguage: value })}
                >
                  <SelectTrigger id="outputLanguage" data-testid="select-output-language">
                    <SelectValue placeholder="Select output language" />
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
                    <SelectItem value="Urdu">Urdu (اردو)</SelectItem>
                    <SelectItem value="Farsi">Farsi (فارسی)</SelectItem>
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
            </div>

            {formData.outputLanguage === 'Korean' && selectedStyle.startsWith('korean-') && (
              <div>
                <Label htmlFor="koreanHonorificLevel" className="text-sm font-medium mb-2">Korean Honorific Level</Label>
                <Select
                  value={formData.koreanHonorificLevel}
                  onValueChange={(value) => setFormData({ ...formData, koreanHonorificLevel: value as 'formal-highest' | 'polite-standard' | 'casual' })}
                >
                  <SelectTrigger id="koreanHonorificLevel" data-testid="select-korean-honorific-level">
                    <SelectValue placeholder="Select honorific level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal-highest">Formal Highest (격식체)</SelectItem>
                    <SelectItem value="polite-standard">Polite Standard (해요체)</SelectItem>
                    <SelectItem value="casual">Casual (반말)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.inputLanguage !== formData.outputLanguage && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="dualLanguageOutput"
                  checked={formData.dualLanguageOutput}
                  onCheckedChange={(checked) => setFormData({ ...formData, dualLanguageOutput: checked === true })}
                  data-testid="checkbox-dual-language-output"
                />
                <Label htmlFor="dualLanguageOutput" className="text-sm font-medium cursor-pointer">
                  Dual-language output (generate in both {formData.outputLanguage} and {formData.inputLanguage})
                </Label>
              </div>
            )}

            <div>
              <Label htmlFor="subject" className="text-sm font-medium mb-1">Subject / Purpose <span className="text-destructive">*</span></Label>
              <p className="text-xs text-muted-foreground mb-2">Describe what this email is about and what you want to achieve. The more detail you provide here, the better the AI can craft a targeted, effective email.</p>
              <Textarea
                id="subject"
                placeholder="e.g. Following up on our meeting last Tuesday about the Q2 marketing proposal — I want to confirm next steps and ask if they need any additional materials before the Friday deadline."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="min-h-28"
                data-testid="input-subject"
              />
            </div>

            <div>
              <Label htmlFor="topic" className="text-sm font-medium mb-2">Main Topic <span className="text-destructive">*</span></Label>
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

            {selectedStyle === 'cover-letter' && (
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

            {selectedStyle === 'recruiter-outreach' && (
              <>
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                  <h4 className="font-medium text-sm">Recruitment Context</h4>
                  
                  <div>
                    <Label htmlFor="recruiterOutreachType" className="text-sm font-medium mb-2">Message Type</Label>
                    <Select
                      value={formData.recruiterOutreachType}
                      onValueChange={(value) => setFormData({ ...formData, recruiterOutreachType: value as 'intro' | 'second-followup' })}
                    >
                      <SelectTrigger id="recruiterOutreachType" data-testid="select-recruiter-outreach-type">
                        <SelectValue placeholder="Select message type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intro">Initial Outreach</SelectItem>
                        <SelectItem value="second-followup">2nd Follow-Up Message</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="recruiterOutreachStyle" className="text-sm font-medium mb-2">Outreach Style</Label>
                    <Select
                      value={formData.recruiterOutreachStyle}
                      onValueChange={(value) => setFormData({ ...formData, recruiterOutreachStyle: value })}
                    >
                      <SelectTrigger id="recruiterOutreachStyle" data-testid="select-recruiter-outreach-style">
                        <SelectValue placeholder="Select outreach approach" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional-direct">Professional & Direct</SelectItem>
                        <SelectItem value="warm-friendly">Warm & Friendly</SelectItem>
                        <SelectItem value="executive-brief">Executive Brief</SelectItem>
                        <SelectItem value="consultative">Consultative Approach</SelectItem>
                        <SelectItem value="opportunity-focused">Opportunity-Focused</SelectItem>
                        <SelectItem value="industry-insider">Industry Insider</SelectItem>
                        <SelectItem value="relationship-building">Relationship Building</SelectItem>
                        <SelectItem value="urgent-confidential">Urgent & Confidential</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="jobDescription" className="text-sm font-medium mb-2">Job Description URL</Label>
                    <Input
                      id="jobDescription"
                      placeholder="Link to job posting or description"
                      value={formData.jobDescription}
                      onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                      data-testid="input-job-description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="agencyWebsite" className="text-sm font-medium mb-2">Agency Website (Optional)</Label>
                      <Input
                        id="agencyWebsite"
                        placeholder="Your recruiting agency website"
                        value={formData.agencyWebsite}
                        onChange={(e) => setFormData({ ...formData, agencyWebsite: e.target.value })}
                        data-testid="input-agency-website"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endUserHomepage" className="text-sm font-medium mb-2">Client Company Website (Optional)</Label>
                      <Input
                        id="endUserHomepage"
                        placeholder="Hiring company homepage"
                        value={formData.endUserHomepage}
                        onChange={(e) => setFormData({ ...formData, endUserHomepage: e.target.value })}
                        data-testid="input-end-user-homepage"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Tip: Upload the candidate's resume or detailed job description as an attachment for even better results
                  </p>
                </div>
              </>
            )}

            {getAttachmentConfig() && (
              <div>
                <Label className="text-sm font-medium mb-2">
                  {getAttachmentConfig()!.label}
                </Label>
                
                {!formData.attachmentName ? (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover-elevate">
                    <Input
                      type="file"
                      id="fileUpload"
                      accept={getAttachmentConfig()!.accept}
                      onChange={handleFileUpload}
                      className="hidden"
                      data-testid="input-file-upload"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">
                        {getAttachmentConfig()!.placeholder}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports {getAttachmentConfig()!.accept.split(',').join(', ')} (max 5MB)
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        data-testid="button-upload-trigger"
                      >
                        Choose File
                      </Button>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium truncate" data-testid="text-attachment-name">
                        {formData.attachmentName}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeAttachment}
                      data-testid="button-remove-attachment"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
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

            <div>
              <Label htmlFor="emailSignature" className="text-sm font-medium mb-1">Email Signature (Optional)</Label>
              <p className="text-xs text-muted-foreground mb-2">If provided, the AI will use exactly this signature at the end of the email. Leave blank to let the AI generate a signature from your name.</p>
              <Textarea
                id="emailSignature"
                placeholder={`e.g.\nBest regards,\nJane Smith\nSenior Marketing Manager | Acme Corp\njane.smith@acme.com | +1 (555) 123-4567`}
                value={formData.emailSignature}
                onChange={(e) => setFormData({ ...formData, emailSignature: e.target.value })}
                className="min-h-28 font-mono text-sm"
                data-testid="textarea-email-signature"
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
              Generating (20-40 seconds)...
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
