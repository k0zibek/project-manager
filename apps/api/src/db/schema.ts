import { relations, sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const taskStatusEnum = ['TODO', 'IN_PROGRESS', 'DONE'] as const;
export type TaskStatus = (typeof taskStatusEnum)[number];

const id = () => text('id').primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = () => integer('created_at', { mode: 'timestamp' })
  .notNull()
  .default(sql`(unixepoch())`);

export const users = sqliteTable('users', {
  id: id(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: createdAt(),
});

export const projects = sqliteTable('projects', {
  id: id(),
  ownerId: text('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  createdAt: createdAt(),
}, (table) => [index('projects_owner_id_idx').on(table.ownerId)]);

export const tasks = sqliteTable('tasks', {
  id: id(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  assigneeId: text('assignee_id').notNull().references(() => users.id),
  executorId: text('executor_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  deadline: integer('deadline', { mode: 'timestamp' }).notNull(),
  status: text('status', { enum: taskStatusEnum }).notNull().default('TODO'),
  createdAt: createdAt(),
}, (table) => [
  index('tasks_project_id_idx').on(table.projectId),
  index('tasks_executor_id_idx').on(table.executorId),
]);

export const comments = sqliteTable('comments', {
  id: id(),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  authorId: text('author_id').notNull().references(() => users.id),
  text: text('text').notNull(),
  createdAt: createdAt(),
}, (table) => [index('comments_task_id_idx').on(table.taskId)]);

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  comments: many(comments),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, { fields: [tasks.projectId], references: [projects.id] }),
  assignee: one(users, { fields: [tasks.assigneeId], references: [users.id] }),
  executor: one(users, { fields: [tasks.executorId], references: [users.id] }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  task: one(tasks, { fields: [comments.taskId], references: [tasks.id] }),
  author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
