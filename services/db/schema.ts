import { pgTable, serial, text, timestamp, integer, boolean, index, unique } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

/**
 * Users table - Extended user profile synced from Clerk
 * Links to Clerk authentication via clerkId
 */
export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    clerkId: text('clerk_id').notNull().unique(),
    email: text('email'),
    username: text('username'),
    firstName: text('first_name'),
    lastName: text('last_name'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    clerkIdIdx: index('clerk_id_idx').on(table.clerkId),
  })
);

/**
 * User Books table - Tracks all books a user has viewed/saved
 * Includes bookmark and favorite flags
 */
export const userBooks = pgTable(
  'user_books',
  {
    id: serial('id').primaryKey(),
    clerkId: text('clerk_id').notNull(),
    bookTitle: text('book_title').notNull(),
    bookAuthor: text('book_author').notNull(),
    publishedDate: text('published_date'),
    topic: text('topic'),
    isBookmarked: boolean('is_bookmarked').default(false).notNull(),
    isFavorite: boolean('is_favorite').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    clerkIdIdx: index('user_books_clerk_id_idx').on(table.clerkId),
    uniqueUserBook: unique('unique_user_book').on(table.clerkId, table.bookTitle, table.bookAuthor),
  })
);

/**
 * Reading Progress table - Tracks reading sessions and cached content
 * Stores last read timestamp and cached reading guide
 */
export const readingProgress = pgTable(
  'reading_progress',
  {
    id: serial('id').primaryKey(),
    clerkId: text('clerk_id').notNull(),
    bookTitle: text('book_title').notNull(),
    bookAuthor: text('book_author').notNull(),
    lastReadAt: timestamp('last_read_at').defaultNow().notNull(),
    readingGuideContent: text('reading_guide_content'),
    languageCode: text('language_code').default('en').notNull(),
    progressPercentage: integer('progress_percentage').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    clerkIdIdx: index('reading_progress_clerk_id_idx').on(table.clerkId),
    uniqueReadingProgress: unique('unique_reading_progress').on(
      table.clerkId,
      table.bookTitle,
      table.bookAuthor
    ),
  })
);

/**
 * Quiz Attempts table - Stores all quiz attempts and results
 * Users can take quizzes multiple times (no unique constraint)
 */
export const quizAttempts = pgTable(
  'quiz_attempts',
  {
    id: serial('id').primaryKey(),
    clerkId: text('clerk_id').notNull(),
    bookTitle: text('book_title').notNull(),
    bookAuthor: text('book_author').notNull(),
    score: integer('score').notNull(),
    totalQuestions: integer('total_questions').default(5).notNull(),
    answersJson: text('answers_json').notNull(),
    completedAt: timestamp('completed_at').defaultNow().notNull(),
  },
  (table) => ({
    clerkIdIdx: index('quiz_attempts_clerk_id_idx').on(table.clerkId),
  })
);

/**
 * Book Cache table - Caches Gemini API responses
 * Reduces API calls and improves performance
 * Expires after 7 days
 */
export const bookCache = pgTable(
  'book_cache',
  {
    id: serial('id').primaryKey(),
    cacheKey: text('cache_key').notNull().unique(),
    queryType: text('query_type').notNull(), // 'topic' or 'search'
    queryValue: text('query_value').notNull(),
    responseText: text('response_text').notNull(),
    groundingChunksJson: text('grounding_chunks_json'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    hitCount: integer('hit_count').default(0).notNull(),
  },
  (table) => ({
    cacheKeyIdx: index('cache_key_idx').on(table.cacheKey),
    queryTypeValueIdx: index('query_type_value_idx').on(table.queryType, table.queryValue),
  })
);

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserBook = typeof userBooks.$inferSelect;
export type NewUserBook = typeof userBooks.$inferInsert;

export type ReadingProgress = typeof readingProgress.$inferSelect;
export type NewReadingProgress = typeof readingProgress.$inferInsert;

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type NewQuizAttempt = typeof quizAttempts.$inferInsert;

export type BookCache = typeof bookCache.$inferSelect;
export type NewBookCache = typeof bookCache.$inferInsert;
