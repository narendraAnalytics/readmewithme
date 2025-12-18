import { db } from '../index';
import { bookCache } from '../schema';
import { eq, and, gt, lt } from 'drizzle-orm';

/**
 * Generate cache key from query type and value
 * Uses a simple but effective hash function for React Native compatibility
 *
 * @param queryType - Type of query ('topic' or 'search')
 * @param queryValue - The actual search query or topic name
 * @returns Hash string for cache key
 */
function generateCacheKey(queryType: string, queryValue: string): string {
  // Simple hash function that works in React Native
  const str = `${queryType}:${queryValue}`.toLowerCase();
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return `cache_${Math.abs(hash).toString(36)}`;
}

/**
 * Get cached book recommendations
 * Returns null if cache miss or expired
 *
 * @param queryType - Type of query ('topic' or 'search')
 * @param queryValue - The actual search query or topic name
 * @returns Cached book data or null
 */
export async function getCachedBooks(queryType: 'topic' | 'search', queryValue: string) {
  try {
    const cacheKey = generateCacheKey(queryType, queryValue);
    const now = new Date();

    // Find cache entry that hasn't expired
    const cached = await db.query.bookCache.findFirst({
      where: and(eq(bookCache.cacheKey, cacheKey), gt(bookCache.expiresAt, now)),
    });

    if (cached) {
      // Increment hit count
      await db
        .update(bookCache)
        .set({ hitCount: cached.hitCount + 1 })
        .where(eq(bookCache.id, cached.id));

      console.log('✅ Cache HIT:', queryValue, `(hits: ${cached.hitCount + 1})`);
      return cached;
    }

    console.log('❌ Cache MISS:', queryValue);
    return null;
  } catch (error) {
    console.error('❌ Error fetching from cache:', error);
    return null; // Return null on error to allow fallback to API
  }
}

/**
 * Save book recommendations to cache
 * Creates new entry or updates existing one
 *
 * @param queryType - Type of query ('topic' or 'search')
 * @param queryValue - The actual search query or topic name
 * @param responseText - Gemini API response text (markdown)
 * @param groundingChunksJson - Optional grounding metadata (JSON string)
 * @returns Cached entry record
 */
export async function saveBooksToCache(
  queryType: 'topic' | 'search',
  queryValue: string,
  responseText: string,
  groundingChunksJson?: string
) {
  try {
    const cacheKey = generateCacheKey(queryType, queryValue);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // Upsert cache entry
    const [cached] = await db
      .insert(bookCache)
      .values({
        cacheKey,
        queryType,
        queryValue,
        responseText,
        groundingChunksJson: groundingChunksJson || null,
        expiresAt,
      })
      .onConflictDoUpdate({
        target: bookCache.cacheKey,
        set: {
          responseText,
          groundingChunksJson: groundingChunksJson || null,
          expiresAt,
          createdAt: now,
          hitCount: 0, // Reset hit count on refresh
        },
      })
      .returning();

    console.log('✅ Cached:', queryValue, '(expires in 7 days)');
    return cached;
  } catch (error) {
    console.error('❌ Error saving to cache:', error);
    throw new Error('Failed to save to cache');
  }
}

/**
 * Clean expired cache entries
 * Should be called periodically (e.g., on app startup or daily)
 *
 * @returns Number of deleted entries
 */
export async function cleanExpiredCache() {
  try {
    const now = new Date();

    // Get count of expired entries before deletion
    const expiredEntries = await db.query.bookCache.findMany({
      where: lt(bookCache.expiresAt, now),
    });

    if (expiredEntries.length > 0) {
      // Delete expired entries
      await db.delete(bookCache).where(lt(bookCache.expiresAt, now));

      console.log('✅ Cleaned expired cache:', expiredEntries.length, 'entries removed');
      return expiredEntries.length;
    }

    console.log('✅ No expired cache entries to clean');
    return 0;
  } catch (error) {
    console.error('❌ Error cleaning cache:', error);
    throw new Error('Failed to clean expired cache');
  }
}

/**
 * Get cache statistics
 * Useful for monitoring and analytics
 *
 * @returns Cache statistics object
 */
export async function getCacheStats() {
  try {
    const allEntries = await db.query.bookCache.findMany();
    const now = new Date();

    const active = allEntries.filter((entry) => entry.expiresAt > now);
    const expired = allEntries.filter((entry) => entry.expiresAt <= now);
    const totalHits = active.reduce((sum, entry) => sum + entry.hitCount, 0);

    return {
      totalEntries: allEntries.length,
      activeEntries: active.length,
      expiredEntries: expired.length,
      totalHits,
      averageHitsPerEntry: active.length > 0 ? totalHits / active.length : 0,
    };
  } catch (error) {
    console.error('❌ Error getting cache stats:', error);
    throw new Error('Failed to get cache statistics');
  }
}

/**
 * Clear all cache entries
 * Use with caution - removes all cached data
 */
export async function clearAllCache() {
  try {
    const allEntries = await db.query.bookCache.findMany();
    await db.delete(bookCache);

    console.log('✅ All cache cleared:', allEntries.length, 'entries removed');
    return allEntries.length;
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
    throw new Error('Failed to clear cache');
  }
}

/**
 * Get most popular cached queries
 * Returns queries sorted by hit count
 *
 * @param limit - Maximum number of entries to return
 * @returns Array of cache entries sorted by popularity
 */
export async function getPopularCachedQueries(limit = 10) {
  try {
    const now = new Date();
    const activeEntries = await db.query.bookCache.findMany({
      where: gt(bookCache.expiresAt, now),
      orderBy: (bookCache, { desc }) => [desc(bookCache.hitCount)],
      limit,
    });

    return activeEntries.map((entry) => ({
      queryType: entry.queryType,
      queryValue: entry.queryValue,
      hitCount: entry.hitCount,
      createdAt: entry.createdAt,
    }));
  } catch (error) {
    console.error('❌ Error getting popular queries:', error);
    throw new Error('Failed to get popular cached queries');
  }
}
