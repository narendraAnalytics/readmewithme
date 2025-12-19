import dotenv from 'dotenv';
dotenv.config(); // Load env vars before accessing them

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';

const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL not found in environment variables');
  }
  return url;
};

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export const getDb = () => {
  if (!dbInstance) {
    const databaseUrl = getDatabaseUrl();
    const sql = neon(databaseUrl);
    dbInstance = drizzle(sql, { schema });
    console.log('✅ Database connection established');
  }
  return dbInstance;
};

export const db = getDb();
export { schema };
