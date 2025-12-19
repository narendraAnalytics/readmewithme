import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
import { getCachedBooks, saveBooksToCache } from '../db/queries/cache';
import { generateBookContent } from '../services/gemini';

const router = Router();

/**
 * POST /api/cache/books/topic
 * Get books by topic (with caching)
 */
router.post('/books/topic', optionalAuth, async (req, res, next) => {
  try {
    const { topicName } = req.body;

    if (!topicName) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'topicName is required',
      });
    }

    // Try cache first
    const cached = await getCachedBooks('topic', topicName);
    if (cached) {
      return res.json({
        text: cached.responseText,
        cached: true,
        groundingChunks: cached.groundingChunksJson
          ? JSON.parse(cached.groundingChunksJson)
          : [],
      });
    }

    // Cache miss - fetch from Gemini
    const prompt = `Recommend 5 highly-rated books about "${topicName}".
IMPORTANT: Prioritize the MOST RECENT publications (from the last 2-3 years if available). Sort these books by publication date in DESCENDING order (newest/most recent books first).

For each book, provide:
- Title
- Author
- Publication year (in YYYY format)
- Brief description (2-3 sentences)

CRITICAL FORMATTING INSTRUCTION:
Format each book entry exactly like this:
### Title by Author | Year
Description

Use Google Search to find the most recent, highly-rated books and ensure the published dates are accurate.`;

    const response = await generateBookContent(prompt, true);

    // Save to cache
    const groundingChunksJson = JSON.stringify(response.groundingChunks || []);
    await saveBooksToCache('topic', topicName, response.text, groundingChunksJson);

    res.json({
      text: response.text,
      cached: false,
      groundingChunks: response.groundingChunks,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/cache/books/search
 * Search for specific book (with caching)
 */
router.post('/books/search', optionalAuth, async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'query is required',
      });
    }

    // Try cache first
    const cached = await getCachedBooks('search', query);
    if (cached) {
      return res.json({
        text: cached.responseText,
        cached: true,
        groundingChunks: cached.groundingChunksJson
          ? JSON.parse(cached.groundingChunksJson)
          : [],
      });
    }

    // Cache miss - fetch from Gemini
    const prompt = `I am looking for the specific book: "${query}".

Please find this exact book and provide:
- Title (exact title of the book)
- Author (full author name)
- Publication year (in YYYY format)
- Brief description (2-3 sentences about this specific book)

CRITICAL FORMATTING INSTRUCTION:
Format the book entry exactly like this:
### Title by Author | Year
Description

Use Google Search to find the exact book titled "${query}" and verify all details are accurate.
If you cannot find this exact book, find the closest match and explain in the description.`;

    const response = await generateBookContent(prompt, true);

    // Save to cache
    const groundingChunksJson = JSON.stringify(response.groundingChunks || []);
    await saveBooksToCache('search', query, response.text, groundingChunksJson);

    res.json({
      text: response.text,
      cached: false,
      groundingChunks: response.groundingChunks,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
