import { UserProfile } from '../../types/NwycTypes';

/**
 * Feature-focused authentication service interface.
 * Manages complete authentication lifecycle including token management.
 */
export interface IAuthenticationService {
  /**
   * Authenticate user with credentials and establish session
   */
  login(credentials: { user: string; password: string }): Promise<{ success: boolean; error?: string }>;

  /**
   * End session and clear tokens
   */
  logout(): Promise<void>;

  /**
   * Get current valid auth token
   */
  getAuthToken(): string | null;

  /**
   * Refresh expired token
   */
  refreshToken(): Promise<{ success: boolean; error?: string }>;

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean;

  /**
   * Get authenticated user's basic info
   */
  getCurrentUser(): Promise<{ success: boolean; user?: UserProfile; error?: string }>;
}
