// src/store/authStore.ts
import { defineStore } from 'pinia';
import { useAuth0 } from '@auth0/auth0-vue'; // Import useAuth0
import type { User, LogoutOptions, RedirectLoginOptions } from '@auth0/auth0-vue'; // Import types
import { computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Access the globally reactive properties from useAuth0()
  // This works because the Auth0 plugin has been initialized and useAuth0()
  // can be called in Pinia stores after the plugin is installed.
  const {
    isLoading: sdkIsLoading,
    isAuthenticated: sdkIsAuthenticated,
    user: sdkUser,
    error: sdkError,
    loginWithRedirect,
    logout: sdkLogout,
    getAccessTokenSilently
  } = useAuth0();

  // Getters (computed properties) to expose the reactive state
  const isLoading = computed(() => sdkIsLoading.value);
  const isAuthenticated = computed(() => sdkIsAuthenticated.value);
  const user = computed(() => sdkUser.value as User | undefined | null); // sdkUser can be null if not authenticated
  const error = computed(() => sdkError.value);

  // Actions
  const login = async (options?: RedirectLoginOptions) => {
    // Default options can be set here if desired
    // e.g., options = options || { appState: { target: '/' } };
    await loginWithRedirect(options);
  };

  const logout = async (options?: LogoutOptions) => {
    // Default options can be set here, e.g., redirect to login page
    // options = options || { logoutParams: { returnTo: window.location.origin + '/login' } };
    await sdkLogout(options);
  };

  // Action to get an access token
  const getToken = async (): Promise<string | undefined> => {
    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch (e) {
      console.error('Error getting access token:', e);
      // Potentially handle specific errors, e.g., login_required
      return undefined;
    }
  };

  return {
    // State/Getters (exposed as computed refs)
    isLoading,
    isAuthenticated,
    user,
    error,
    // Actions
    login,
    logout,
    getToken,
  };
});
