import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, ChevronUp, Clock, Cpu, FileText, CheckCircle2, XCircle, Activity } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import type { AiActivityLog } from "@shared/schema";

function formatDuration(ms: number | null) {
  if (!ms) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function styleLabel(style: string) {
  return style
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function PromptBlock({ label, content }: { label: string; content: string | null }) {
  if (!content) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <pre className="text-xs bg-muted/50 rounded-md p-3 whitespace-pre-wrap break-words font-mono leading-relaxed max-h-72 overflow-y-auto border">
        {content}
      </pre>
    </div>
  );
}

function LogRow({ log }: { log: AiActivityLog }) {
  const [expanded, setExpanded] = useState(false);
  const hasPrompts = !!(log.systemPrompt || log.userPrompt);

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {log.success ? (
                <Badge className="gap-1 text-xs" data-testid={`badge-status-${log.id}`}>
                  <CheckCircle2 className="w-3 h-3" />
                  Success
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1 text-xs" data-testid={`badge-status-${log.id}`}>
                  <XCircle className="w-3 h-3" />
                  Failed
                </Badge>
              )}
              <span className="text-sm font-medium" data-testid={`text-style-${log.id}`}>
                {styleLabel(log.style)}
              </span>
              {log.outputLanguage && log.outputLanguage !== "English" && (
                <Badge variant="outline" className="text-xs">{log.outputLanguage}</Badge>
              )}
            </div>

            {log.subject && (
              <p className="text-sm text-muted-foreground truncate" data-testid={`text-subject-${log.id}`}>
                {log.subject}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(log.createdAt!)}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {formatDuration(log.durationMs)}
              </span>
              {log.totalTokens != null && (
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  {log.totalTokens.toLocaleString()} tokens
                  <span className="text-muted-foreground/60">
                    ({log.promptTokens?.toLocaleString()} in / {log.completionTokens?.toLocaleString()} out)
                  </span>
                </span>
              )}
              {log.outputWordCount != null && (
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {log.outputWordCount} words
                </span>
              )}
              {log.model && (
                <span className="font-mono">{log.model}</span>
              )}
            </div>

            {!log.success && log.errorMessage && (
              <p className="text-xs text-destructive bg-destructive/10 rounded px-2 py-1">
                {log.errorMessage}
              </p>
            )}
          </div>

          {hasPrompts && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              data-testid={`button-expand-${log.id}`}
              className="shrink-0"
            >
              {expanded ? (
                <><ChevronUp className="w-4 h-4 mr-1" /> Hide Prompts</>
              ) : (
                <><ChevronDown className="w-4 h-4 mr-1" /> View Prompts</>
              )}
            </Button>
          )}
        </div>
      </div>

      {expanded && hasPrompts && (
        <div className="border-t px-4 pb-4 pt-3 space-y-4 bg-muted/20">
          <PromptBlock label="System Prompt" content={log.systemPrompt} />
          <PromptBlock label="User Prompt" content={log.userPrompt} />
        </div>
      )}
    </Card>
  );
}

export default function ActivityLog() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const { data: logs, isLoading } = useQuery<AiActivityLog[]>({
    queryKey: ["/api/activity-logs"],
    enabled: isAuthenticated,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const totalTokens = logs?.reduce((sum, l) => sum + (l.totalTokens || 0), 0) || 0;
  const successCount = logs?.filter((l) => l.success).length || 0;
  const avgDuration = logs?.length
    ? Math.round(logs.reduce((sum, l) => sum + (l.durationMs || 0), 0) / logs.length)
    : 0;

  return (
    <>
      <Helmet>
        <title>Activity Log | Smart Emailer Pro</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1" data-testid="heading-activity-log">Activity Log</h1>
          <p className="text-muted-foreground">
            Detailed record of all AI email generation requests for your account, including prompts and API metrics.
          </p>
        </div>

        {logs && logs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold" data-testid="stat-total-requests">{logs.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Requests</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="stat-success-count">{successCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Successful</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold" data-testid="stat-total-tokens">{totalTokens.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Tokens Used</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold" data-testid="stat-avg-duration">{formatDuration(avgDuration)}</p>
              <p className="text-xs text-muted-foreground mt-1">Avg Response Time</p>
            </Card>
          </div>
        )}

        {!logs || logs.length === 0 ? (
          <Card className="p-12 text-center">
            <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No activity yet</h2>
            <p className="text-muted-foreground mb-4">
              Generate your first email and it will appear here with full prompt and API details.
            </p>
            <Button onClick={() => setLocation("/composer")} data-testid="button-go-to-composer">
              Go to Composer
            </Button>
          </Card>
        ) : (
          <div className="space-y-3" data-testid="activity-log-list">
            {logs.map((log) => (
              <LogRow key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
