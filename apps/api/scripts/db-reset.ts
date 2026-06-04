import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveSqlitePath } from '../src/db/client.js';
import { runMigrations } from '../src/db/migrate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.join(__dirname, '..');

const databaseUrl = process.env.DATABASE_URL ?? 'file:./data/app.db';
const filePath = path.resolve(apiRoot, resolveSqlitePath(databaseUrl));

if (fs.existsSync(filePath)) {
  fs.unlinkSync(filePath);
  console.log(`Removed ${filePath}`);
}

runMigrations(databaseUrl);
console.log('Migrations applied.');
