import { Singleton } from '../decorators';
import { IAuthenticationService } from '../interfaces/IAuthenticationService';
import { INwycService } from '../interfaces/INwycService';
import { IStorageService } from '../interfaces/IStorageService';
import { serviceContainer } from '../ServiceContainer';
import { UserProfile, LoginRequest } from '../../types/NwycTypes';

/**
 * Feature-focused authentication service implementation.
 * Manages complete authentication lifecycle including token management.
 * Abstracts away the complexity of multi-step authentication flows.
 */
@Singleton("AuthenticationService")
export class AuthenticationService implements IAuthenticationService {
  private nwycService: INwycService;
  private storageService: IStorageService;
  private currentUser: UserProfile | null = null;
  private readonly AUTH_TOKEN_KEY = 'auth_token';

  constructor() {
    this.nwycService = serviceContainer.resolve("NwycService");
    this.storageService = serviceContainer.resolve("StorageService");
  }

  /**
   * Authenticate user with credentials and establish session
   */
  async login(credentials: { user: string; password: string }): Promise<{ success: boolean; error?: string }> {
    try {
      // Perform login - this returns user data and establishes session
      const loginRequest: LoginRequest = {
        user: credentials.user,
        password: credentials.password
      };

      const loginResult = await this.nwycService.login(loginRequest);
      if (!loginResult.success) {
        return { success: false, error: loginResult.error };
      }

      // Store authentication state from login response
      this.currentUser = loginResult.data.data.user;
      // In a real implementation, you'd extract the actual token from the response
      // For now, we'll simulate having a token
      const token = `auth_token_${Date.now()}`;
      this.storageService.set(this.AUTH_TOKEN_KEY, token);

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  }

  /**
   * End session and clear tokens
   */
  async logout(): Promise<void> {
    this.storageService.remove(this.AUTH_TOKEN_KEY);
    this.currentUser = null;
  }

  /**
   * Get current valid auth token
   */
  getAuthToken(): string | null {
    return this.storageService.get<string>(this.AUTH_TOKEN_KEY);
  }

  /**
   * Refresh expired token
   */
  async refreshToken(): Promise<{ success: boolean; error?: string }> {
    try {
      const currentToken = this.storageService.get<string>(this.AUTH_TOKEN_KEY);
      if (!currentToken) {
        return { success: false, error: 'No token to refresh' };
      }

      // Attempt to re-authenticate with existing token
      const authResult = await this.nwycService.authenticate(undefined, currentToken);
      if (!authResult.success) {
        // Token is invalid, clear session
        await this.logout();
        return { success: false, error: 'Token refresh failed' };
      }

      // Update user data
      this.currentUser = authResult.data.data.user;

      return { success: true };
    } catch (error) {
      await this.logout();
      return { success: false, error: error instanceof Error ? error.message : 'Token refresh failed' };
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.storageService.has(this.AUTH_TOKEN_KEY) && this.currentUser !== null;
  }

  /**
   * Get authenticated user's basic info
   */
  async getCurrentUser(): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    if (!this.isAuthenticated()) {
      return { success: false, error: 'User not authenticated' };
    }

    if (this.currentUser) {
      return { success: true, user: this.currentUser };
    }

    // Try to fetch current user data
    try {
      const currentToken = this.storageService.get<string>(this.AUTH_TOKEN_KEY);
      if (!currentToken) {
        return { success: false, error: 'No authentication token available' };
      }

      const authResult = await this.nwycService.authenticate(undefined, currentToken);
      if (!authResult.success) {
        await this.logout();
        return { success: false, error: 'Failed to get user data' };
      }

      this.currentUser = authResult.data.data.user;
      return { success: true, user: this.currentUser };
    } catch (error) {
      await this.logout();
      return { success: false, error: error instanceof Error ? error.message : 'Failed to get user data' };
    }
  }

}
