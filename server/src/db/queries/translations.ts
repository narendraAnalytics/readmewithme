import { db } from '../../config/database';
import { translatedReadingGuides } from '../schema';
import { eq, and } from 'drizzle-orm';

/**
 * Get cached translation for a book in a specific language
 */
export const getTranslation = async (
  clerkId: string,
  bookTitle: string,
  bookAuthor: string,
  languageCode: string
) => {
  const result = await db
    .select()
    .from(translatedReadingGuides)
    .where(
      and(
        eq(translatedReadingGuides.clerkId, clerkId),
        eq(translatedReadingGuides.bookTitle, bookTitle),
        eq(translatedReadingGuides.bookAuthor, bookAuthor),
        eq(translatedReadingGuides.languageCode, languageCode)
      )
    )
    .limit(1);

  return result[0] || null;
};

/**
 * Save translation to database
 */
export const saveTranslation = async (
  clerkId: string,
  bookTitle: string,
  bookAuthor: string,
  languageCode: string,
  translatedContent: string
) => {
  await db
    .insert(translatedReadingGuides)
    .values({
      clerkId,
      bookTitle,
      bookAuthor,
      languageCode,
      translatedContent,
    })
    .onConflictDoUpdate({
      target: [
        translatedReadingGuides.clerkId,
        translatedReadingGuides.bookTitle,
        translatedReadingGuides.bookAuthor,
        translatedReadingGuides.languageCode,
      ],
      set: {
        translatedContent,
        updatedAt: new Date(),
      },
    });
};
