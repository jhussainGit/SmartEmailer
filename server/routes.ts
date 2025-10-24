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
  app.post('/api/generate-email', async (req, res) => {
    try {
      const { generateEmail } = await import('./emailGenerator');
      const email = await generateEmail(req.body);
      res.json({ email });
    } catch (error: any) {
      console.error("Error generating email:", error);
      res.status(500).json({ message: error.message || "Failed to generate email" });
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
