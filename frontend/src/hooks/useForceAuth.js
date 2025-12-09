import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { getToken } from "../utils/storage.js";

/**
 * Hook to force authentication state synchronization
 * This ensures the auth state is properly set after verification
 */
export const useForceAuth = () => {
  const { user, token, setUser, setTokenInStore } = useAuthStore();

  useEffect(() => {
    // Check if we have a token in storage but not in state
    const storedToken = getToken();

    if (storedToken && !token) {
      console.log(
        "🔧 Force auth: Token found in storage but not in state, syncing..."
      );

      // Try to get user data from the token
      try {
        // Decode the token to get user info (basic decode, not verification)
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        console.log("🔧 Force auth: Token payload:", payload);

        // Set the token in state
        setTokenInStore(storedToken);

        // If we have user data, set it
        if (payload.id) {
          // We need to fetch fresh user data from the API
          // For now, create a basic user object
          const basicUser = {
            id: payload.id,
            emailVerified: true, // Assume verified if we have a valid token
            isActive: true,
          };
          setUser(basicUser);
          console.log("🔧 Force auth: Basic user data set");
        }
      } catch (error) {
        console.error("🔧 Force auth: Error decoding token:", error);
      }
    }
  }, [token, setUser, setTokenInStore]);

  return { user, token };
};

export default useForceAuth;
