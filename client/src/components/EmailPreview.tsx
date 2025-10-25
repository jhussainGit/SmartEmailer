import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw, Save, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useState, useMemo } from "react";

interface EmailPreviewProps {
  content: string;
  onRefine?: () => void;
  onSave?: () => void;
  onRegenerate?: () => void;
}

export default function EmailPreview({ content, onRefine, onSave, onRegenerate }: EmailPreviewProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Calculate word count and reading time
  const { wordCount, readingTime } = useMemo(() => {
    if (!content) return { wordCount: 0, readingTime: 0 };
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    const count = words.length;
    const time = Math.ceil(count / 200); // Average reading speed: 200 words per minute
    return { wordCount: count, readingTime: time };
  }, [content]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: "Email copied to clipboard",
    });
  };

  const downloadEmail = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded!",
      description: "Email saved as text file",
    });
  };

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      await onSave();
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Email Preview</h3>
          {content && (
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1" data-testid="text-word-count">
                <FileText className="w-3 h-3" />
                {wordCount} words
              </span>
              <span className="flex items-center gap-1" data-testid="text-reading-time">
                <Clock className="w-3 h-3" />
                {readingTime} min read
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            disabled={!content}
            data-testid="button-copy-email"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadEmail}
            disabled={!content}
            data-testid="button-download-email"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          {isAuthenticated && onSave && content && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              data-testid="button-save-draft"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
          )}
          {onRegenerate && content && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              data-testid="button-regenerate-email"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
          )}
        </div>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-6 min-h-96">
        <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed text-sm">
          {content || "Your generated email will appear here..."}
        </pre>
      </div>
    </Card>
  );
}
