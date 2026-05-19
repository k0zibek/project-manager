import { loadEnv } from './config/env.js';
import { buildApp } from './app.js';
import { initDb } from './lib/db.js';

const env = loadEnv();

initDb(env.DATABASE_URL);

const app = buildApp(env);

await app.listen({ port: env.PORT, host: '0.0.0.0' });
