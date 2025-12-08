import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email drafts table for saving user's work
export const emailDrafts = pgTable("email_drafts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar("title").notNull(),
  emailType: varchar("email_type"),
  style: varchar("style").notNull(),
  content: text("content").notNull(),
  formData: jsonb("form_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Email history table for tracking generated emails
export const emailHistory = pgTable("email_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'cascade' }),
  emailContent: text("email_content").notNull(),
  style: varchar("style").notNull(),
  emailType: varchar("email_type"),
  subject: varchar("subject"),
  formData: jsonb("form_data"),
  wordCount: varchar("word_count"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Composer usage tracking table for analytics
export const composerUsage = pgTable("composer_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: 'set null' }),
  sessionId: varchar("session_id"),
  style: varchar("style").notNull(),
  inputLanguage: varchar("input_language"),
  outputLanguage: varchar("output_language"),
  hasAttachment: boolean("has_attachment").default(false),
  isAuthenticated: boolean("is_authenticated").default(false),
  generationSuccess: boolean("generation_success").default(true),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertEmailDraftSchema = createInsertSchema(emailDrafts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEmailDraft = z.infer<typeof insertEmailDraftSchema>;
export type EmailDraft = typeof emailDrafts.$inferSelect;

export const insertEmailHistorySchema = createInsertSchema(emailHistory).omit({
  id: true,
  createdAt: true,
});

export type InsertEmailHistory = z.infer<typeof insertEmailHistorySchema>;
export type EmailHistory = typeof emailHistory.$inferSelect;

export const insertComposerUsageSchema = createInsertSchema(composerUsage).omit({
  id: true,
  createdAt: true,
});

export type InsertComposerUsage = z.infer<typeof insertComposerUsageSchema>;
export type ComposerUsage = typeof composerUsage.$inferSelect;
