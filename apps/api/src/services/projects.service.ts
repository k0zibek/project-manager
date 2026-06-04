import {
  createProjectSchema,
  updateProjectSchema,
  type ProjectDTO,
} from '@project-manager/shared';
import { eq } from 'drizzle-orm';
import { projects } from '../db/schema.js';
import { getDb } from '../lib/db.js';
import { HttpError } from '../lib/http-error.js';
import { toProjectDto } from '../lib/project-mapper.js';

/** Lists projects owned by the user */
export async function listProjectsForOwner(ownerId: string): Promise<ProjectDTO[]> {
  const db = getDb();
  const rows = await db.select().from(projects).where(eq(projects.ownerId, ownerId));

  return rows.map(toProjectDto);
}

/** Returns a project if the user is the owner */
export async function getProjectForOwner(projectId: string, ownerId: string): Promise<ProjectDTO> {
  const project = await findProjectById(projectId);

  assertOwner(project, ownerId);

  return toProjectDto(project);
}

/** Creates a project for the owner */
export async function createProject(ownerId: string, input: unknown): Promise<ProjectDTO> {
  const data = createProjectSchema.parse(input);
  const db = getDb();

  const [project] = await db.insert(projects).values({
    ownerId,
    name: data.name,
    description: data.description,
  }).returning();

  return toProjectDto(project);
}

/** Updates a project owned by the user */
export async function updateProject(
  projectId: string,
  ownerId: string,
  input: unknown,
): Promise<ProjectDTO> {
  const data = updateProjectSchema.parse(input);

  if (Object.keys(data).length === 0) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'No fields to update');
  }

  const existing = await findProjectById(projectId);

  assertOwner(existing, ownerId);

  const db = getDb();
  const [project] = await db.update(projects).set(data).where(eq(projects.id, projectId)).returning();

  return toProjectDto(project);
}

/** Deletes a project owned by the user */
export async function deleteProject(projectId: string, ownerId: string): Promise<void> {
  const existing = await findProjectById(projectId);

  assertOwner(existing, ownerId);

  const db = getDb();

  await db.delete(projects).where(eq(projects.id, projectId));
}

async function findProjectById(projectId: string) {
  const db = getDb();
  const project = await db.select().from(projects).where(eq(projects.id, projectId)).get();

  if (!project) {
    throw new HttpError(404, 'NOT_FOUND', 'Project not found');
  }

  return project;
}

function assertOwner(project: typeof projects.$inferSelect, ownerId: string) {
  if (project.ownerId !== ownerId) {
    throw new HttpError(403, 'FORBIDDEN', 'You do not have access to this project');
  }
}
