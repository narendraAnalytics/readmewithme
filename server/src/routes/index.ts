import { Router } from 'express';
import usersRouter from './users';
import readingRouter from './reading';
import quizzesRouter from './quizzes';
import cacheRouter from './cache';

const router = Router();

router.use('/users', usersRouter);
router.use('/reading', readingRouter);
router.use('/quizzes', quizzesRouter);
router.use('/cache', cacheRouter);

export default router;
