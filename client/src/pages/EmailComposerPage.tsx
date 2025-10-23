import { useState } from "react";
import EmailStyleCard from "@/components/EmailStyleCard";
import EmailComposer, { EmailFormData } from "@/components/EmailComposer";
import EmailPreview from "@/components/EmailPreview";
import { emailStyles, emailCategories } from "@/lib/emailStyles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function EmailComposerPage() {
  const [selectedStyle, setSelectedStyle] = useState(emailStyles[0].id);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredStyles = emailStyles.filter(style => {
    const matchesCategory = selectedCategory === 'all' || style.category === selectedCategory;
    const matchesSearch = style.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         style.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleGenerate = async (formData: EmailFormData) => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const styleName = emailStyles.find(s => s.id === selectedStyle)?.name || 'Professional';
    const mockEmail = `Dear ${formData.recipientName || 'Recipient'},

I hope this message finds you well. I am writing to you regarding ${formData.subject || 'the matter we discussed'}.

${formData.topic ? `I wanted to elaborate on ${formData.topic}. ` : ''}${formData.additionalContext || 'This is an important matter that requires your attention and consideration.'}

${formData.sampleEmail ? 'Following the style and tone of our previous correspondence, ' : ''}I believe this approach aligns well with our mutual interests and objectives.

I would appreciate the opportunity to discuss this further at your earliest convenience.

Thank you for your time and consideration.

Best regards,
${formData.senderName || 'Your Name'}`;

    setGeneratedEmail(mockEmail);
    setIsGenerating(false);
  };

  return (
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
              onRefine={() => console.log('Refine email')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
