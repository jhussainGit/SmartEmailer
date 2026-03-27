import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get('/sitemap.xml', (_req, res) => {
    const baseUrl = 'https://smartemailer.pro';
    const pages = [
      { loc: '/', priority: '1.0', changefreq: 'weekly' },
      { loc: '/composer', priority: '0.9', changefreq: 'weekly' },
      { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
      { loc: '/faq', priority: '0.7', changefreq: 'monthly' },
      { loc: '/contact', priority: '0.6', changefreq: 'monthly' },
      { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
      { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
    ];

    const blogSlugs = [
      'how-to-cold-email-for-internship',
      'how-to-say-will-do-professionally-in-email',
      'how-to-send-video-through-email',
      'how-to-write-email-to-teacher',
      'how-to-address-attorney-in-email',
      'how-to-change-format-outlook-email',
      'how-to-say-ok-professionally-email',
      'how-to-put-gif-in-email',
      'how-to-address-email-to-multiple-people',
      'how-to-respond-job-rejection-email',
      'korean-business-email-etiquette',
      'korean-self-introduction-letter-guide',
      'japanese-business-email-keigo-guide',
      'japanese-seasonal-greetings-business-email',
    ];

    const today = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const page of pages) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.loc}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    for (const slug of blogSlugs) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${slug}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.6</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

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
      const result = await generateEmail(req.body);
      
      generationSuccess = true;
      console.log('[Email Generation] Email generated successfully');

      // Save detailed activity log for authenticated users
      const userId = req.user?.claims?.sub;
      if (userId) {
        const wordCount = result.email.trim().split(/\s+/).length;
        await storage.createActivityLog({
          userId,
          style: req.body.style || 'unknown',
          inputLanguage: req.body.inputLanguage || null,
          outputLanguage: req.body.outputLanguage || null,
          subject: req.body.subject || null,
          systemPrompt: result.systemPrompt,
          userPrompt: result.userPrompt,
          model: result.model,
          promptTokens: result.promptTokens,
          completionTokens: result.completionTokens,
          totalTokens: result.totalTokens,
          durationMs: Date.now() - startTime,
          success: true,
          errorMessage: null,
          outputWordCount: wordCount,
        }).catch(err => console.error('[Activity Log] Failed to save:', err));
      }

      res.json({ email: result.email });
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
      // Log failed generation for authenticated users
      const userId = req.user?.claims?.sub;
      if (userId) {
        await storage.createActivityLog({
          userId,
          style: req.body.style || 'unknown',
          inputLanguage: req.body.inputLanguage || null,
          outputLanguage: req.body.outputLanguage || null,
          subject: req.body.subject || null,
          systemPrompt: null,
          userPrompt: null,
          model: 'gpt-5',
          promptTokens: null,
          completionTokens: null,
          totalTokens: null,
          durationMs: Date.now() - startTime,
          success: false,
          errorMessage: error.message || 'Unknown error',
          outputWordCount: null,
        }).catch(err => console.error('[Activity Log] Failed to save error log:', err));
      }

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

  // Activity log route (authenticated users only)
  app.get('/api/activity-logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const logs = await storage.getUserActivityLogs(userId);
      res.json(logs);
    } catch (error: any) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
