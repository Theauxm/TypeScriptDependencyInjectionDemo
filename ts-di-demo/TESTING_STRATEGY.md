# Testing Strategy for TypeScript React DI Application

## Overview

This document outlines the comprehensive testing strategy implemented for the TypeScript React application with Dependency Injection, specifically focusing on testing the `NwycService` and `AuthenticationService` using the `FakeAxiosService`.

## Architecture

### Environment-Based Dependency Injection

The testing strategy leverages the existing environment-based DI system:

```typescript
// Environment configuration
export enum Environment {
  Local = "Local",
  Development = "Development", 
  Test = "Test",           // ← Test environment
  Production = "Production"
}

// Service profiles define which implementations are used per environment
export const DEFAULT_SERVICE_PROFILE = {
  AxiosService: {
    [Environment.Local]: "FakeAxiosService",
    [Environment.Development]: "FakeAxiosService", 
    [Environment.Test]: "FakeAxiosService",        // ← Uses fake for tests
    [Environment.Production]: "RealAxiosService"
  },
  // ... other services
}
```

### Test Environment Setup

The test environment is configured in `setupTests.ts`:

```typescript
// Mock the CURRENT_ENVIRONMENT to use Test environment during tests
jest.mock('./di-lib/Environment', () => {
  const originalModule = jest.requireActual('./di-lib/Environment');
  return {
    ...originalModule,
    CURRENT_ENVIRONMENT: originalModule.Environment.Test,
  };
});
```

## Testing Strategy Benefits

### 1. **True Dependency Injection Testing**
- Services are injected naturally through the DI container
- No manual mocking of the ServiceContainer required
- Real service instances with fake dependencies

### 2. **Environment Isolation**
- Tests run in dedicated Test environment
- Automatic selection of appropriate service implementations
- No interference with other environments

### 3. **Realistic Testing**
- Same DI resolution path as production
- Services interact naturally with each other
- Comprehensive integration testing

### 4. **Maintainable Tests**
- Changes to DI configuration don't break tests
- No brittle mocking setup
- Clear separation of concerns

## Test Structure

### NwycService Tests (39 tests)

The NwycService tests cover all major endpoint categories:

- **Authentication Endpoints** (4 tests)
  - Login form retrieval
  - User login
  - Authentication verification
  - POST authentication

- **Content Endpoints** (2 tests)
  - Front page data
  - Default talking points

- **Legislative Endpoints** (4 tests)
  - Districts by address (GET/POST)
  - User representatives
  - Legislator search

- **Topics Endpoints** (5 tests)
  - Get all topics (GET/POST)
  - Topic by ID
  - Add/remove user topics

- **Polls Endpoints** (5 tests)
  - Active polls
  - All polls
  - Poll by ID
  - Poll voting (2 methods)

- **User Settings Endpoints** (4 tests)
  - User profile (GET/POST)
  - Email settings (GET/POST)

- **Message Congress Endpoints** (3 tests)
  - Message form
  - Send message
  - User messages

- **Alerts Endpoints** (2 tests)
  - Get alerts
  - Alert by ID

- **Campaigns Endpoints** (2 tests)
  - Get campaigns
  - Campaign by ID

- **Publications Endpoints** (3 tests)
  - Get publications
  - Publication articles
  - Article by ID

- **Error Handling & Integration** (5 tests)
  - Error handling verification
  - Service integration validation
  - Request format consistency

### AuthenticationService Tests (26 tests)

The AuthenticationService tests focus on authentication lifecycle:

- **Login Flow** (4 tests)
  - Successful login
  - Login failure handling
  - Token storage
  - Authentication state

- **Authentication State Management** (4 tests)
  - isAuthenticated() behavior
  - Token retrieval
  - State consistency

- **User Profile Management** (3 tests)
  - Unauthenticated user handling
  - Profile retrieval after login
  - Profile fetch failure handling

- **Token Management** (4 tests)
  - Token refresh success/failure
  - Authentication state maintenance
  - Failed refresh cleanup

- **Logout Flow** (3 tests)
  - State cleanup on logout
  - Logout when not authenticated
  - User data clearing

- **Service Integration** (3 tests)
  - Dependency injection verification
  - NwycService integration
  - StorageService integration

- **Error Handling** (3 tests)
  - Network error handling
  - Invalid credentials
  - Token expiration scenarios

- **Authentication Lifecycle** (2 tests)
  - Complete lifecycle testing
  - Multiple login attempts

## Key Testing Patterns

### 1. **Type-Safe Testing**
```typescript
// Using proper TypeScript interfaces
let authService: IAuthenticationService;
let nwycService: NwycService;

// Type-safe result checking
if (result.success) {
  expect(result.data).toBeDefined();
  expect(result.data.status).toBe('OK');
}
```

### 2. **Environment-Aware Service Resolution**
```typescript
beforeAll(() => {
  // Services automatically resolved with correct implementations
  nwycService = serviceContainer.resolve('NwycService');
  authService = serviceContainer.resolve('AuthenticationService');
});
```

### 3. **Comprehensive Endpoint Coverage**
```typescript
// Testing all HTTP methods and parameter combinations
test('should get all topics successfully', async () => {
  const result = await nwycService.getAllTopics(undefined, authToken);
  // Comprehensive assertions...
});

test('should get all topics via POST successfully', async () => {
  const result = await nwycService.getAllTopicsPost(undefined, authToken);
  // Comprehensive assertions...
});
```

### 4. **State Management Testing**
```typescript
test('should maintain consistent state throughout authentication lifecycle', async () => {
  // Initial state
  expect(authService.isAuthenticated()).toBe(false);
  
  // After login
  await authService.login(credentials);
  expect(authService.isAuthenticated()).toBe(true);
  
  // After logout
  await authService.logout();
  expect(authService.isAuthenticated()).toBe(false);
});
```

## FakeAxiosService Integration

The `FakeAxiosService` provides:

- **Realistic Mock Data**: Comprehensive mock responses for all NWYC API endpoints
- **Network Simulation**: Simulated network delays (200-1000ms)
- **Request Logging**: Detailed logging of all HTTP requests for debugging
- **Consistent Responses**: Predictable data for reliable testing

### Example Mock Response
```typescript
private getMockAuthenticateResponse(): AuthenticateResponse {
  return {
    status: "OK",
    message: "Authenticated successfully",
    data: {
      user: this.getMockUserProfileData(),
      campaigns: this.getMockCampaignsData(),
      appsponsors: [...]
    }
  };
}
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests without watch mode
npm test -- --watchAll=false

# Run specific test file
npm test NwycService.test.ts

# Run with coverage
npm test -- --coverage
```

## Test Output Analysis

The test output shows successful DI operation:

```
[ServiceContainer] Registering FakeAxiosService for AxiosService in Test environment
[ServiceContainer] Creating singleton instance of NwycService for NwycService
[FakeAxiosService] GET /login?format=json
[FakeAxiosService] POST /login?format=json
```

This confirms:
- ✅ Test environment is active
- ✅ FakeAxiosService is being used
- ✅ All requests go through the fake service
- ✅ Proper URL formatting with `format=json`

## Best Practices Demonstrated

1. **Environment-Based Testing**: Leveraging existing DI infrastructure
2. **No Manual Mocking**: Using real service instances with injected fakes
3. **Comprehensive Coverage**: Testing all service methods and scenarios
4. **Type Safety**: Full TypeScript support throughout tests
5. **Integration Testing**: Services working together naturally
6. **Maintainable Structure**: Clear test organization and naming
7. **Realistic Data**: Using comprehensive mock data that matches real API responses

## Future Enhancements

1. **Error Simulation**: Extend FakeAxiosService to simulate network errors
2. **Performance Testing**: Add timing assertions for service calls
3. **Edge Case Testing**: More comprehensive error scenario coverage
4. **Integration Tests**: Cross-service interaction testing
5. **E2E Testing**: Full application flow testing with React Testing Library

This testing strategy provides a robust foundation for ensuring the reliability and correctness of the DI-based TypeScript React application while maintaining the benefits of the dependency injection architecture.
