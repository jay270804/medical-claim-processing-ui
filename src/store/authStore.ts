import { create } from 'zustand';
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  logoutUser as apiLogout,
  type User,
  type LoginUserPayload,
  type RegisterUserPayload,
  type ApiErrorDetail,
  type RegisterUserResponse,
  type LoginUserResponse
} from '../lib/apiService';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: ApiErrorDetail | null;
}

interface AuthActions {
  login: (payload: LoginUserPayload) => Promise<boolean>; // Returns true on success, false on failure
  register: (payload: RegisterUserPayload) => Promise<RegisterUserResponse>;
  logout: () => void;
  initializeAuth: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  ...initialState,

  login: async (payload: LoginUserPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response: LoginUserResponse = await apiLogin(payload);
      if (response.success && response.data) {
        set({
          user: response.data.user,
          token: response.data.token,
          isLoading: false,
          error: null,
        });
        // apiService.loginUser already stores the token in localStorage
        return true;
      } else {
        set({ error: response.error || { code: 'LOGIN_FAILED', message: 'Login failed' }, isLoading: false, token: null, user: null });
        return false;
      }
    } catch (err: any) {
      // Assuming error from apiLogin is already in ApiErrorDetail format or needs conversion
      const apiError = err.response?.data?.error || { code: 'UNKNOWN_ERROR', message: err.message || 'An unexpected error occurred' };
      set({ error: apiError, isLoading: false, token: null, user: null });
      return false;
    }
  },

  register: async (payload: RegisterUserPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRegister(payload);
      set({ isLoading: false }); // Reset loading regardless of outcome, error handled by component
      return response; // Return full response for component to handle (e.g. success message, specific errors)
    } catch (err: any) {
      const apiError = err.response?.data?.error || { code: 'UNKNOWN_ERROR', message: err.message || 'An unexpected error occurred during registration' };
      set({ error: apiError, isLoading: false });
      // Ensure a consistent error response structure is returned if the API call itself throws
      return { success: false, error: apiError } as RegisterUserResponse;
    }
  },

  logout: () => {
    apiLogout(); // This clears the token from localStorage via apiService
    set({ ...initialState }); // Reset to initial state
  },

  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        set({ token });
        // Note: User data is not re-fetched here.
        // It will be populated upon next login or if you add a 'fetchUserProfile' action.
        // For now, having the token means isAuthenticated can be derived as true.
      }
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Selector to check if user is authenticated
export const selectIsAuthenticated = (state: AuthState & AuthActions) => !!state.token;

// Call initializeAuth when the store is created/app loads
// This is a common pattern but consider calling it in your main App component or _app.tsx
if (typeof window !== 'undefined') {
  useAuthStore.getState().initializeAuth();
}