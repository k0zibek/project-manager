import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { createDb } from './client.js';
import { runMigrations } from './migrate.js';
import { projects, tasks, users } from './schema.js';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./data/app.db';

runMigrations(databaseUrl);

const db = createDb(databaseUrl);

/** Seeds local SQLite with demo data */
async function main() {
  const passwordHash = await bcrypt.hash('demo123456', 12);

  const existing = await db.select().from(users).where(eq(users.email, 'demo@demo.com')).get();

  const demo = existing ?? (await db.insert(users).values({
    email: 'demo@demo.com',
    passwordHash,
    name: 'Demo User',
    avatarUrl: null,
  }).returning())[0];

  const projectCount = await db.select().from(projects).where(eq(projects.ownerId, demo.id));

  if (projectCount.length === 0) {
    const [project] = await db.insert(projects).values({
      ownerId: demo.id,
      name: 'Demo Project',
      description: 'Seeded project for local development',
    }).returning();

    await db.insert(projects).values({
      ownerId: demo.id,
      name: 'Portfolio Backlog',
      description: 'Second seeded project for list and pagination demos',
    });

    await db.insert(tasks).values({
      projectId: project.id,
      assigneeId: demo.id,
      executorId: demo.id,
      title: 'Welcome task',
      description: 'Explore the board and task detail',
      deadline: new Date('2026-12-31'),
      status: 'TODO',
    });
  }

  console.log('Seed complete. Login: demo@demo.com / demo123456');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
