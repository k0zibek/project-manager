import type { User } from '../db/schema.js';
import type { UserDTO } from '@project-manager/shared';

/** Maps DB user row to public DTO (no password) */
export function toUserDto(user: User): UserDTO {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };
}
