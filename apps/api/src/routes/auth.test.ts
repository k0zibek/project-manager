import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import {
  afterAll, beforeAll, describe, expect, it,
} from 'vitest';
import { loadEnv } from '../config/env.js';
import { buildApp } from '../app.js';
import { users } from '../db/schema.js';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '../lib/jwt.js';
import { initDb, getDb } from '../lib/db.js';

const env = loadEnv();
const app = buildApp(env);

const DEMO_EMAIL = 'demo@demo.com';
const DEMO_PASSWORD = 'demo123456';

beforeAll(async () => {
  initDb(env.DATABASE_URL);

  const db = getDb();
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const existing = await db.select().from(users).where(eq(users.email, DEMO_EMAIL)).get();

  if (!existing) {
    await db.insert(users).values({
      email: DEMO_EMAIL,
      passwordHash,
      name: 'Demo User',
    });
  } else {
    await db.update(users).set({ passwordHash }).where(eq(users.email, DEMO_EMAIL));
  }
});

afterAll(async () => {
  await app.close();
});

function extractCookies(response: { cookies: { name: string; value: string }[] }) {
  const cookies: Record<string, string> = {};

  response.cookies.forEach((cookie) => {
    cookies[cookie.name] = cookie.value;
  });

  return cookies;
}

describe('auth routes', () => {
  it('POST /auth/login sets cookies and returns user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.user.email).toBe(DEMO_EMAIL);

    const cookies = extractCookies(response);

    expect(cookies[ACCESS_COOKIE]).toBeDefined();
    expect(cookies[REFRESH_COOKIE]).toBeDefined();
  });

  it('GET /auth/me returns user when authenticated', async () => {
    const login = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: DEMO_EMAIL, password: DEMO_PASSWORD },
    });

    const cookies = extractCookies(login);

    const me = await app.inject({
      method: 'GET',
      url: '/auth/me',
      cookies,
    });

    expect(me.statusCode).toBe(200);
    expect(me.json().user.email).toBe(DEMO_EMAIL);
  });

  it('GET /auth/me returns 401 without cookies', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/auth/me',
    });

    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe('UNAUTHORIZED');
  });
});
