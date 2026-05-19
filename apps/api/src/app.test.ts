import { beforeAll, describe, expect, it } from 'vitest';
import { loadEnv } from './config/env.js';
import { buildApp } from './app.js';
import { initDb } from './lib/db.js';

const env = loadEnv();

beforeAll(() => {
  initDb(env.DATABASE_URL);
});

describe('health routes', () => {
  it('GET /health returns ok', async () => {
    const app = buildApp(env);
    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });

    await app.close();
  });
});
