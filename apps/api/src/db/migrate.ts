import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { resolveSqlitePath } from './client.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Applies SQL migrations from ./drizzle to the database in DATABASE_URL */
export function runMigrations(databaseUrl: string): void {
  const filePath = path.resolve(resolveSqlitePath(databaseUrl));
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(filePath);

  sqlite.pragma('foreign_keys = ON');

  const db = drizzle(sqlite);
  const migrationsFolder = path.join(__dirname, '../../drizzle');

  migrate(db, { migrationsFolder });
  sqlite.close();
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  const databaseUrl = process.env.DATABASE_URL ?? 'file:./data/app.db';

  runMigrations(databaseUrl);
}
