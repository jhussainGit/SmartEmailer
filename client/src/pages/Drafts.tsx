import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useEffect } from "react";
import { useLocation } from "wouter";
import type { EmailDraft } from "@shared/schema";

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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Drafts</h1>
          <p className="text-muted-foreground">
            View and manage your saved email drafts
          </p>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(draft.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${draft.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
  );
}
