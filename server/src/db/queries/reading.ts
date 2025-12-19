import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../config/database';
import { readingProgress, userBooks } from '../schema';

/**
 * Save book to user's reading history
 * Creates or updates both user_books and reading_progress entries
 *
 * @param clerkId - Clerk user ID
 * @param bookTitle - Book title
 * @param bookAuthor - Book author
 * @param publishedDate - Optional publication date
 * @param topic - Optional topic/category
 * @returns Created/updated book record
 */
export async function saveBookToHistory(
  clerkId: string,
  bookTitle: string,
  bookAuthor: string,
  publishedDate?: string,
  topic?: string
) {
  try {
    // Upsert user_books
    const [book] = await db
      .insert(userBooks)
      .values({
        clerkId,
        bookTitle,
        bookAuthor,
        publishedDate: publishedDate || null,
        topic: topic || null,
      })
      .onConflictDoUpdate({
        target: [userBooks.clerkId, userBooks.bookTitle, userBooks.bookAuthor],
        set: { updatedAt: new Date() },
      })
      .returning();

    // Upsert reading_progress
    await db
      .insert(readingProgress)
      .values({
        clerkId,
        bookTitle,
        bookAuthor,
        lastReadAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [readingProgress.clerkId, readingProgress.bookTitle, readingProgress.bookAuthor],
        set: { lastReadAt: new Date() },
      });

    console.log('✅ Book saved to history:', bookTitle);
    return book;
  } catch (error) {
    console.error('❌ Error saving book to history:', error);
    throw new Error('Failed to save book to reading history');
  }
}

/**
 * Get user's reading history (most recent first)
 *
 * @param clerkId - Clerk user ID
 * @param limit - Maximum number of records to return (default: 20)
 * @returns Array of reading progress records
 */
export async function getReadingHistory(clerkId: string, limit = 20) {
  try {
    const history = await db.query.readingProgress.findMany({
      where: eq(readingProgress.clerkId, clerkId),
      orderBy: [desc(readingProgress.lastReadAt)],
      limit,
    });

    return history;
  } catch (error) {
    console.error('❌ Error fetching reading history:', error);
    throw new Error('Failed to fetch reading history');
  }
}

/**
 * Save reading guide content to cache
 * Caches the AI-generated reading guide for faster subsequent loads
 *
 * @param clerkId - Clerk user ID
 * @param bookTitle - Book title
 * @param bookAuthor - Book author
 * @param content - Reading guide content (markdown)
 * @param languageCode - Language code (default: 'en')
 */
export async function saveReadingGuide(
  clerkId: string,
  bookTitle: string,
  bookAuthor: string,
  content: string,
  languageCode = 'en'
) {
  try {
    // Use insert with onConflictDoUpdate (upsert) instead of simple update
    // This handles cases where the reading_progress record might not exist yet
    await db
      .insert(readingProgress)
      .values({
        clerkId,
        bookTitle,
        bookAuthor,
        readingGuideContent: content,
        languageCode,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [readingProgress.clerkId, readingProgress.bookTitle, readingProgress.bookAuthor],
        set: {
          readingGuideContent: content,
          languageCode,
          updatedAt: new Date(),
        },
      });

    console.log('✅ Reading guide cached (upserted):', bookTitle);
  } catch (error) {
    console.error('❌ Error saving reading guide:', error);
    throw new Error('Failed to cache reading guide');
  }
}

/**
 * Get cached reading guide
 *
 * @param clerkId - Clerk user ID
 * @param bookTitle - Book title
 * @param bookAuthor - Book author
 * @returns Reading progress record with cached guide or undefined
 */
export async function getReadingGuide(
  clerkId: string,
  bookTitle: string,
  bookAuthor: string
) {
  try {
    const guide = await db.query.readingProgress.findFirst({
      where: and(
        eq(readingProgress.clerkId, clerkId),
        eq(readingProgress.bookTitle, bookTitle),
        eq(readingProgress.bookAuthor, bookAuthor)
      ),
    });

    return guide;
  } catch (error) {
    console.error('❌ Error fetching reading guide:', error);
    throw new Error('Failed to fetch reading guide');
  }
}

/**
 * Update reading progress percentage
 *
 * @param clerkId - Clerk user ID
 * @param bookTitle - Book title
 * @param bookAuthor - Book author
 * @param percentage - Progress percentage (0-100)
 */
export async function updateReadingProgress(
  clerkId: string,
  bookTitle: string,
  bookAuthor: string,
  percentage: number
) {
  try {
    await db
      .update(readingProgress)
      .set({
        progressPercentage: Math.min(100, Math.max(0, percentage)),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(readingProgress.clerkId, clerkId),
          eq(readingProgress.bookTitle, bookTitle),
          eq(readingProgress.bookAuthor, bookAuthor)
        )
      );

    console.log('✅ Progress updated:', percentage + '%');
  } catch (error) {
    console.error('❌ Error updating progress:', error);
    throw new Error('Failed to update reading progress');
  }
}

/**
 * Get all books user has started reading
 *
 * @param clerkId - Clerk user ID
 * @returns Array of user book records
 */
export async function getAllUserBooks(clerkId: string) {
  try {
    const books = await db.query.userBooks.findMany({
      where: eq(userBooks.clerkId, clerkId),
      orderBy: [desc(userBooks.updatedAt)],
    });

    return books;
  } catch (error) {
    console.error('❌ Error fetching user books:', error);
    throw new Error('Failed to fetch user books');
  }
}
