import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';

// Extend Express Request type to include auth
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId: string;
      };
    }
  }
}

/**
 * Middleware to verify Clerk JWT token
 * Extracts token from Authorization header and verifies it
 */
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided',
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token with Clerk
    const verified = await clerkClient.verifyToken(token);

    if (!verified || !verified.sub) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    // Attach user info to request
    req.auth = {
      userId: verified.sub,
      sessionId: verified.sid as string,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token verification failed',
    });
  }
};

/**
 * Optional auth middleware - doesn't fail if no token
 * Useful for endpoints that work with or without auth
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const verified = await clerkClient.verifyToken(token);

      if (verified && verified.sub) {
        req.auth = {
          userId: verified.sub,
          sessionId: verified.sid as string,
        };
      }
    }

    next();
  } catch (error) {
    // Silently fail - auth is optional
    next();
  }
};
