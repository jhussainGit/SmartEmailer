import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailPreviewProps {
  content: string;
  onRefine?: () => void;
}

export default function EmailPreview({ content, onRefine }: EmailPreviewProps) {
  const { toast } = useToast();

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

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Email Preview</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            data-testid="button-copy-email"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadEmail}
            data-testid="button-download-email"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          {onRefine && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefine}
              data-testid="button-refine-email"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refine
            </Button>
          )}
        </div>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-6 min-h-96">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed">
            {content || "Your generated email will appear here..."}
          </pre>
        </div>
      </div>
    </Card>
  );
}
