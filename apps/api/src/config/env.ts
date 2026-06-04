import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1).default('file:./data/app.db'),
  JWT_SECRET: z.string().min(32),
  COOKIE_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;

/** Validates process.env at startup (load vars via node --env-file=.env in scripts) */
export function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    console.error('Create apps/api/.env from .env.example and run via npm scripts (they pass --env-file).');
    process.exit(1);
  }

  return parsed.data;
}
