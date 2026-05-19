import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';

/** Resolves SQLite file path from DATABASE_URL (file:./data/app.db) */
export function resolveSqlitePath(databaseUrl: string): string {
  if (databaseUrl.startsWith('file:')) {
    return databaseUrl.slice('file:'.length);
  }

  return databaseUrl;
}

/** Creates Drizzle client backed by better-sqlite3 */
export function createDb(databaseUrl: string) {
  const filePath = path.resolve(resolveSqlitePath(databaseUrl));
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(filePath);

  sqlite.pragma('foreign_keys = ON');

  return drizzle(sqlite, { schema });
}

export type Db = ReturnType<typeof createDb>;
