import {
  afterAll, beforeAll, describe, expect, it,
} from 'vitest';
import { buildApp } from '../app.js';
import { loadEnv } from '../config/env.js';
import { initDb } from '../lib/db.js';

const env = loadEnv();
const app = buildApp(env);

const PASSWORD = 'demo123456';

async function registerLoginCreateProject(email: string, name: string) {
  await app.inject({
    method: 'POST',
    url: '/auth/register',
    payload: { email, password: PASSWORD, name },
  });

  const login = await app.inject({
    method: 'POST',
    url: '/auth/login',
    payload: { email, password: PASSWORD },
  });

  const cookies: Record<string, string> = {};

  login.cookies.forEach((cookie) => {
    cookies[cookie.name] = cookie.value;
  });

  const project = await app.inject({
    method: 'POST',
    url: '/projects',
    cookies,
    payload: { name: 'Task Project', description: 'For task tests' },
  });

  return { cookies, projectId: project.json().project.id as string };
}

beforeAll(async () => {
  initDb(env.DATABASE_URL);
});

afterAll(async () => {
  await app.close();
});

describe('tasks routes', () => {
  it('CRUD tasks and comments for project owner', async () => {
    const { cookies, projectId } = await registerLoginCreateProject(`tasks-crud-${crypto.randomUUID()}@test.com`, 'Owner');

    const create = await app.inject({
      method: 'POST',
      url: `/projects/${projectId}/tasks`,
      cookies,
      payload: {
        title: 'Task A',
        description: 'Do something',
        deadline: '2026-12-31',
      },
    });

    expect(create.statusCode).toBe(201);

    const { task } = create.json();

    const list = await app.inject({
      method: 'GET',
      url: `/projects/${projectId}/tasks`,
      cookies,
    });

    expect(list.json().tasks).toHaveLength(1);

    const detail = await app.inject({
      method: 'GET',
      url: `/tasks/${task.id}`,
      cookies,
    });

    expect(detail.statusCode).toBe(200);

    const patch = await app.inject({
      method: 'PATCH',
      url: `/tasks/${task.id}`,
      cookies,
      payload: { status: 'IN_PROGRESS' },
    });

    expect(patch.json().task.status).toBe('IN_PROGRESS');

    const comment = await app.inject({
      method: 'POST',
      url: `/tasks/${task.id}/comments`,
      cookies,
      payload: { text: 'Hello' },
    });

    expect(comment.statusCode).toBe(201);

    const withComments = await app.inject({
      method: 'GET',
      url: `/tasks/${task.id}`,
      cookies,
    });

    expect(withComments.json().task.comments).toHaveLength(1);

    const remove = await app.inject({
      method: 'DELETE',
      url: `/tasks/${task.id}`,
      cookies,
    });

    expect(remove.statusCode).toBe(204);
  });

  it('returns 403 for foreign project tasks', async () => {
    const owner = await registerLoginCreateProject(`task-owner-${crypto.randomUUID()}@test.com`, 'Owner');
    const other = await registerLoginCreateProject(`task-other-${crypto.randomUUID()}@test.com`, 'Other');

    const forbidden = await app.inject({
      method: 'GET',
      url: `/projects/${owner.projectId}/tasks`,
      cookies: other.cookies,
    });

    expect(forbidden.statusCode).toBe(403);
  });
});
