import { sql } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { getDb } from '../lib/db.js';

/** Health check for deploy probes and local dev */
export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/health', async () => ({ status: 'ok' }));

  app.get('/health/db', async (_req, reply) => {
    try {
      const db = getDb();

      await db.run(sql`SELECT 1`);

      return { status: 'ok', database: 'connected' };
    } catch {
      return reply.status(503).send({
        error: { code: 'DB_UNAVAILABLE', message: 'Database is not reachable' },
      });
    }
  });
};
