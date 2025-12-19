import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  saveBookToHistory,
  getReadingHistory,
  saveReadingGuide,
  getReadingGuide,
  updateReadingProgress,
} from '../db/queries/reading';
import { getTranslation, saveTranslation } from '../db/queries/translations';
import { generateBookContent, translateReadingGuide } from '../services/gemini';

const router = Router();

/**
 * POST /api/reading/history
 * Save book to reading history
 */
router.post('/history', requireAuth, async (req, res, next) => {
  try {
    const clerkId = req.auth!.userId;
    const { bookTitle, bookAuthor, publishedDate, topic } = req.body;

    if (!bookTitle || !bookAuthor) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'bookTitle and bookAuthor are required',
      });
    }

    const book = await saveBookToHistory(
      clerkId,
      bookTitle,
      bookAuthor,
      publishedDate,
      topic
    );

    res.json({ success: true, book });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/reading/history
 * Get user's reading history
 */
router.get('/history', requireAuth, async (req, res, next) => {
  try {
    const clerkId = req.auth!.userId;
    const limit = parseInt(req.query.limit as string) || 20;

    const history = await getReadingHistory(clerkId, limit);

    res.json({ history });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/reading/guide
 * Get or generate reading guide for a book
 */
router.post('/guide', requireAuth, async (req, res, next) => {
  try {
    const clerkId = req.auth!.userId;
    const { bookTitle, bookAuthor } = req.body;

    if (!bookTitle || !bookAuthor) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'bookTitle and bookAuthor are required',
      });
    }

    // Check cache first
    const cached = await getReadingGuide(clerkId, bookTitle, bookAuthor);
    if (cached?.readingGuideContent) {
      return res.json({
        guide: cached.readingGuideContent,
        languageCode: cached.languageCode,
        cached: true,
      });
    }

    // Generate new guide
    const prompt = `I want to read and understand the book "${bookTitle}" by "${bookAuthor}".

Please provide a comprehensive "Read With Me" guide that includes:
1. A detailed synopsis of the book's core argument or plot
2. Key themes and main ideas
3. Important takeaways
4. Discussion questions for reflection

Format your response with clear sections using:
## for main section headings
### for subsections
**text** for emphasis

Use Google Search to ensure accuracy.`;

    const response = await generateBookContent(prompt, true);

    // Save to cache
    await saveReadingGuide(clerkId, bookTitle, bookAuthor, response.text, 'en');

    res.json({
      guide: response.text,
      languageCode: 'en',
      cached: false,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/reading/translate
 * Translate reading guide to target language
 */
router.post('/translate', requireAuth, async (req, res, next) => {
  try {
    const clerkId = req.auth!.userId;
    const { bookTitle, bookAuthor, targetLanguageCode } = req.body;

    if (!bookTitle || !bookAuthor || !targetLanguageCode) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'bookTitle, bookAuthor, and targetLanguageCode are required',
      });
    }

    // Check if translation already exists
    const cached = await getTranslation(
      clerkId,
      bookTitle,
      bookAuthor,
      targetLanguageCode
    );

    if (cached?.translatedContent) {
      return res.json({
        text: cached.translatedContent,
        languageCode: targetLanguageCode,
        cached: true,
      });
    }

    // Get the English version (original content)
    const englishGuide = await getReadingGuide(clerkId, bookTitle, bookAuthor);
    if (!englishGuide?.readingGuideContent) {
      return res.status(404).json({
        error: 'Reading guide not found',
        message: 'Please generate the English reading guide first',
      });
    }

    // Translate using Gemini
    const languageNames = {
      te: 'Telugu',
      hi: 'Hindi',
      ta: 'Tamil',
      mr: 'Marathi',
    };
    const languageName = languageNames[targetLanguageCode as keyof typeof languageNames] || targetLanguageCode;

    const translatedText = await translateReadingGuide(
      englishGuide.readingGuideContent,
      languageName
    );

    // Save translation to cache
    await saveTranslation(
      clerkId,
      bookTitle,
      bookAuthor,
      targetLanguageCode,
      translatedText
    );

    res.json({
      text: translatedText,
      languageCode: targetLanguageCode,
      cached: false,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/reading/progress
 * Update reading progress percentage
 */
router.put('/progress', requireAuth, async (req, res, next) => {
  try {
    const clerkId = req.auth!.userId;
    const { bookTitle, bookAuthor, percentage } = req.body;

    if (!bookTitle || !bookAuthor || percentage === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'bookTitle, bookAuthor, and percentage are required',
      });
    }

    await updateReadingProgress(clerkId, bookTitle, bookAuthor, percentage);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
