import { existsSync, lstatSync, mkdirSync, symlinkSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Symlinks apps/api's drizzle-orm so hoisted drizzle-kit can resolve it (npm workspaces). */
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'apps/api/node_modules/drizzle-orm');
const link = join(root, 'node_modules/drizzle-orm');

if (!existsSync(target)) {
  process.exit(0);
}

try {
  if (lstatSync(link).isSymbolicLink()) {
    process.exit(0);
  }
} catch {
  // link missing — create below
}

mkdirSync(join(root, 'node_modules'), { recursive: true });
symlinkSync(relative(dirname(link), target), link);
