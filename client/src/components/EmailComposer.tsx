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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, Sparkles, Upload, X, Settings2, Wand2, Cpu, RotateCcw } from "lucide-react";
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
  // Tone & voice sliders (1-10)
  formalityLevel: number;
  warmthLevel: number;
  directnessLevel: number;
  confidenceLevel: number;
  urgencyLevel: number;
  // Style controls
  readingLevel: 'elementary' | 'middle-school' | 'high-school' | 'college' | 'professional' | 'expert';
  pointOfView: 'first-person' | 'second-person' | 'third-person';
  useContractions: boolean;
  emojiPolicy: 'none' | 'minimal' | 'moderate';
  sentenceStyle: 'short-punchy' | 'balanced' | 'long-flowing';
  structureFormat: 'paragraphs' | 'bullets' | 'hybrid';
  // Content shaping
  senderPersona: string;
  readerSeniority: 'auto' | 'individual-contributor' | 'manager' | 'director' | 'executive' | 'c-suite';
  ctaType: 'auto' | 'schedule-meeting' | 'reply' | 'click-link' | 'review-document' | 'no-cta' | 'custom';
  customCta: string;
  mustInclude: string;
  mustAvoid: string;
  customInstructions: string;
  // API / model parameters
  model: 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4-turbo';
  temperature: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  maxOutputTokens: number;
  seed: string;
}

const DEFAULT_ADVANCED = {
  formalityLevel: 6,
  warmthLevel: 5,
  directnessLevel: 6,
  confidenceLevel: 6,
  urgencyLevel: 4,
  readingLevel: 'professional' as const,
  pointOfView: 'first-person' as const,
  useContractions: true,
  emojiPolicy: 'none' as const,
  sentenceStyle: 'balanced' as const,
  structureFormat: 'paragraphs' as const,
  senderPersona: '',
  readerSeniority: 'auto' as const,
  ctaType: 'auto' as const,
  customCta: '',
  mustInclude: '',
  mustAvoid: '',
  customInstructions: '',
  model: 'gpt-4o' as const,
  temperature: 0.7,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
  maxOutputTokens: 5000,
  seed: '',
};

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
    ...DEFAULT_ADVANCED,
  });

  const resetAdvanced = () => {
    setFormData(prev => ({ ...prev, ...DEFAULT_ADVANCED }));
    toast({ title: "Advanced settings reset", description: "All advanced controls restored to defaults." });
  };

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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="tone-voice" data-testid="accordion-tone-voice">
            <AccordionTrigger className="text-sm font-semibold">
              <span className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" />
                Tone & Voice Calibration
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pt-2">
              <p className="text-xs text-muted-foreground">
                Fine-tune the personality of your email. These sliders shape exactly how the AI writes — from cold and corporate to warm and personal, from indirect to assertive.
              </p>

              {([
                { key: 'formalityLevel', label: 'Formality', left: 'Casual', right: 'Highly formal' },
                { key: 'warmthLevel', label: 'Warmth', left: 'Cool & detached', right: 'Warm & personal' },
                { key: 'directnessLevel', label: 'Directness', left: 'Indirect & diplomatic', right: 'Direct & blunt' },
                { key: 'confidenceLevel', label: 'Confidence', left: 'Humble & deferential', right: 'Assertive & confident' },
                { key: 'urgencyLevel', label: 'Urgency', left: 'Relaxed timing', right: 'Time-critical' },
              ] as const).map(({ key, label, left, right }) => (
                <div key={key}>
                  <div className="flex items-baseline justify-between mb-2">
                    <Label className="text-sm font-medium">{label}</Label>
                    <span className="text-xs font-mono text-muted-foreground" data-testid={`text-${key}-value`}>
                      {formData[key]}/10
                    </span>
                  </div>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[formData[key]]}
                    onValueChange={([v]) => setFormData({ ...formData, [key]: v })}
                    data-testid={`slider-${key}`}
                  />
                  <div className="flex justify-between mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                    <span>{left}</span>
                    <span>{right}</span>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="style-controls" data-testid="accordion-style-controls">
            <AccordionTrigger className="text-sm font-semibold">
              <span className="flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Style & Format Controls
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2">Reading Level</Label>
                  <Select
                    value={formData.readingLevel}
                    onValueChange={(v) => setFormData({ ...formData, readingLevel: v as any })}
                  >
                    <SelectTrigger data-testid="select-reading-level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">Elementary (simple words)</SelectItem>
                      <SelectItem value="middle-school">Middle School</SelectItem>
                      <SelectItem value="high-school">High School</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                      <SelectItem value="professional">Professional (default)</SelectItem>
                      <SelectItem value="expert">Expert / Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2">Point of View</Label>
                  <Select
                    value={formData.pointOfView}
                    onValueChange={(v) => setFormData({ ...formData, pointOfView: v as any })}
                  >
                    <SelectTrigger data-testid="select-point-of-view">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-person">First Person (I / We)</SelectItem>
                      <SelectItem value="second-person">Second Person (You-focused)</SelectItem>
                      <SelectItem value="third-person">Third Person (Objective)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2">Sentence Style</Label>
                  <Select
                    value={formData.sentenceStyle}
                    onValueChange={(v) => setFormData({ ...formData, sentenceStyle: v as any })}
                  >
                    <SelectTrigger data-testid="select-sentence-style">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short-punchy">Short & Punchy</SelectItem>
                      <SelectItem value="balanced">Balanced (default)</SelectItem>
                      <SelectItem value="long-flowing">Long & Flowing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2">Structure Format</Label>
                  <Select
                    value={formData.structureFormat}
                    onValueChange={(v) => setFormData({ ...formData, structureFormat: v as any })}
                  >
                    <SelectTrigger data-testid="select-structure-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paragraphs">Paragraphs only</SelectItem>
                      <SelectItem value="bullets">Bullet points</SelectItem>
                      <SelectItem value="hybrid">Hybrid (paragraphs + bullets)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2">Emoji Policy</Label>
                  <Select
                    value={formData.emojiPolicy}
                    onValueChange={(v) => setFormData({ ...formData, emojiPolicy: v as any })}
                  >
                    <SelectTrigger data-testid="select-emoji-policy">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No emoji (default)</SelectItem>
                      <SelectItem value="minimal">Minimal (1 max)</SelectItem>
                      <SelectItem value="moderate">Moderate (where natural)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between gap-4 pt-6">
                  <Label htmlFor="useContractions" className="text-sm font-medium cursor-pointer">
                    Use contractions (I'm, we'll)
                  </Label>
                  <Switch
                    id="useContractions"
                    checked={formData.useContractions}
                    onCheckedChange={(v) => setFormData({ ...formData, useContractions: v })}
                    data-testid="switch-use-contractions"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="content-shaping" data-testid="accordion-content-shaping">
            <AccordionTrigger className="text-sm font-semibold">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Audience & Content Shaping
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="senderPersona" className="text-sm font-medium mb-2">Your Role / Persona (Optional)</Label>
                  <Input
                    id="senderPersona"
                    placeholder="e.g., VP of Engineering at a Series B SaaS startup"
                    value={formData.senderPersona}
                    onChange={(e) => setFormData({ ...formData, senderPersona: e.target.value })}
                    data-testid="input-sender-persona"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2">Reader Seniority</Label>
                  <Select
                    value={formData.readerSeniority}
                    onValueChange={(v) => setFormData({ ...formData, readerSeniority: v as any })}
                  >
                    <SelectTrigger data-testid="select-reader-seniority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect from context</SelectItem>
                      <SelectItem value="individual-contributor">Individual Contributor</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="director">Director / VP</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                      <SelectItem value="c-suite">C-Suite (CEO, CFO, etc.)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2">Call-to-Action</Label>
                  <Select
                    value={formData.ctaType}
                    onValueChange={(v) => setFormData({ ...formData, ctaType: v as any })}
                  >
                    <SelectTrigger data-testid="select-cta-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-decide</SelectItem>
                      <SelectItem value="schedule-meeting">Schedule a meeting</SelectItem>
                      <SelectItem value="reply">Request a reply</SelectItem>
                      <SelectItem value="click-link">Click a link</SelectItem>
                      <SelectItem value="review-document">Review attached document</SelectItem>
                      <SelectItem value="no-cta">No call-to-action</SelectItem>
                      <SelectItem value="custom">Custom (specify below)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.ctaType === 'custom' && (
                  <div>
                    <Label htmlFor="customCta" className="text-sm font-medium mb-2">Custom CTA Text</Label>
                    <Input
                      id="customCta"
                      placeholder="e.g., Book a 30-min demo on my Calendly"
                      value={formData.customCta}
                      onChange={(e) => setFormData({ ...formData, customCta: e.target.value })}
                      data-testid="input-custom-cta"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="mustInclude" className="text-sm font-medium mb-2">Must-Include Phrases (Optional)</Label>
                <p className="text-xs text-muted-foreground mb-2">Comma-separated phrases that MUST appear verbatim in the email.</p>
                <Input
                  id="mustInclude"
                  placeholder="e.g., Q4 launch, 30-day trial, no obligation"
                  value={formData.mustInclude}
                  onChange={(e) => setFormData({ ...formData, mustInclude: e.target.value })}
                  data-testid="input-must-include"
                />
              </div>

              <div>
                <Label htmlFor="mustAvoid" className="text-sm font-medium mb-2">Words / Phrases to Avoid (Optional)</Label>
                <p className="text-xs text-muted-foreground mb-2">Comma-separated words the AI must not use.</p>
                <Input
                  id="mustAvoid"
                  placeholder="e.g., synergy, leverage, just checking in"
                  value={formData.mustAvoid}
                  onChange={(e) => setFormData({ ...formData, mustAvoid: e.target.value })}
                  data-testid="input-must-avoid"
                />
              </div>

              <div>
                <Label htmlFor="customInstructions" className="text-sm font-medium mb-2">Custom Instructions (Optional)</Label>
                <p className="text-xs text-muted-foreground mb-2">Free-form directives appended to the system prompt. Use this for nuanced behavior the other controls don't capture.</p>
                <Textarea
                  id="customInstructions"
                  placeholder="e.g., Reference the recipient's recent podcast appearance. End with an open question. Avoid mentioning pricing."
                  value={formData.customInstructions}
                  onChange={(e) => setFormData({ ...formData, customInstructions: e.target.value })}
                  className="min-h-20"
                  data-testid="textarea-custom-instructions"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="api-params" data-testid="accordion-api-params">
            <AccordionTrigger className="text-sm font-semibold">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Model & API Parameters
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-5 pt-2">
              <p className="text-xs text-muted-foreground">
                Direct controls over the OpenAI API call. Lower temperature → more deterministic. Higher → more creative. Defaults work well for most cases.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2">Model</Label>
                  <Select
                    value={formData.model}
                    onValueChange={(v) => setFormData({ ...formData, model: v as any })}
                  >
                    <SelectTrigger data-testid="select-model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4o (Best quality, default)</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster, cheaper)</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Legacy)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="seed" className="text-sm font-medium mb-2">Seed (Optional)</Label>
                  <Input
                    id="seed"
                    type="number"
                    placeholder="Leave blank for random"
                    value={formData.seed}
                    onChange={(e) => setFormData({ ...formData, seed: e.target.value })}
                    data-testid="input-seed"
                  />
                </div>
              </div>

              {([
                { key: 'temperature', label: 'Temperature', min: 0, max: 2, step: 0.1, hint: 'Creativity / randomness (0=deterministic, 2=wild)' },
                { key: 'topP', label: 'Top P', min: 0, max: 1, step: 0.05, hint: 'Nucleus sampling. Lower = more focused vocabulary' },
                { key: 'frequencyPenalty', label: 'Frequency Penalty', min: -2, max: 2, step: 0.1, hint: 'Higher reduces word repetition' },
                { key: 'presencePenalty', label: 'Presence Penalty', min: -2, max: 2, step: 0.1, hint: 'Higher pushes new topics' },
              ] as const).map(({ key, label, min, max, step, hint }) => (
                <div key={key}>
                  <div className="flex items-baseline justify-between mb-1">
                    <Label className="text-sm font-medium">{label}</Label>
                    <span className="text-xs font-mono text-muted-foreground" data-testid={`text-${key}-value`}>
                      {(formData[key] as number).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-2">{hint}</p>
                  <Slider
                    min={min}
                    max={max}
                    step={step}
                    value={[formData[key] as number]}
                    onValueChange={([v]) => setFormData({ ...formData, [key]: v })}
                    data-testid={`slider-${key}`}
                  />
                </div>
              ))}

              <div>
                <Label htmlFor="maxOutputTokens" className="text-sm font-medium mb-2">Max Output Tokens</Label>
                <p className="text-[11px] text-muted-foreground mb-2">Hard cap on output length. ~750 tokens ≈ 500 words.</p>
                <Input
                  id="maxOutputTokens"
                  type="number"
                  min={100}
                  max={16000}
                  step={100}
                  value={formData.maxOutputTokens}
                  onChange={(e) => setFormData({ ...formData, maxOutputTokens: parseInt(e.target.value) || 5000 })}
                  data-testid="input-max-output-tokens"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetAdvanced}
                data-testid="button-reset-advanced"
                className="w-full"
              >
                <RotateCcw className="w-3 h-3 mr-2" />
                Reset all advanced settings to defaults
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
