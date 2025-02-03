import { createClient } from '@libsql/client';
import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from '$env/static/private';

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
    throw new Error('Missing required Turso environment variables');
}

export const tursoClient = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN
});

// Verify connection
try {
    await tursoClient.execute({ sql: 'SELECT 1', args: [] });
    console.log('Successfully connected to Turso database');
} catch (err) {
    console.error('Failed to connect to Turso database:', err);
    throw new Error('Database connection failed');
} 