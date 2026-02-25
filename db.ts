import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, chatHistory, secretSessions } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Chat history queries
 */
export async function getChatHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatHistory).where(eq(chatHistory.userId, userId)).orderBy(chatHistory.createdAt);
}

export async function addChatMessage(userId: number, role: string, content: string, imageUrl?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(chatHistory).values({
    userId,
    role,
    content,
    imageUrl,
  });
}

/**
 * Secret session queries
 */
export async function createSecretSession(userId: number, sessionToken: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(secretSessions).values({
    userId,
    sessionToken,
    expiresAt,
    isActive: 1,
  });
}

export async function getSecretSession(sessionToken: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(secretSessions).where(eq(secretSessions.sessionToken, sessionToken)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function invalidateSecretSession(sessionToken: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.update(secretSessions).set({ isActive: 0 }).where(eq(secretSessions.sessionToken, sessionToken));
}
