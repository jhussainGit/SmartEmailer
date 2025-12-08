import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Draft routes
  app.get('/api/drafts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const drafts = await storage.getUserDrafts(userId);
      res.json(drafts);
    } catch (error) {
      console.error("Error fetching drafts:", error);
      res.status(500).json({ message: "Failed to fetch drafts" });
    }
  });

  app.post('/api/drafts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const draft = await storage.createDraft({
        userId,
        ...req.body,
      });
      res.json(draft);
    } catch (error) {
      console.error("Error creating draft:", error);
      res.status(500).json({ message: "Failed to create draft" });
    }
  });

  app.delete('/api/drafts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteDraft(req.params.id, userId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting draft:", error);
      if (error.message === 'Draft not found or unauthorized') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to delete draft" });
    }
  });

  app.delete('/api/drafts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteAllDrafts(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting all drafts:", error);
      res.status(500).json({ message: "Failed to delete all drafts" });
    }
  });

  // Email history routes
  app.get('/api/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.getUserHistory(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching history:", error);
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  app.post('/api/history', isAuthenticated, async (req: any, res) => {
    try {
      const { insertEmailHistorySchema } = await import('@shared/schema');
      const validatedData = insertEmailHistorySchema.parse(req.body);
      
      const userId = req.user.claims.sub;
      const historyEntry = await storage.createHistoryEntry({
        userId,
        ...validatedData,
      });
      res.json(historyEntry);
    } catch (error: any) {
      console.error("Error saving to history:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save to history" });
    }
  });

  app.delete('/api/history/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteHistoryEntry(req.params.id, userId);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error deleting history entry:", error);
      res.status(500).json({ message: "Failed to delete history entry" });
    }
  });

  // Email generation route (public - works without auth)
  app.post('/api/generate-email', async (req: any, res) => {
    const startTime = Date.now();
    let generationSuccess = false;
    
    try {
      console.log('[Email Generation] Request received with style:', req.body.style);
      
      // Log attachment info if present
      if (req.body.attachmentName) {
        const attachmentSize = req.body.attachmentContent?.length || 0;
        console.log(`[Email Generation] Attachment: ${req.body.attachmentName} (${attachmentSize} characters)`);
      }
      
      const { generateEmail } = await import('./emailGenerator');
      const email = await generateEmail(req.body);
      
      generationSuccess = true;
      console.log('[Email Generation] Email generated successfully');
      res.json({ email });
    } catch (error: any) {
      console.error("[Email Generation] Error:", error);
      console.error("[Email Generation] Error details:", {
        message: error.message,
        stack: error.stack,
        requestBody: {
          style: req.body.style,
          hasAttachment: !!req.body.attachmentName,
          attachmentSize: req.body.attachmentContent?.length || 0
        }
      });
      res.status(500).json({ 
        message: error.message || "Failed to generate email",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } finally {
      // Track composer usage asynchronously (don't block response)
      try {
        const userId = req.user?.claims?.sub || null;
        const sessionId = req.sessionID || null;
        
        await storage.trackComposerUsage({
          userId,
          sessionId,
          style: req.body.style || 'unknown',
          inputLanguage: req.body.inputLanguage || null,
          outputLanguage: req.body.outputLanguage || null,
          hasAttachment: !!req.body.attachmentName,
          isAuthenticated: !!req.user,
          generationSuccess,
          userAgent: req.headers['user-agent'] || null,
        });
        console.log(`[Usage Tracking] Logged composer usage for style: ${req.body.style}`);
      } catch (trackingError) {
        // Don't fail the request if tracking fails
        console.error('[Usage Tracking] Failed to log usage:', trackingError);
      }
    }
  });

  // Contact form route
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const { sendContactEmail } = await import('./gmail');
      await sendContactEmail(name, email, subject, message);
      
      res.json({ success: true, message: "Message sent successfully" });
    } catch (error: any) {
      console.error("Error sending contact email:", error);
      res.status(500).json({ message: error.message || "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
