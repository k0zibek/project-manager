# ADR 001: State management (TanStack Query + Redux)

## Status

Accepted

## Context

The app has two kinds of client-side data:

- **Session identity** (current user) — needed across routes, small, changes rarely.
- **Server entities** (projects, tasks, comments) — loaded from REST, cached, invalidated after mutations.

Earlier lab code kept projects and tasks in Redux slices with thunks calling json-server.

## Decision

| Data | Tool | Rationale |
|------|------|-----------|
| User session snapshot | Redux `authSlice` | Global, synchronous reads in guards and header |
| Projects, tasks, comments | TanStack Query | Built-in cache, loading/error per query, invalidation after mutations |
| UI-only state (dialogs) | Local state / optional `uiSlice` later | No server round-trip |

Rules:

- No JWT or password in Redux or `localStorage`.
- No duplicate server lists in Redux.
- Mutations go through Query `useMutation` + `invalidateQueries`.

## Consequences

- **Positive:** Clear boundaries, less boilerplate than Redux thunks for CRUD, easier per-screen loading states.
- **Negative:** Two libraries to learn; must discipline invalidation keys (`projectKeys`, `taskKeys`).
- **Migration:** Legacy Redux `project`/`task` slices removed in PR 2–3.
