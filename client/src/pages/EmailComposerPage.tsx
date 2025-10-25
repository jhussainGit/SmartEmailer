import { useState } from "react";
import { Helmet } from "react-helmet-async";
import EmailStyleCard from "@/components/EmailStyleCard";
import EmailComposer, { EmailFormData } from "@/components/EmailComposer";
import EmailPreview from "@/components/EmailPreview";
import { emailStyles, emailCategories } from "@/lib/emailStyles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

export default function EmailComposerPage() {
  const [selectedStyle, setSelectedStyle] = useState(emailStyles[0].id);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<EmailFormData | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const filteredStyles = emailStyles.filter(style => {
    const matchesCategory = selectedCategory === 'all' || style.category === selectedCategory;
    const matchesSearch = style.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         style.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGenerate = async (formData: EmailFormData) => {
    setIsGenerating(true);
    setCurrentFormData(formData);
    
    try {
      const payload = {
        style: selectedStyle,
        ...formData,
      };
      
      // Log attachment info for debugging
      if (formData.attachmentName) {
        console.log(`[Client] Generating with attachment: ${formData.attachmentName}`);
        console.log(`[Client] Attachment size: ${formData.attachmentContent?.length || 0} characters`);
      }
      
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to generate email' }));
        throw new Error(errorData.message || 'Failed to generate email');
      }

      const data = await response.json();
      setGeneratedEmail(data.email);
      
      // Save to history for authenticated users
      if (isAuthenticated && data.email) {
        saveToHistory(data.email, formData);
      }
      
      toast({
        title: "Email Generated!",
        description: formData.attachmentName 
          ? `Email generated successfully with attachment: ${formData.attachmentName}` 
          : "Email generated successfully",
      });
    } catch (error: any) {
      console.error('Error generating email:', error);
      
      const errorMessage = error.message || 'Failed to generate email';
      setGeneratedEmail('');
      
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToHistory = async (emailContent: string, formData: EmailFormData) => {
    try {
      // Calculate word count
      const words = emailContent.trim().split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length.toString();

      await apiRequest('POST', '/api/history', {
        emailContent,
        style: selectedStyle,
        subject: formData.subject,
        formData,
        wordCount,
      });
    } catch (error) {
      // Silently fail - history saving shouldn't interrupt the user experience
      console.error('Error saving to history:', error);
    }
  };

  const handleRegenerate = () => {
    if (currentFormData) {
      handleGenerate(currentFormData);
    }
  };

  const handleSaveDraft = async () => {
    if (!currentFormData || !generatedEmail) return;

    try {
      await apiRequest('POST', '/api/drafts', {
        title: currentFormData.subject || 'Untitled Email',
        style: selectedStyle,
        content: generatedEmail,
        formData: currentFormData,
      });

      toast({
        title: "Draft Saved!",
        description: "Your email draft has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Email Composer - AI-Powered Email Generator | Smart Emailer Pro</title>
        <meta 
          name="description" 
          content="Create professional emails instantly with our AI-powered composer. Choose from 30+ writing styles including business, academic, technical, and casual. Free email generation with GPT-5 technology."
        />
        <meta 
          name="keywords" 
          content="email composer, AI email generator, write email, professional email writer, business email generator, email creator, GPT-5 email, automated email writing"
        />
        <meta property="og:title" content="Email Composer - AI-Powered Email Generator | Smart Emailer Pro" />
        <meta property="og:description" content="Create professional emails instantly with our AI-powered composer. Choose from 30+ writing styles and generate perfect emails in seconds." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://smart-emailer-pro.replit.app/composer/" />
        <link rel="canonical" href="https://smart-emailer-pro.replit.app/composer/" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-[1800px] mx-auto p-4 md:p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Email Composer</h1>
            <p className="text-muted-foreground">Choose a style and customize your email</p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-3">Writing Styles</h2>
              
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search styles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-styles"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {emailCategories.map(cat => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.id)}
                    data-testid={`button-category-${cat.id}`}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>

              <div className="space-y-2 max-h-[calc(100vh-320px)] overflow-y-auto pr-2">
                {filteredStyles.map(style => (
                  <EmailStyleCard
                    key={style.id}
                    style={style}
                    isSelected={selectedStyle === style.id}
                    onClick={() => setSelectedStyle(style.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <EmailComposer
              selectedStyle={selectedStyle}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          <div className="lg:col-span-4">
            <EmailPreview
              content={generatedEmail}
              onSave={isAuthenticated ? handleSaveDraft : undefined}
              onRegenerate={currentFormData ? handleRegenerate : undefined}
            />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
