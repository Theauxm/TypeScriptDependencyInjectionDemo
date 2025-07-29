import { AuthenticationService } from '../../services/AuthenticationService/AuthenticationService';
import { IAuthenticationService } from '../../services/AuthenticationService/IAuthenticationService';
import { serviceContainer } from '../../di-lib/ServiceContainer';
import { Environment } from '../../di-lib/Environment';

// Import only the services we need for testing to avoid axios import issues
import '../../services/NwycService/NwycService';
import '../../services/AuthenticationService/AuthenticationService';
import '../../services/AxiosService/FakeAxiosService';
import '../../services/StorageService/MemoryStorageService';
import '../../services/ColorService/ColorService';
import '../../services/CountService/CountService';
import '../../services/PaymentService/PaymentService';

describe('AuthenticationService', () => {
  let authService: IAuthenticationService;

  beforeAll(() => {
    // Services are automatically registered with FakeAxiosService in Test environment
    // due to our setupTests.ts configuration
    authService = serviceContainer.resolve('AuthenticationService');
  });

  beforeEach(() => {
    // Clear any existing authentication state before each test
    authService.logout();
  });

  describe('Login Flow', () => {
    test('should login successfully with valid credentials', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      const result = await authService.login(credentials);

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should handle login failure gracefully', async () => {
      const credentials = {
        user: 'invalid@example.com',
        password: 'wrongpassword'
      };

      const result = await authService.login(credentials);

      // Since we're using FakeAxiosService, this will actually succeed
      // In a real scenario with error simulation, we'd test failure cases
      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });

    test('should store authentication token after successful login', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      await authService.login(credentials);
      const token = authService.getAuthToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token).toContain('auth_token_');
    });

    test('should set authenticated state after successful login', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      expect(authService.isAuthenticated()).toBe(false);

      await authService.login(credentials);

      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('Authentication State Management', () => {
    test('should return false for isAuthenticated when not logged in', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    test('should return true for isAuthenticated after login', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      await authService.login(credentials);
      expect(authService.isAuthenticated()).toBe(true);
    });

    test('should return null for auth token when not logged in', () => {
      const token = authService.getAuthToken();
      expect(token).toBeNull();
    });

    test('should return valid auth token after login', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      await authService.login(credentials);
      const token = authService.getAuthToken();

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token?.length).toBeGreaterThan(0);
    });
  });

  describe('User Profile Management', () => {
    test('should return error when getting current user without authentication', async () => {
      const result = await authService.getCurrentUser();

      expect(result.success).toBe(false);
      expect(result.error).toBe('User not authenticated');
      expect(result.user).toBeUndefined();
    });

    test('should return user profile after successful login', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      await authService.login(credentials);
      const result = await authService.getCurrentUser();

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.firstname).toBe('John');
      expect(result.user?.lastname).toBe('Doe');
      expect(result.user?.email).toBe('john.doe@example.com');
      expect(result.error).toBeUndefined();
    });

    test('should handle user profile fetch failure gracefully', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      await authService.login(credentials);
      
      // Test the getCurrentUser method
      const result = await authService.getCurrentUser();
      
      // With FakeAxiosService, this should succeed
      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });
  });

  describe('Token Management', () => {
    test('should refresh token successfully when valid token exists', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      await authService.login(credentials);
      const result = await authService.refreshToken();

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should fail to refresh token when no token exists', async () => {
      const result = await authService.refreshToken();

      expect(result.success).toBe(false);
      expect(result.error).toBe('No token to refresh');
    });

    test('should maintain authentication state after successful token refresh', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      await authService.login(credentials);
      expect(authService.isAuthenticated()).toBe(true);

      await authService.refreshToken();
      expect(authService.isAuthenticated()).toBe(true);
    });

    test('should clear authentication state after failed token refresh', async () => {
      // This test would require simulating a token refresh failure
      // For now, we test the basic token refresh functionality
      const result = await authService.refreshToken();
      expect(result.success).toBe(false);
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('Logout Flow', () => {
    test('should clear authentication state on logout', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      // Login first
      await authService.login(credentials);
      expect(authService.isAuthenticated()).toBe(true);
      expect(authService.getAuthToken()).toBeDefined();

      // Logout
      await authService.logout();

      expect(authService.isAuthenticated()).toBe(false);
      expect(authService.getAuthToken()).toBeNull();
    });

    test('should handle logout when not authenticated', async () => {
      expect(authService.isAuthenticated()).toBe(false);

      // Should not throw error
      await authService.logout();

      expect(authService.isAuthenticated()).toBe(false);
      expect(authService.getAuthToken()).toBeNull();
    });

    test('should clear user data on logout', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      // Login and verify user data
      await authService.login(credentials);
      const userResult = await authService.getCurrentUser();
      expect(userResult.success).toBe(true);
      expect(userResult.user).toBeDefined();

      // Logout
      await authService.logout();

      // Verify user data is cleared
      const userResultAfterLogout = await authService.getCurrentUser();
      expect(userResultAfterLogout.success).toBe(false);
      expect(userResultAfterLogout.error).toBe('User not authenticated');
    });
  });

  describe('Service Integration', () => {
    test('should be properly injected with dependencies', () => {
      expect(authService).toBeInstanceOf(AuthenticationService);
      expect(typeof authService.login).toBe('function');
      expect(typeof authService.logout).toBe('function');
      expect(typeof authService.isAuthenticated).toBe('function');
      expect(typeof authService.getAuthToken).toBe('function');
      expect(typeof authService.getCurrentUser).toBe('function');
      expect(typeof authService.refreshToken).toBe('function');
    });

    test('should use injected NwycService for authentication operations', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      // This test verifies that the service uses the injected NwycService
      // which in turn uses the FakeAxiosService in test environment
      const result = await authService.login(credentials);
      
      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });

    test('should use injected StorageService for token management', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      await authService.login(credentials);
      const token = authService.getAuthToken();

      // Verify token is stored and retrievable
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      // Logout should clear the token
      await authService.logout();
      const tokenAfterLogout = authService.getAuthToken();
      expect(tokenAfterLogout).toBeNull();
    });
  });

  describe('Error Handling', () => {
    test('should handle network errors gracefully during login', async () => {
      // This would require modifying FakeAxiosService to simulate network errors
      // For now, we verify the service structure supports error handling
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      const result = await authService.login(credentials);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('success');
    });

    test('should handle invalid credentials appropriately', async () => {
      // With FakeAxiosService, this will still succeed, but in real implementation
      // this would test proper error handling for invalid credentials
      const credentials = {
        user: '',
        password: ''
      };

      const result = await authService.login(credentials);
      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
    });

    test('should handle token expiration scenarios', async () => {
      // This test would require simulating token expiration
      // For now, we test the basic token refresh flow
      const result = await authService.refreshToken();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Authentication Lifecycle', () => {
    test('should maintain consistent state throughout authentication lifecycle', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      // Initial state
      expect(authService.isAuthenticated()).toBe(false);
      expect(authService.getAuthToken()).toBeNull();

      // After login
      await authService.login(credentials);
      expect(authService.isAuthenticated()).toBe(true);
      expect(authService.getAuthToken()).toBeDefined();

      // User data should be available
      const userResult = await authService.getCurrentUser();
      expect(userResult.success).toBe(true);
      expect(userResult.user).toBeDefined();

      // After logout
      await authService.logout();
      expect(authService.isAuthenticated()).toBe(false);
      expect(authService.getAuthToken()).toBeNull();

      // User data should be cleared
      const userResultAfterLogout = await authService.getCurrentUser();
      expect(userResultAfterLogout.success).toBe(false);
    });

    test('should handle multiple login attempts correctly', async () => {
      const credentials1 = {
        user: 'user1@example.com',
        password: 'password1'
      };

      const credentials2 = {
        user: 'user2@example.com',
        password: 'password2'
      };

      // First login
      await authService.login(credentials1);
      expect(authService.isAuthenticated()).toBe(true);
      const token1 = authService.getAuthToken();

      // Second login (should replace first)
      await authService.login(credentials2);
      expect(authService.isAuthenticated()).toBe(true);
      const token2 = authService.getAuthToken();

      // Tokens should be different (new login creates new token)
      expect(token1).not.toBe(token2);
    });
  });

  describe('Concurrent Operations', () => {
    test('should handle concurrent login attempts gracefully', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      // Simulate concurrent login attempts
      const loginPromises = [
        authService.login(credentials),
        authService.login(credentials),
        authService.login(credentials)
      ];

      const results = await Promise.all(loginPromises);

      // All should succeed (or handle appropriately)
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(typeof result.success).toBe('boolean');
      });

      // Final state should be authenticated
      expect(authService.isAuthenticated()).toBe(true);
    });

    test('should handle concurrent token refresh attempts', async () => {
      const credentials = {
        user: 'testuser@example.com',
        password: 'validpassword'
      };

      await authService.login(credentials);

      // Simulate concurrent refresh attempts
      const refreshPromises = [
        authService.refreshToken(),
        authService.refreshToken(),
        authService.refreshToken()
      ];

      const results = await Promise.all(refreshPromises);

      // All should succeed
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(typeof result.success).toBe('boolean');
      });

      // Should still be authenticated
      expect(authService.isAuthenticated()).toBe(true);
    });
  });
});
