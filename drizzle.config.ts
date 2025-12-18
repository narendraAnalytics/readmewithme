import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL must be set in environment variables. ' +
    'Please add DATABASE_URL=your_neon_connection_string to your .env file.'
  );
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './services/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
