import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url().optional(),
});

/** Validates Vite env at module load in development */
export const env = envSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
});

export const apiBaseUrl = env.VITE_API_URL ?? 'http://localhost:8080';
