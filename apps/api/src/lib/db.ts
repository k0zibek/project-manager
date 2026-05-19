import { createDb, type Db } from '../db/client.js';

let db: Db | null = null;

/** Initializes SQLite connection (call once at startup) */
export function initDb(databaseUrl: string): Db {
  db = createDb(databaseUrl);

  return db;
}

/** Returns initialized Drizzle instance */
export function getDb(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }

  return db;
}
