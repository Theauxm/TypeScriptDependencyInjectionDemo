# NWYC Service Implementation

This document describes the complete implementation of the NWYC (National Write Your Congressman) API service wrapper with TypeScript dependency injection.

## 🏗️ Architecture Overview

The implementation follows a layered architecture with dependency injection:

```
┌─────────────────────────────────────────────────────────────┐
│                    React Components                         │
│                 (NwycServiceDemo.tsx)                      │
└─────────────────────┬───────────────────────────────────────┘
                      │ useService<INwycService>
┌─────────────────────▼───────────────────────────────────────┐
│                Business Logic Layer                         │
│              INwycService / NwycService                     │
│                  (47 API methods)                          │
└─────────────────────┬───────────────────────────────────────┘
                      │ IAxiosService dependency
┌─────────────────────▼───────────────────────────────────────┐
│                   HTTP Layer                               │
│         IAxiosService / RealAxiosService                   │
│              / FakeAxiosService                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              External NWYC API                             │
│            https://nwyc.com                                │
└─────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
ts-di-demo/src/
├── types/
│   └── NwycTypes.ts                    # Complete OpenAPI TypeScript types
├── config/
│   └── AppConfig.ts                    # Configuration with NWYC settings
├── di/
│   ├── interfaces/
│   │   ├── IAxiosService.ts           # HTTP service abstraction
│   │   └── INwycService.ts            # NWYC business logic interface
│   ├── services/
│   │   ├── RealAxiosService.ts        # Real HTTP implementation
│   │   ├── FakeAxiosService.ts        # Mock HTTP implementation
│   │   └── NwycService.ts             # NWYC service implementation
│   └── factories/
│       ├── RealAxiosServiceFactory.ts # Real HTTP factory
│       ├── FakeAxiosServiceFactory.ts # Mock HTTP factory
│       └── NwycServiceFactory.ts      # NWYC service factory
└── components/
    └── NwycServiceDemo.tsx            # Demo component
```

## 🎯 Key Features

### **Complete API Coverage (47 Endpoints)**

#### Authentication & User Management
- `getLoginForm()` - GET login form
- `login()` - POST user authentication
- `authenticate()` - GET comprehensive user data
- `authenticatePost()` - POST authentication with data
- `getUserProfile()` - GET user profile form
- `updateUserProfile()` - POST profile updates
- `getBillingReceipt()` - GET billing information
- `downloadReceipt()` - GET PDF receipt download
- `getEmailSettings()` / `updateEmailSettings()` - Email preferences

#### Content & Information
- `getFrontPage()` - GET front page content and testimonials
- `getDefaultTalkingPoints()` - GET messaging talking points

#### Topics Management
- `getAllTopics()` / `getAllTopicsPost()` - GET/POST paginated topics
- `getTopicById()` - GET specific topic details
- `addUserTopic()` / `removeUserTopic()` - Manage user topic interests

#### Polls & Voting
- `getActivePolls()` / `getAllPolls()` - GET polls with pagination
- `getPollById()` / `getPollDetails()` - GET specific poll details
- `voteInPollByChoice()` / `voteInPoll()` - POST vote submissions

#### Legislative & Representatives
- `getDistrictsByAddress()` / `getDistrictsByAddressPost()` - District lookup
- `getMyRepresentatives()` - GET user's elected representatives
- `searchLegislators()` / `searchLegislatorsAjax()` - Legislator search

#### Search & Discovery
- `searchContent()` - Search across alerts, articles, bills, legislators

#### Alerts & Advocacy
- `getAlerts()` - GET action alerts with filtering
- `getAlert()` - GET specific alert details

#### Message Congress
- `getMessageCongressForm()` / `sendMessageToCongress()` - General messaging
- `getAlertMessageForm()` / `sendAlertMessage()` - Alert-specific messaging
- `resendMessage()` - Resend previous messages

#### Campaigns & Publications
- `getCampaigns()` / `getCampaign()` / `getCampaignAlerts()` - Campaign management
- `getPublications()` / `getPublicationArticles()` / `getArticle()` - Content access

#### User Data
- `getUserMessages()` - Message history
- `getUserSettings()` - Settings management

### **Technical Highlights**

#### Type Safety
- **Complete TypeScript Coverage**: All 47 endpoints with full type safety
- **OpenAPI Generated Types**: Request/response types match API specification
- **Generic ApiResult<T>**: Consistent error handling pattern

#### Dependency Injection
- **Interface-Based Design**: Easy testing and mocking
- **Factory Pattern**: Singleton instances with proper lifecycle management
- **Configuration-Driven**: Switch between real/fake services via `AppConfig.USE_REAL_API`

#### HTTP Layer Abstraction
- **IAxiosService Interface**: Clean HTTP abstraction
- **RealAxiosService**: Production Axios implementation with interceptors
- **FakeAxiosService**: Complete mock implementation with realistic delays
- **Authentication**: Automatic token injection via interceptors
- **Error Handling**: Comprehensive error management at HTTP level

#### Business Logic Layer
- **INwycService Interface**: 47 business methods
- **NwycService Implementation**: Clean wrapper over HTTP operations
- **Error Transformation**: HTTP errors converted to user-friendly messages
- **Token Management**: Authentication token handling

## 🔧 Configuration

### AppConfig.ts Settings

```typescript
export const AppConfig = {
  // Unified API Configuration
  USE_REAL_API: false,                   // Switch between real/fake services (applies to both Customer and NWYC APIs)
  
  // NWYC API Configuration
  NWYC_API_BASE_URL: 'https://nwyc.com', // Production API URL
  NWYC_DEV_API_BASE_URL: 'https://nwyc.dev.cvoice.io', // Development API URL
  NWYC_REQUEST_TIMEOUT: 10000,           // Request timeout in milliseconds
} as const;
```

### Service Registration (App.tsx)

```typescript
// Register NWYC services - configuration-driven factory selection
const axiosServiceFactory = AppConfig.USE_REAL_API 
  ? new RealAxiosServiceFactory() 
  : new FakeAxiosServiceFactory();

services.register('IAxiosService', axiosServiceFactory);
services.register('INwycService', new NwycServiceFactory(axiosServiceFactory));
```

## 🎮 Usage Examples

### Basic Service Usage

```typescript
import { useService } from '../di/useService';
import { INwycService } from '../di/interfaces/INwycService';

const MyComponent: React.FC = () => {
  const nwycService = useService<INwycService>('INwycService');

  const fetchTopics = async () => {
    const result = await nwycService.getAllTopics({ featured: true });
    if (result.success) {
      console.log('Topics:', result.data.data.topics);
    } else {
      console.error('Error:', result.error);
    }
  };

  // Component implementation...
};
```

### Authentication Flow

```typescript
// Set authentication token
nwycService.setAuthToken('your-auth-token');

// Authenticate and get user data
const authResult = await nwycService.authenticate();
if (authResult.success) {
  const userData = authResult.data.data.user;
  console.log('User:', userData.firstname, userData.lastname);
}
```

### Voting in Polls

```typescript
// Get active polls
const pollsResult = await nwycService.getActivePolls();
if (pollsResult.success) {
  const polls = pollsResult.data.data.polls;
  
  // Vote in first poll's first choice
  if (polls.length > 0 && polls[0].choices.length > 0) {
    const voteResult = await nwycService.voteInPollByChoice(polls[0].choices[0].id);
    if (voteResult.success) {
      console.log('Vote recorded!');
    }
  }
}
```

### Error Handling Pattern

```typescript
const handleApiCall = async () => {
  try {
    const result = await nwycService.getFrontPage();
    
    if (result.success) {
      // Handle successful response
      setData(result.data);
    } else {
      // Handle API error
      setError(result.error);
    }
  } catch (error) {
    // Handle unexpected errors
    setError('An unexpected error occurred');
  }
};
```

## 🧪 Testing Strategy

### Mock Service Benefits

The `FakeAxiosService` provides:
- **Realistic Mock Data**: Complete mock responses for all endpoints
- **Network Simulation**: Realistic delays (200-1000ms)
- **Error Scenarios**: Easy to test error conditions
- **No External Dependencies**: Tests run without network calls

### Testing Examples

```typescript
// Test with mock service
AppConfig.USE_REAL_API = false;

// Test with real service (integration tests)
AppConfig.USE_REAL_API = true;
```

## 🚀 Demo Features

The `NwycServiceDemo` component showcases:

### Interactive Sections
- **🔐 Authentication**: Login and user data management
- **📄 Content**: Front page content and testimonials
- **🏷️ Topics**: Browse and manage user topic interests
- **📊 Polls**: View active polls and vote
- **🚨 Alerts**: Browse action alerts and campaigns
- **🎯 Campaigns**: View advocacy campaigns
- **📰 Publications**: Browse articles and newsletters

### User Interactions
- **Authentication Token Input**: Test authentication flows
- **Topic Management**: Add topics to user interests
- **Poll Voting**: Interactive voting with real-time updates
- **Error Handling**: Comprehensive error state demonstrations
- **Loading States**: Proper async operation feedback

## 🔍 Implementation Details

### HTTP Service Features

#### RealAxiosService
- **Request Interceptors**: Automatic authentication header injection
- **Response Interceptors**: Centralized error handling
- **Form Data Handling**: Automatic form encoding for NWYC endpoints
- **Timeout Management**: Configurable request timeouts
- **Error Transformation**: HTTP errors to user-friendly messages

#### FakeAxiosService
- **URL Routing**: Smart mock response routing based on URL patterns
- **Realistic Data**: Comprehensive mock data matching API schemas
- **Network Simulation**: Variable delays to simulate real network conditions
- **Console Logging**: Debug-friendly request logging

### Business Logic Features

#### NwycService
- **Error Handling**: Consistent error handling across all methods
- **Type Safety**: Full TypeScript coverage with proper return types
- **Token Management**: Centralized authentication token handling
- **Parameter Validation**: Proper parameter passing to HTTP layer

## 📊 Metrics

- **47 API Endpoints**: Complete coverage of NWYC API
- **100% TypeScript**: Full type safety throughout
- **2-Layer Architecture**: Clean separation of HTTP and business logic
- **Dependency Injection**: Testable and maintainable design
- **Mock Coverage**: Complete fake implementation for all endpoints
- **Error Handling**: Comprehensive error management at all layers

## 🎯 Benefits

### For Development
- **Type Safety**: Catch errors at compile time
- **IntelliSense**: Full IDE support with autocomplete
- **Testability**: Easy mocking and unit testing
- **Maintainability**: Clean architecture with separation of concerns

### For Testing
- **Mock Services**: Complete fake implementations
- **Error Scenarios**: Easy error condition testing
- **No Network Dependencies**: Fast, reliable tests
- **Configuration-Driven**: Easy switching between real/fake services

### For Production
- **Error Handling**: Robust error management
- **Authentication**: Secure token-based authentication
- **Performance**: Efficient HTTP operations with proper timeouts
- **Monitoring**: Comprehensive logging and error reporting

This implementation provides a complete, production-ready wrapper for the NWYC API with full TypeScript support, comprehensive error handling, and excellent testability through dependency injection.
