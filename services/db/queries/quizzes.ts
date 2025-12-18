import { db } from '../index';
import { quizAttempts } from '../schema';
import { eq, and, desc, sql } from 'drizzle-orm';

/**
 * Quiz attempt data interface
 */
export interface QuizAttemptData {
  clerkId: string;
  bookTitle: string;
  bookAuthor: string;
  score: number;
  totalQuestions: number;
  answersJson: string; // JSON.stringify(answers array)
}

/**
 * Save quiz attempt to database
 * Allows multiple attempts per book (no unique constraint)
 *
 * @param data - Quiz attempt data
 * @returns Created quiz attempt record
 */
export async function saveQuizAttempt(data: QuizAttemptData) {
  try {
    const [attempt] = await db.insert(quizAttempts).values(data).returning();

    console.log('✅ Quiz attempt saved:', `${data.score}/${data.totalQuestions}`);
    return attempt;
  } catch (error) {
    console.error('❌ Error saving quiz attempt:', error);
    throw new Error('Failed to save quiz attempt');
  }
}

/**
 * Get quiz history for a specific book
 * Returns all attempts sorted by most recent first
 *
 * @param clerkId - Clerk user ID
 * @param bookTitle - Book title
 * @param bookAuthor - Book author
 * @returns Array of quiz attempt records
 */
export async function getQuizHistory(
  clerkId: string,
  bookTitle: string,
  bookAuthor: string
) {
  try {
    const history = await db.query.quizAttempts.findMany({
      where: and(
        eq(quizAttempts.clerkId, clerkId),
        eq(quizAttempts.bookTitle, bookTitle),
        eq(quizAttempts.bookAuthor, bookAuthor)
      ),
      orderBy: [desc(quizAttempts.completedAt)],
    });

    return history;
  } catch (error) {
    console.error('❌ Error fetching quiz history:', error);
    throw new Error('Failed to fetch quiz history');
  }
}

/**
 * Get best quiz score for a book
 * Returns the attempt with the highest score
 *
 * @param clerkId - Clerk user ID
 * @param bookTitle - Book title
 * @param bookAuthor - Book author
 * @returns Best quiz attempt or null if no attempts
 */
export async function getBestQuizScore(
  clerkId: string,
  bookTitle: string,
  bookAuthor: string
) {
  try {
    const history = await getQuizHistory(clerkId, bookTitle, bookAuthor);

    if (history.length === 0) {
      return null;
    }

    // Find attempt with highest score
    const best = history.reduce((bestAttempt, current) => {
      const bestPercentage = (bestAttempt.score / bestAttempt.totalQuestions) * 100;
      const currentPercentage = (current.score / current.totalQuestions) * 100;
      return currentPercentage > bestPercentage ? current : bestAttempt;
    });

    return best;
  } catch (error) {
    console.error('❌ Error getting best quiz score:', error);
    return null;
  }
}

/**
 * Get quiz statistics for a book
 * Returns attempt count, best score, average score, etc.
 *
 * @param clerkId - Clerk user ID
 * @param bookTitle - Book title
 * @param bookAuthor - Book author
 * @returns Quiz statistics object
 */
export async function getQuizStats(
  clerkId: string,
  bookTitle: string,
  bookAuthor: string
) {
  try {
    const history = await getQuizHistory(clerkId, bookTitle, bookAuthor);

    if (history.length === 0) {
      return {
        attemptCount: 0,
        bestScore: 0,
        averageScore: 0,
        lastAttemptDate: null,
      };
    }

    const totalScore = history.reduce((sum, attempt) => sum + attempt.score, 0);
    const totalQuestions = history[0].totalQuestions; // Assume all attempts have same total
    const bestAttempt = await getBestQuizScore(clerkId, bookTitle, bookAuthor);

    return {
      attemptCount: history.length,
      bestScore: bestAttempt ? (bestAttempt.score / totalQuestions) * 100 : 0,
      averageScore: (totalScore / (history.length * totalQuestions)) * 100,
      lastAttemptDate: history[0].completedAt,
    };
  } catch (error) {
    console.error('❌ Error calculating quiz stats:', error);
    throw new Error('Failed to calculate quiz statistics');
  }
}

/**
 * Get all quiz attempts for a user (across all books)
 *
 * @param clerkId - Clerk user ID
 * @param limit - Maximum number of attempts to return
 * @returns Array of quiz attempt records
 */
export async function getAllUserQuizAttempts(clerkId: string, limit = 50) {
  try {
    const attempts = await db.query.quizAttempts.findMany({
      where: eq(quizAttempts.clerkId, clerkId),
      orderBy: [desc(quizAttempts.completedAt)],
      limit,
    });

    return attempts;
  } catch (error) {
    console.error('❌ Error fetching all quiz attempts:', error);
    throw new Error('Failed to fetch quiz attempts');
  }
}

/**
 * Get total quiz statistics for a user (across all books)
 *
 * @param clerkId - Clerk user ID
 * @returns Overall quiz statistics
 */
export async function getUserQuizStats(clerkId: string) {
  try {
    const attempts = await getAllUserQuizAttempts(clerkId, 1000);

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        booksQuizzed: 0,
        averageScore: 0,
        totalScore: 0,
      };
    }

    const totalScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0);
    const totalPossible = attempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0);

    // Count unique books
    const uniqueBooks = new Set(
      attempts.map((attempt) => `${attempt.bookTitle}::${attempt.bookAuthor}`)
    );

    return {
      totalAttempts: attempts.length,
      booksQuizzed: uniqueBooks.size,
      averageScore: (totalScore / totalPossible) * 100,
      totalScore: totalScore,
    };
  } catch (error) {
    console.error('❌ Error calculating user quiz stats:', error);
    throw new Error('Failed to calculate user quiz statistics');
  }
}
