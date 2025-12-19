import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { syncUser, getUserByClerkId } from '../db/queries/users';

const router = Router();

/**
 * POST /api/users/sync
 * Sync Clerk user to database
 */
router.post('/sync', requireAuth, async (req, res, next) => {
  try {
    const { email, username, firstName, lastName } = req.body;
    const clerkId = req.auth!.userId;

    const user = await syncUser({
      clerkId,
      email: email || null,
      username: username || null,
      firstName: firstName || null,
      lastName: lastName || null,
    });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const clerkId = req.auth!.userId;
    const user = await getUserByClerkId(clerkId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Please sync your account first',
      });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;
