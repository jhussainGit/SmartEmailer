import {
  users,
  emailDrafts,
  type User,
  type UpsertUser,
  type EmailDraft,
  type InsertEmailDraft,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Email draft operations
  createDraft(draft: InsertEmailDraft): Promise<EmailDraft>;
  getUserDrafts(userId: string): Promise<EmailDraft[]>;
  getDraft(id: string): Promise<EmailDraft | undefined>;
  updateDraft(id: string, content: string): Promise<EmailDraft>;
  deleteDraft(id: string, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Email draft operations
  async createDraft(draftData: InsertEmailDraft): Promise<EmailDraft> {
    const [draft] = await db
      .insert(emailDrafts)
      .values(draftData)
      .returning();
    return draft;
  }

  async getUserDrafts(userId: string): Promise<EmailDraft[]> {
    return await db
      .select()
      .from(emailDrafts)
      .where(eq(emailDrafts.userId, userId))
      .orderBy(desc(emailDrafts.updatedAt));
  }

  async getDraft(id: string): Promise<EmailDraft | undefined> {
    const [draft] = await db
      .select()
      .from(emailDrafts)
      .where(eq(emailDrafts.id, id));
    return draft;
  }

  async updateDraft(id: string, content: string): Promise<EmailDraft> {
    const [draft] = await db
      .update(emailDrafts)
      .set({ content, updatedAt: new Date() })
      .where(eq(emailDrafts.id, id))
      .returning();
    return draft;
  }

  async deleteDraft(id: string, userId: string): Promise<void> {
    const result = await db
      .delete(emailDrafts)
      .where(and(eq(emailDrafts.id, id), eq(emailDrafts.userId, userId)))
      .returning();
    
    if (result.length === 0) {
      throw new Error('Draft not found or unauthorized');
    }
  }
}

export const storage = new DatabaseStorage();
