import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, Loader2, Copy, Download, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import type { EmailDraft } from "@shared/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Drafts() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to view your drafts.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: drafts, isLoading } = useQuery<EmailDraft[]>({
    queryKey: ["/api/drafts"],
    enabled: isAuthenticated,
    staleTime: 0,  // Always refetch to ensure fresh data
    refetchOnMount: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (draftId: string) => {
      await apiRequest("DELETE", `/api/drafts/${draftId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drafts"] });
      toast({
        title: "Draft Deleted",
        description: "Your draft has been deleted successfully.",
      });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/drafts");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/drafts"] });
      toast({
        title: "All Drafts Deleted",
        description: "All your drafts have been deleted successfully.",
      });
    },
  });

  const copyToClipboard = async (content: string, title: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to Clipboard",
        description: `"${title}" has been copied to your clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportAllAsText = () => {
    if (!drafts || drafts.length === 0) return;

    const formattedContent = drafts.map((draft, index) => {
      return `
================================================================================
DRAFT #${index + 1}: ${draft.title}
================================================================================
Type: ${draft.emailType}
Style: ${draft.style}
Saved: ${new Date(draft.updatedAt!).toLocaleString()}

${draft.content}
`;
    }).join('\n\n');

    const blob = new Blob([formattedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `email-helper-drafts-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Exported ${drafts.length} draft${drafts.length > 1 ? 's' : ''} to text file.`,
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>My Email Drafts | Smart Emailer Pro</title>
        <meta 
          name="description" 
          content="Access and manage your saved email drafts. View, edit, copy, and download your AI-generated emails. Requires authentication."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://smart-emailer-pro.replit.app/drafts/" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Drafts</h1>
              <p className="text-muted-foreground">
                View and manage your saved email drafts
              </p>
            </div>
            
            {drafts && drafts.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={exportAllAsText}
                  data-testid="button-export-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export All
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      disabled={deleteAllMutation.isPending}
                      data-testid="button-delete-all"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        Delete All Drafts?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all {drafts.length} draft{drafts.length > 1 ? 's' : ''}.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel data-testid="button-cancel-delete-all">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteAllMutation.mutate()}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        data-testid="button-confirm-delete-all"
                      >
                        Delete All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>

        {!drafts || drafts.length === 0 ? (
          <Card className="p-12 text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Drafts Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start creating emails and save them as drafts for later
            </p>
            <Button onClick={() => setLocation('/composer')} data-testid="button-create-email">
              Create Your First Email
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {drafts.map((draft) => (
              <Card key={draft.id} className="p-6" data-testid={`draft-card-${draft.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{draft.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{draft.emailType}</span>
                      <span>•</span>
                      <span>{draft.style}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(draft.content, draft.title)}
                      data-testid={`button-copy-${draft.id}`}
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(draft.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${draft.id}`}
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <p className="text-sm line-clamp-4 whitespace-pre-wrap">
                    {draft.content}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground">
                  Saved {new Date(draft.updatedAt!).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
