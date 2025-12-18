import { db } from '../index';
import { userBooks } from '../schema';
import { eq, and } from 'drizzle-orm';

/**
 * Toggle bookmark status for a book
 * If book doesn't exist in user_books, creates it first
 *
 * @param clerkId - Clerk user ID
 * @param bookTitle - Book title
 * @param bookAuthor - Book author
 * @returns Updated book record with new bookmark status
 */
export async function toggleBookmark(
  clerkId: string,
  bookTitle: string,
  bookAuthor: string
) {
  try {
    // Check if book exists in user_books
    const existing = await db.query.userBooks.findFirst({
      where: and(
        eq(userBooks.clerkId, clerkId),
        eq(userBooks.bookTitle, bookTitle),
        eq(userBooks.bookAuthor, bookAuthor)
      ),
    });

    if (existing) {
      // Toggle bookmark status
      const [updated] = await db
        .update(userBooks)
        .set({
          isBookmarked: !existing.isBookmarked,
          updatedAt: new Date(),
        })
        .where(eq(userBooks.id, existing.id))
        .returning();

      console.log('✅ Bookmark toggled:', updated.isBookmarked ? 'Added' : 'Removed');
      return updated;
    } else {
      // Create new entry with bookmark = true
      const [newBook] = await db
        .insert(userBooks)
        .values({
          clerkId,
          bookTitle,
          bookAuthor,
          isBookmarked: true,
        })
        .returning();

      console.log('✅ Book bookmarked:', bookTitle);
      return newBook;
    }
  } catch (error) {
    console.error('❌ Error toggling bookmark:', error);
    throw new Error('Failed to toggle bookmark');
  }
}

/**
 * Get all bookmarked books for a user
 *
 * @param clerkId - Clerk user ID
 * @returns Array of bookmarked book records
 */
export async function getBookmarkedBooks(clerkId: string) {
  try {
    const bookmarks = await db.query.userBooks.findMany({
      where: and(eq(userBooks.clerkId, clerkId), eq(userBooks.isBookmarked, true)),
      orderBy: (userBooks, { desc }) => [desc(userBooks.updatedAt)],
    });

    return bookmarks;
  } catch (error) {
    console.error('❌ Error fetching bookmarks:', error);
    throw new Error('Failed to fetch bookmarked books');
  }
}

/**
 * Check if a book is bookmarked
 *
 * @param clerkId - Clerk user ID
 * @param bookTitle - Book title
 * @param bookAuthor - Book author
 * @returns Boolean indicating if book is bookmarked
 */
export async function isBookBookmarked(
  clerkId: string,
  bookTitle: string,
  bookAuthor: string
): Promise<boolean> {
  try {
    const book = await db.query.userBooks.findFirst({
      where: and(
        eq(userBooks.clerkId, clerkId),
        eq(userBooks.bookTitle, bookTitle),
        eq(userBooks.bookAuthor, bookAuthor)
      ),
    });

    return book?.isBookmarked ?? false;
  } catch (error) {
    console.error('❌ Error checking bookmark status:', error);
    return false;
  }
}

/**
 * Toggle favorite status for a book
 *
 * @param clerkId - Clerk user ID
 * @param bookTitle - Book title
 * @param bookAuthor - Book author
 * @returns Updated book record with new favorite status
 */
export async function toggleFavorite(
  clerkId: string,
  bookTitle: string,
  bookAuthor: string
) {
  try {
    const existing = await db.query.userBooks.findFirst({
      where: and(
        eq(userBooks.clerkId, clerkId),
        eq(userBooks.bookTitle, bookTitle),
        eq(userBooks.bookAuthor, bookAuthor)
      ),
    });

    if (existing) {
      const [updated] = await db
        .update(userBooks)
        .set({
          isFavorite: !existing.isFavorite,
          updatedAt: new Date(),
        })
        .where(eq(userBooks.id, existing.id))
        .returning();

      console.log('✅ Favorite toggled:', updated.isFavorite ? 'Added' : 'Removed');
      return updated;
    } else {
      // Create new entry with favorite = true
      const [newBook] = await db
        .insert(userBooks)
        .values({
          clerkId,
          bookTitle,
          bookAuthor,
          isFavorite: true,
        })
        .returning();

      console.log('✅ Book favorited:', bookTitle);
      return newBook;
    }
  } catch (error) {
    console.error('❌ Error toggling favorite:', error);
    throw new Error('Failed to toggle favorite');
  }
}

/**
 * Get all favorite books for a user
 *
 * @param clerkId - Clerk user ID
 * @returns Array of favorite book records
 */
export async function getFavoriteBooks(clerkId: string) {
  try {
    const favorites = await db.query.userBooks.findMany({
      where: and(eq(userBooks.clerkId, clerkId), eq(userBooks.isFavorite, true)),
      orderBy: (userBooks, { desc }) => [desc(userBooks.updatedAt)],
    });

    return favorites;
  } catch (error) {
    console.error('❌ Error fetching favorites:', error);
    throw new Error('Failed to fetch favorite books');
  }
}
