# Semantic Services Layer Architecture

This document describes the semantic services layer that abstracts the NwycService into domain-focused, API-agnostic services.

## Overview

The semantic services layer provides a clean abstraction over the NWYC API, organizing functionality into domain-focused services that hide the complexity of the underlying REST endpoints. This architecture promotes maintainability, testability, and developer experience.

## Architecture Principles

### 1. Feature-Focused vs Domain-Focused Design

**Feature-Focused Services** (like `IAuthenticationService`):
- Manage complete feature lifecycles
- Handle cross-cutting concerns (token management, session state)
- Provide stateful abstractions over stateless APIs
- Example: `AuthenticationService` manages login, logout, token refresh, and session persistence

**Domain-Focused Services** (like `IUserService`, `ITopicsService`):
- Organize functionality by business domain
- Provide semantic operations for domain entities
- Abstract away API endpoint complexity
- Example: `UserService` handles all user-related operations (profile, settings, billing)

### 2. API Agnostic Design

Services define operations in business terms, not HTTP terms:
```typescript
// ❌ API-coupled approach
await nwycService.getUserProfile(authToken);
await nwycService.updateUserProfile(profile, authToken);

// ✅ Semantic approach
await userService.getProfile();
await userService.updateProfile(profile);
```

### 3. Stateful Abstraction

Services manage their own state internally:
- Authentication tokens
- User session data
- Configuration settings
- Caching and optimization

## Service Architecture

### Core Services

#### 1. IAuthenticationService (Feature-Focused)
**Purpose**: Complete authentication lifecycle management

```typescript
interface IAuthenticationService {
  login(credentials: { user: string; password: string }): Promise<{ success: boolean; error?: string }>;
  logout(): Promise<void>;
  getAuthToken(): string | null;
  refreshToken(): Promise<{ success: boolean; error?: string }>;
  isAuthenticated(): boolean;
  getCurrentUser(): Promise<{ success: boolean; user?: UserProfile; error?: string }>;
}
```

**Key Features**:
- Orchestrates multi-step authentication flow
- Manages token storage and retrieval
- Handles session persistence across browser sessions
- Provides simple authentication state checking

#### 2. IUserService (Domain-Focused)
**Purpose**: User profile and account management

```typescript
interface IUserService {
  getProfile(): Promise<{ success: boolean; profile?: UserProfile; error?: string }>;
  updateProfile(profile: UserProfileUpdate): Promise<{ success: boolean; error?: string }>;
  getEmailSettings(params?: GetEmailSettingsParams): Promise<{ success: boolean; settings?: string; error?: string }>;
  updateEmailSettings(settings: EmailSettingsUpdate): Promise<{ success: boolean; error?: string }>;
  getBillingReceipts(): Promise<{ success: boolean; receipts?: string; error?: string }>;
  downloadReceipt(receiptId: number): Promise<{ success: boolean; receipt?: Blob; error?: string }>;
  getMessageHistory(): Promise<{ success: boolean; messages?: UserMessagesResponse; error?: string }>;
}
```

#### 3. ILegislativeService (Domain-Focused)
**Purpose**: Legislative and representative information

```typescript
interface ILegislativeService {
  getDistrictsByAddress(address: string): Promise<{ success: boolean; districts?: DistrictsResponse; error?: string }>;
  getMyRepresentatives(): Promise<{ success: boolean; representatives?: string; error?: string }>;
  searchLegislators(criteria: GetLegislatorSearchParams): Promise<{ success: boolean; results?: LegislatorSearchResponse; error?: string }>;
  sendMessageToCongress(message: MessageCongressRequest): Promise<{ success: boolean; error?: string }>;
  getMessageForm(params?: GetMessageFormParams): Promise<{ success: boolean; form?: MessageFormResponse; error?: string }>;
  resendMessage(messageId: number): Promise<{ success: boolean; error?: string }>;
}
```

#### 4. ITopicsService (Domain-Focused)
**Purpose**: Political topics and issues management

#### 5. IPollingService (Domain-Focused)
**Purpose**: Polls and voting functionality

#### 6. IAlertsService (Domain-Focused)
**Purpose**: Action alerts and advocacy

#### 7. ICampaignsService (Domain-Focused)
**Purpose**: Advocacy campaigns

#### 8. IPublicationsService (Domain-Focused)
**Purpose**: Publications and articles

#### 9. IContentService (Domain-Focused)
**Purpose**: General content and search

## Implementation Patterns

### 1. Service Composition

Services can depend on other services to provide higher-level functionality:

```typescript
@Singleton("UserService")
export class UserService implements IUserService {
  private nwycService: INwycService;
  private authService: IAuthenticationService; // Composition

  constructor() {
    this.nwycService = serviceContainer.resolve("NwycService");
    this.authService = serviceContainer.resolve("AuthenticationService");
  }

  async getProfile(): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
    // Automatically get auth token from AuthenticationService
    const authToken = this.authService.getAuthToken();
    if (!authToken) {
      return { success: false, error: 'User not authenticated' };
    }

    const result = await this.nwycService.getUserProfile(authToken);
    // ... handle result
  }
}
```

### 2. Error Handling Abstraction

Services provide consistent error handling patterns:

```typescript
async getProfile(): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const authToken = this.authService.getAuthToken();
    if (!authToken) {
      return { success: false, error: 'User not authenticated' };
    }

    const result = await this.nwycService.getUserProfile(authToken);
    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true, profile: result.data.data.user };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to get profile' };
  }
}
```

### 3. State Management

Feature-focused services manage internal state:

```typescript
@Singleton("AuthenticationService")
export class AuthenticationService implements IAuthenticationService {
  private authToken: string | null = null;
  private currentUser: UserProfile | null = null;

  constructor() {
    this.restoreSession(); // Restore from localStorage
  }

  async login(credentials: { user: string; password: string }): Promise<{ success: boolean; error?: string }> {
    // Multi-step authentication flow
    const loginFormResult = await this.nwycService.getLoginForm();
    const loginResult = await this.nwycService.login(credentials);
    const authResult = await this.nwycService.authenticate();
    
    // Store state internally
    this.currentUser = authResult.data.data.user;
    this.authToken = `auth_token_${Date.now()}`;
    this.persistSession();
    
    return { success: true };
  }
}
```

## Benefits

### 1. Developer Experience
- **Intuitive APIs**: Method names reflect business operations
- **Reduced Complexity**: Hide multi-step API flows behind single method calls
- **Type Safety**: Full TypeScript support with domain-specific types
- **Consistent Patterns**: Uniform error handling and response structures

### 2. Maintainability
- **Separation of Concerns**: Business logic separated from API implementation
- **Single Responsibility**: Each service focuses on one domain
- **Loose Coupling**: Services depend on interfaces, not implementations
- **Easy Refactoring**: Changes to API don't affect service consumers

### 3. Testability
- **Mockable Services**: Easy to create test doubles for each service
- **Isolated Testing**: Test business logic without HTTP dependencies
- **Dependency Injection**: Services can be easily swapped for testing
- **Clear Boundaries**: Well-defined interfaces for each service

### 4. Scalability
- **Composable Architecture**: Services can be combined for complex operations
- **Stateful Optimization**: Services can cache data and optimize API calls
- **Configuration Management**: Services can adapt behavior based on environment
- **Performance**: Reduce redundant API calls through intelligent state management

## Usage Examples

### Basic Authentication Flow
```typescript
const authService = useService("AuthenticationService") as IAuthenticationService;

// Login
const loginResult = await authService.login({ user: "username", password: "password" });
if (loginResult.success) {
  console.log("Login successful!");
}

// Check authentication status
const isLoggedIn = authService.isAuthenticated();

// Get current user
const userResult = await authService.getCurrentUser();
if (userResult.success) {
  console.log("Current user:", userResult.user);
}
```

### User Profile Management
```typescript
const userService = useService("UserService") as IUserService;

// Get profile (auth token handled automatically)
const profileResult = await userService.getProfile();
if (profileResult.success) {
  console.log("User profile:", profileResult.profile);
}

// Update profile
const updateResult = await userService.updateProfile({
  firstname: "John",
  lastname: "Doe"
});
```

### Content Operations
```typescript
const contentService = useService("ContentService") as IContentService;

// Get front page content (no auth required)
const contentResult = await contentService.getFrontPageContent();
if (contentResult.success) {
  console.log("Front page data:", contentResult.content);
}
```

## Future Enhancements

1. **Caching Layer**: Add intelligent caching to reduce API calls
2. **Offline Support**: Handle offline scenarios gracefully
3. **Real-time Updates**: Integrate WebSocket support for live data
4. **Analytics**: Add usage tracking and performance monitoring
5. **Configuration**: Environment-specific service behavior
6. **Validation**: Input validation at the service layer
7. **Retry Logic**: Automatic retry for failed operations
8. **Rate Limiting**: Respect API rate limits automatically

This semantic services layer provides a robust foundation for building maintainable, testable, and scalable applications on top of the NWYC API.
