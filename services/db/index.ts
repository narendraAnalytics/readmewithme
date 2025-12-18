import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Get DATABASE_URL from environment
 * Supports multiple environment variable sources for Expo compatibility
 */
const getDatabaseUrl = (): string => {
  // Try multiple sources for DATABASE_URL
  const url =
    process.env.DATABASE_URL ||
    process.env.EXPO_PUBLIC_DATABASE_URL;

  if (!url) {
    throw new Error(
      'DATABASE_URL not found in environment variables. ' +
      'Please add DATABASE_URL to your .env file.'
    );
  }

  return url;
};

/**
 * Singleton database connection instance
 * Reuses the same connection across the app
 */
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

/**
 * Get or create database connection
 * Uses Neon's HTTP client for React Native compatibility
 */
export const getDb = () => {
  if (!dbInstance) {
    try {
      const databaseUrl = getDatabaseUrl();
      const sql = neon(databaseUrl);
      dbInstance = drizzle(sql, { schema });
      console.log('✅ Database connection established');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }
  return dbInstance;
};

/**
 * Export ready-to-use database instance
 * Usage: import { db } from '@/services/db';
 */
export const db = getDb();

/**
 * Export schema for query building
 */
export { schema };
