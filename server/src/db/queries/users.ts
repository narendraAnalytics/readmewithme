import { db } from '../../config/database';
import { users } from '../schema';
import { eq } from 'drizzle-orm';

/**
 * User data interface for syncing from Clerk
 */
export interface UserData {
  clerkId: string;
  email: string | null;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
}

/**
 * Sync user from Clerk to database (upsert operation)
 * Creates new user if doesn't exist, updates if exists
 *
 * @param userData - User data from Clerk
 * @returns Synced user record
 */
export async function syncUser(userData: UserData) {
  try {
    // Check if user already exists
    const existing = await db.query.users.findFirst({
      where: eq(users.clerkId, userData.clerkId),
    });

    if (existing) {
      // Update existing user
      const [updated] = await db
        .update(users)
        .set({
          email: userData.email,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, userData.clerkId))
        .returning();

      console.log('✅ User updated:', userData.clerkId);
      return updated;
    } else {
      // Create new user
      const [newUser] = await db
        .insert(users)
        .values({
          clerkId: userData.clerkId,
          email: userData.email,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
        })
        .returning();

      console.log('✅ New user created:', userData.clerkId);
      return newUser;
    }
  } catch (error) {
    console.error('❌ Error syncing user:', error);
    throw new Error('Failed to sync user to database');
  }
}

/**
 * Get user by Clerk ID
 *
 * @param clerkId - Clerk user ID
 * @returns User record or undefined
 */
export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, clerkId),
    });

    return user;
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    throw new Error('Failed to fetch user from database');
  }
}

/**
 * Delete user by Clerk ID
 * Also deletes all related data (cascade delete)
 *
 * @param clerkId - Clerk user ID
 */
export async function deleteUser(clerkId: string) {
  try {
    await db.delete(users).where(eq(users.clerkId, clerkId));
    console.log('✅ User deleted:', clerkId);
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw new Error('Failed to delete user from database');
  }
}
