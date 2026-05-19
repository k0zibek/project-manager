import bcrypt from 'bcrypt';

const ROUNDS = 12;

/** Hashes a plaintext password */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

/** Compares plaintext with stored hash */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
