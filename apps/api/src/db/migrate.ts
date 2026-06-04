import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { readMigrationFiles } from 'drizzle-orm/migrator';
import { resolveSqlitePath } from './client.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function isTableExistsError(error: unknown): boolean {
  const cause = error instanceof Error && 'cause' in error ? error.cause : error;

  return cause instanceof Error && cause.message.includes('already exists');
}

/** When schema was created via db:push, stamp journal so migrate does not re-run CREATE TABLE */
function baselineJournalIfSchemaWithoutMigrations(
  sqlite: Database.Database,
  migrationsFolder: string,
): void {
  const hasUsers = sqlite.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='users' LIMIT 1",
  ).get();

  if (!hasUsers) {
    return;
  }

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL,
      created_at NUMERIC
    );
  `);

  const applied = sqlite.prepare(
    'SELECT COUNT(*) as count FROM "__drizzle_migrations"',
  ).get() as { count: number };

  if (applied.count > 0) {
    return;
  }

  const migrations = readMigrationFiles({ migrationsFolder });
  const insert = sqlite.prepare(
    'INSERT INTO "__drizzle_migrations" (hash, created_at) VALUES (?, ?)',
  );

  for (const migration of migrations) {
    insert.run(migration.hash, migration.folderMillis);
  }

  console.log('Migration journal synced with existing schema (e.g. after db:push).');
}

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

  baselineJournalIfSchemaWithoutMigrations(sqlite, migrationsFolder);

  try {
    migrate(db, { migrationsFolder });
  } catch (error) {
    if (isTableExistsError(error)) {
      baselineJournalIfSchemaWithoutMigrations(sqlite, migrationsFolder);

      try {
        migrate(db, { migrationsFolder });
      } catch (retryError) {
        sqlite.close();

        throw new Error(
          'Migration failed: database schema is out of sync. Run: npm run db:reset -w @project-manager/api',
          { cause: retryError },
        );
      }
    } else {
      sqlite.close();

      throw error;
    }
  }

  sqlite.close();
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectRun) {
  const databaseUrl = process.env.DATABASE_URL ?? 'file:./data/app.db';

  runMigrations(databaseUrl);
}
