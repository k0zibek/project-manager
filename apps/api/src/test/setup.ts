process.env.DATABASE_URL ??= 'file:./data/test.db';
process.env.JWT_SECRET ??= 'test-jwt-secret-minimum-32-characters-long';
process.env.COOKIE_SECRET ??= 'test-cookie-secret-minimum-32-chars';
process.env.CORS_ORIGIN ??= 'http://localhost:5173';
process.env.NODE_ENV = 'test';
