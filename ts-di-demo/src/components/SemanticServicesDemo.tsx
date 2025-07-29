import React, { useState, useEffect } from 'react';
import { useService } from '../hooks/use-service';
import { IAuthenticationService } from '../services/AuthenticationService/IAuthenticationService';
import { IUserService } from '../services/interfaces/IUserService';
import { IContentService } from '../services/interfaces/IContentService';
import { UserProfile } from '../types/NwycTypes';

/**
 * Demo component showing how to use the semantic services layer.
 * This demonstrates the abstraction benefits - clean, domain-focused APIs
 * that hide the complexity of the underlying NWYC API endpoints.
 */
export const SemanticServicesDemo: React.FC = () => {
  const authService = useService("AuthenticationService") as IAuthenticationService;

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loginForm, setLoginForm] = useState({ user: '', password: '' });
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    // Check authentication status on component mount
    setIsAuthenticated(authService.isAuthenticated());
    setStatus('Authentication service loaded');
  }, [authService]);

  const handleLogin = async () => {
    setStatus('Logging in...');
    
    try {
      const result = await authService.login(loginForm);
      
      if (result.success) {
        setIsAuthenticated(true);
        setStatus('Login successful!');
        
        // Get current user info
        const userResult = await authService.getCurrentUser();
        if (userResult.success && userResult.user) {
          setCurrentUser(userResult.user);
        }
      } else {
        setStatus(`Login failed: ${result.error}`);
      }
    } catch (error) {
      setStatus(`Login error: ${error}`);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setStatus('Logged out successfully');
    } catch (error) {
      setStatus(`Logout error: ${error}`);
    }
  };


  const refreshToken = async () => {
    setStatus('Refreshing token...');
    
    try {
      const result = await authService.refreshToken();
      
      if (result.success) {
        setStatus('Token refreshed successfully');
      } else {
        setStatus(`Token refresh failed: ${result.error}`);
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch (error) {
      setStatus(`Token refresh error: ${error}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Semantic Services Layer Demo</h2>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Architecture Benefits</h3>
        <ul>
          <li><strong>Feature-Focused:</strong> AuthenticationService handles complete auth lifecycle</li>
          <li><strong>Domain-Driven:</strong> UserService manages all user-related operations</li>
          <li><strong>API Agnostic:</strong> Clean interfaces hide NWYC API complexity</li>
          <li><strong>Stateful:</strong> Services manage tokens and session state internally</li>
          <li><strong>Composable:</strong> Services work together seamlessly</li>
        </ul>
      </div>

      {/* Authentication Section */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Authentication Service</h3>
        <p><strong>Status:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
        
        {!isAuthenticated ? (
          <div>
            <input
              type="text"
              placeholder="Username"
              value={loginForm.user}
              onChange={(e) => setLoginForm({ ...loginForm, user: e.target.value })}
              style={{ marginRight: '10px', padding: '5px' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              style={{ marginRight: '10px', padding: '5px' }}
            />
            <button onClick={handleLogin} style={{ padding: '5px 10px' }}>
              Login
            </button>
          </div>
        ) : (
          <div>
            <button onClick={handleLogout} style={{ marginRight: '10px', padding: '5px 10px' }}>
              Logout
            </button>
            <button onClick={refreshToken} style={{ padding: '5px 10px' }}>
              Refresh Token
            </button>
          </div>
        )}
      </div>

      {/* Current User Display */}
      {currentUser && (
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <h3>Current User (from AuthenticationService)</h3>
          <div style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '3px' }}>
            <p><strong>Name:</strong> {currentUser.firstname} {currentUser.lastname}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            {currentUser.home_city && (
              <p><strong>Location:</strong> {currentUser.home_city}, {currentUser.home_state}</p>
            )}
          </div>
        </div>
      )}

      {/* Storage Service Demo */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h3>Generic Storage Service</h3>
        <p>The MemoryStorageService is a generic singleton memory service that can store any type of data with key-value pairs.</p>
        <p><strong>Auth Token:</strong> {authService.getAuthToken() ? 'Token stored in memory' : 'No token stored'}</p>
        <p><strong>Token Key:</strong> 'auth_token'</p>
        <p><strong>Storage Type:</strong> Generic key-value memory store</p>
      </div>

      {/* Status Section */}
      <div style={{ padding: '15px', backgroundColor: '#e8f4f8', borderRadius: '5px' }}>
        <h3>Status</h3>
        <p>{status}</p>
      </div>

      {/* Code Example */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Usage Example</h3>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
{`// Simple, clean API usage:
const authService = useService<IAuthenticationService>("AuthenticationService");
const userService = useService<IUserService>("UserService");

// Login with automatic session management
const result = await authService.login({ user: "username", password: "password" });

// Get user profile (auth token handled automatically)
const profile = await userService.getProfile();

// Check authentication status
const isLoggedIn = authService.isAuthenticated();`}
        </pre>
      </div>
    </div>
  );
};
