import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
  type UserDTO,
} from '@project-manager/shared';
import { eq } from 'drizzle-orm';
import { users } from '../db/schema.js';
import type { Env } from '../config/env.js';
import { getDb } from '../lib/db.js';
import { HttpError } from '../lib/http-error.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../lib/jwt.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { toUserDto } from '../lib/user-mapper.js';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

/** Registers a new user */
export async function registerUser(env: Env, input: unknown): Promise<{ user: UserDTO; tokens: AuthTokens }> {
  const data = registerSchema.parse(input);
  const db = getDb();

  const existing = await db.select().from(users).where(eq(users.email, data.email)).get();

  if (existing) {
    throw new HttpError(409, 'EMAIL_TAKEN', 'Email is already registered');
  }

  const passwordHash = await hashPassword(data.password);

  const [user] = await db.insert(users).values({
    email: data.email,
    passwordHash,
    name: data.name,
  }).returning();

  return { user: toUserDto(user), tokens: createTokens(env, user.id) };
}

/** Authenticates user and returns tokens */
export async function loginUser(env: Env, input: unknown): Promise<{ user: UserDTO; tokens: AuthTokens }> {
  const data = loginSchema.parse(input);
  const db = getDb();

  const user = await db.select().from(users).where(eq(users.email, data.email)).get();

  if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  return { user: toUserDto(user), tokens: createTokens(env, user.id) };
}

/** Returns user by id */
export async function getUserById(userId: string): Promise<UserDTO> {
  const db = getDb();
  const user = await db.select().from(users).where(eq(users.id, userId)).get();

  if (!user) {
    throw new HttpError(404, 'USER_NOT_FOUND', 'User not found');
  }

  return toUserDto(user);
}

/** Updates profile fields */
export async function updateProfile(userId: string, input: unknown): Promise<UserDTO> {
  const data = updateProfileSchema.parse(input);
  const db = getDb();

  const [user] = await db.update(users)
    .set({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl }),
    })
    .where(eq(users.id, userId))
    .returning();

  if (!user) {
    throw new HttpError(404, 'USER_NOT_FOUND', 'User not found');
  }

  return toUserDto(user);
}

/** Changes password after verifying current one */
export async function changePassword(userId: string, input: unknown): Promise<void> {
  const data = changePasswordSchema.parse(input);
  const db = getDb();

  const user = await db.select().from(users).where(eq(users.id, userId)).get();

  if (!user) {
    throw new HttpError(404, 'USER_NOT_FOUND', 'User not found');
  }

  const valid = await verifyPassword(data.currentPassword, user.passwordHash);

  if (!valid) {
    throw new HttpError(401, 'INVALID_PASSWORD', 'Current password is incorrect');
  }

  const passwordHash = await hashPassword(data.newPassword);

  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}

/** Issues new access token from refresh token */
export function refreshAccessToken(env: Env, refreshToken: string): AuthTokens {
  try {
    const payload = verifyRefreshToken(env, refreshToken);

    return createTokens(env, payload.sub);
  } catch {
    throw new HttpError(401, 'INVALID_REFRESH', 'Refresh token is invalid or expired');
  }
}

function createTokens(env: Env, userId: string): AuthTokens {
  return {
    accessToken: signAccessToken(env, userId),
    refreshToken: signRefreshToken(env, userId),
  };
}
