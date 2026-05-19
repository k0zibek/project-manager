# Project Manager

Kanban-style project and task manager. Evolving from a lab SPA into a portfolio pet project.

## Stack

- **apps/web** — React, Vite, Redux Toolkit, Blueprint.js, `fetch` API client
- **apps/api** — Fastify, **Drizzle ORM**, **SQLite**, Zod
- **packages/shared** — shared types and API error shapes

Legacy json-server remains in **apps/legacy-backend** until the REST API replaces all endpoints.

## Requirements

- Node.js **>= 20** (see `.nvmrc`)
- No Docker required (SQLite file-based DB)

## Quick start

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env

npm install
npm run db:migrate
npm run db:seed
npm run dev
```

| Service | URL |
|---------|-----|
| Web | http://localhost:5173 |
| API | http://localhost:3000 |
| API health | http://localhost:3000/health |
| Legacy mock (optional) | http://localhost:8080 |

**Demo login:** `demo@demo.com` / `demo123456`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | API + Web + legacy backend |
| `npm run dev:stack` | API + Web only |
| `npm run build` | Build all workspaces |
| `npm run lint` | Lint all workspaces |
| `npm run test` | Test all workspaces |
| `npm run db:migrate` | Apply Drizzle SQL migrations |
| `npm run db:push` | Sync schema from code (dev only) |
| `npm run db:seed` | Seed demo data |

## Database

SQLite file defaults to `apps/api/data/app.db` (see `DATABASE_URL=file:./data/app.db`).

```bash
# Apply migrations
npm run db:migrate

# Seed demo user + project
npm run db:seed
```

## Docs

- [Pet refactor design](docs/specs/pet-refactor-design.md)

## Roadmap

- [x] PR 0 — Monorepo, apiFetch, CI
- [x] PR 1 — Auth (JWT cookies, authSlice)
- [ ] PR 2 — Projects API + TanStack Query
- [ ] PR 3 — Tasks, Kanban, comments
