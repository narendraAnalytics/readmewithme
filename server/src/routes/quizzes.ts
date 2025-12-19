import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import {
  saveQuizAttempt,
  getQuizHistory,
  getBestQuizScore,
  getQuizStats,
} from '../db/queries/quizzes';
import { generateQuiz } from '../services/gemini';

const router = Router();

/**
 * POST /api/quizzes/generate
 * Generate quiz questions for a book
 */
router.post('/generate', requireAuth, async (req, res, next) => {
  try {
    const { bookTitle, bookAuthor } = req.body;

    if (!bookTitle || !bookAuthor) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'bookTitle and bookAuthor are required',
      });
    }

    const questions = await generateQuiz(bookTitle, bookAuthor);

    res.json({ questions });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/quizzes/attempt
 * Save quiz attempt
 */
router.post('/attempt', requireAuth, async (req, res, next) => {
  try {
    const clerkId = req.auth!.userId;
    const { bookTitle, bookAuthor, score, totalQuestions, answersJson } = req.body;

    if (!bookTitle || !bookAuthor || score === undefined || !totalQuestions || !answersJson) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'All quiz fields are required',
      });
    }

    const attempt = await saveQuizAttempt({
      clerkId,
      bookTitle,
      bookAuthor,
      score,
      totalQuestions,
      answersJson,
    });

    res.json({ success: true, attempt });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/quizzes/history/:bookTitle/:bookAuthor
 * Get quiz history for a specific book
 */
router.get('/history/:bookTitle/:bookAuthor', requireAuth, async (req, res, next) => {
  try {
    const clerkId = req.auth!.userId;
    const { bookTitle, bookAuthor } = req.params;

    const history = await getQuizHistory(clerkId, decodeURIComponent(bookTitle), decodeURIComponent(bookAuthor));

    res.json({ history });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/quizzes/stats/:bookTitle/:bookAuthor
 * Get quiz statistics for a book
 */
router.get('/stats/:bookTitle/:bookAuthor', requireAuth, async (req, res, next) => {
  try {
    const clerkId = req.auth!.userId;
    const { bookTitle, bookAuthor } = req.params;

    const stats = await getQuizStats(clerkId, decodeURIComponent(bookTitle), decodeURIComponent(bookAuthor));

    res.json({ stats });
  } catch (error) {
    next(error);
  }
});

export default router;
