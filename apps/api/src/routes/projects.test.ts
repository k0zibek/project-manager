import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import {
  afterAll, beforeAll, describe, expect, it,
} from 'vitest';
import { buildApp } from '../app.js';
import { loadEnv } from '../config/env.js';
import { users } from '../db/schema.js';
import { initDb, getDb } from '../lib/db.js';

const env = loadEnv();
const app = buildApp(env);

const PASSWORD = 'demo123456';

async function registerAndLogin(email: string, name: string) {
  const register = await app.inject({
    method: 'POST',
    url: '/auth/register',
    payload: { email, password: PASSWORD, name },
  });

  expect([201, 409]).toContain(register.statusCode);

  const login = await app.inject({
    method: 'POST',
    url: '/auth/login',
    payload: { email, password: PASSWORD },
  });

  const cookies: Record<string, string> = {};

  login.cookies.forEach((cookie) => {
    cookies[cookie.name] = cookie.value;
  });

  return cookies;
}

beforeAll(async () => {
  initDb(env.DATABASE_URL);
});

afterAll(async () => {
  await app.close();
});

describe('projects routes', () => {
  it('CRUD for project owner', async () => {
    const cookies = await registerAndLogin(`owner-projects-${crypto.randomUUID()}@test.com`, 'Owner');

    const create = await app.inject({
      method: 'POST',
      url: '/projects',
      cookies,
      payload: { name: 'Alpha', description: 'First project' },
    });

    expect(create.statusCode).toBe(201);

    const { project } = create.json();

    expect(project.name).toBe('Alpha');

    const list = await app.inject({
      method: 'GET',
      url: '/projects',
      cookies,
    });

    expect(list.statusCode).toBe(200);
    expect(list.json().projects).toHaveLength(1);

    const getOne = await app.inject({
      method: 'GET',
      url: `/projects/${project.id}`,
      cookies,
    });

    expect(getOne.statusCode).toBe(200);
    expect(getOne.json().project.id).toBe(project.id);

    const update = await app.inject({
      method: 'PATCH',
      url: `/projects/${project.id}`,
      cookies,
      payload: { name: 'Alpha updated' },
    });

    expect(update.statusCode).toBe(200);
    expect(update.json().project.name).toBe('Alpha updated');

    const remove = await app.inject({
      method: 'DELETE',
      url: `/projects/${project.id}`,
      cookies,
    });

    expect(remove.statusCode).toBe(204);

    const missing = await app.inject({
      method: 'GET',
      url: `/projects/${project.id}`,
      cookies,
    });

    expect(missing.statusCode).toBe(404);
  });

  it('returns 403 when accessing another user project', async () => {
    const ownerCookies = await registerAndLogin(`owner-403-${crypto.randomUUID()}@test.com`, 'Owner');
    const otherCookies = await registerAndLogin(`other-403-${crypto.randomUUID()}@test.com`, 'Other');

    const create = await app.inject({
      method: 'POST',
      url: '/projects',
      cookies: ownerCookies,
      payload: { name: 'Private', description: 'Owner only' },
    });

    const { project } = create.json();

    const forbidden = await app.inject({
      method: 'GET',
      url: `/projects/${project.id}`,
      cookies: otherCookies,
    });

    expect(forbidden.statusCode).toBe(403);
    expect(forbidden.json().error.code).toBe('FORBIDDEN');
  });

  it('returns 401 without session', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/projects',
    });

    expect(response.statusCode).toBe(401);
  });
});
