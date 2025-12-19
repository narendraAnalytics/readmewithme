import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { userApi } from '@/services/backendApi';

/**
 * Custom hook to automatically sync Clerk user to database
 * Call this hook in any authenticated screen to ensure user exists in database
 *
 * Usage:
 * ```tsx
 * const { syncing, error } = useUserSync();
 * ```
 *
 * @returns Object with syncing state and error message
 */
export function useUserSync() {
  const { user, isLoaded } = useUser();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    // Don't sync if:
    // - Clerk not loaded yet
    // - No user signed in
    // - Already synced this session
    if (!isLoaded || !user || synced) {
      return;
    }

    const performSync = async () => {
      setSyncing(true);
      setError(null);

      try {
        // Extract user data from Clerk
        const userData = {
          email: user.primaryEmailAddress?.emailAddress || null,
          username: user.username || null,
          firstName: user.firstName || null,
          lastName: user.lastName || null,
        };

        // Sync to database via backend API
        await userApi.syncUser(userData);

        setSynced(true);
        console.log('✅ User synced successfully:', user.id);
      } catch (err) {
        console.error('❌ User sync error:', err);
        setError('Failed to sync user data. Some features may not work properly.');
      } finally {
        setSyncing(false);
      }
    };

    performSync();
  }, [isLoaded, user?.id, synced]); // Re-sync if user ID changes

  return { syncing, error, synced };
}

/**
 * Reset sync state (useful for testing or after sign-out)
 * This is optional and typically not needed in production
 */
export function useResetUserSync() {
  const [resetKey, setResetKey] = useState(0);

  const reset = () => {
    setResetKey((prev) => prev + 1);
  };

  return { resetKey, reset };
}
