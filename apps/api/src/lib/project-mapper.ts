import type { ProjectDTO } from '@project-manager/shared';
import type { projects } from '../db/schema.js';

type ProjectRow = typeof projects.$inferSelect;

/** Maps DB project row to API DTO */
export function toProjectDto(project: ProjectRow): ProjectDTO {
  return {
    id: project.id,
    ownerId: project.ownerId,
    name: project.name,
    description: project.description,
    createdAt: project.createdAt.toISOString(),
  };
}
