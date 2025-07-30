# @nwyc/di - TypeScript Dependency Injection Library

A lightweight, framework-agnostic TypeScript dependency injection library with environment-based configuration and lifecycle management. Includes optional React integration.

## Features

- **Framework Agnostic**: Works with any TypeScript project (Node.js, React, Vue, Angular, etc.)
- **Environment-Based Configuration**: Different service implementations per environment
- **Lifecycle Management**: Singleton and Transient service lifecycles
- **Type Safety**: Full TypeScript support with generic type parameters
- **React Integration**: Optional React hooks for seamless integration
- **Decorator Support**: Clean service registration with decorators
- **Zero Dependencies**: Core library has no runtime dependencies

## Installation

```bash
npm install @nwyc/di
```

For React projects, ensure you have React 16.8+ installed:

```bash
npm install react@^16.8.0
```

## Quick Start

### 1. Define Your Service Interfaces

```typescript
// services/IUserService.ts
export interface IUserService {
  getUser(id: string): Promise<User>;
}

// services/IApiService.ts  
export interface IApiService {
  get<T>(url: string): Promise<T>;
}
```

### 2. Create Service Implementations

```typescript
// services/UserService.ts
import { Injectable } from '@nwyc/di';
import { IUserService } from './IUserService';

@Injectable("UserService")
export class UserService implements IUserService {
  async getUser(id: string): Promise<User> {
    // Implementation
  }
}

// services/MockUserService.ts
@Injectable("UserService") 
export class MockUserService implements IUserService {
  async getUser(id: string): Promise<User> {
    // Mock implementation for testing
  }
}
```

### 3. Configure Your Container

```typescript
// config/DIConfig.ts
import { ServiceContainer, Environment, DIConfiguration } from '@nwyc/di';

// Define your service keys
export type MyServiceKeys = 'UserService' | 'ApiService';

// Configure lifecycles
const lifecycleConfig = {
  UserService: 'Singleton',
  ApiService: 'Singleton',
} as const;

// Configure environment-specific implementations
const environmentConfig = {
  UserService: {
    [Environment.Local]: 'MockUserService',
    [Environment.Development]: 'UserService', 
    [Environment.Production]: 'UserService',
  },
  ApiService: {
    [Environment.Local]: 'MockApiService',
    [Environment.Development]: 'RealApiService',
    [Environment.Production]: 'RealApiService', 
  },
} as const;

// Create configuration
export const diConfiguration: DIConfiguration<MyServiceKeys, Environment> = {
  lifecycleConfig,
  environmentConfig,
  currentEnvironment: Environment.Local, // Will be overridden by detectEnvironment()
};

// Create and configure container
export const container = new ServiceContainer<ServiceMap, MyServiceKeys, Environment>();
```

### 4. Initialize Your Container

```typescript
// config/DIInitialization.ts
import { setActiveContainer, detectEnvironment } from '@nwyc/di';
import { container, diConfiguration } from './DIConfig';

export function initializeDI() {
  const currentEnvironment = detectEnvironment() as Environment;
  
  const config = {
    ...diConfiguration,
    currentEnvironment,
  };

  container.initialize(config);
  setActiveContainer(container); // For decorator registration
}

// Initialize immediately
initializeDI();

export { container };
```

### 5. Use Services

#### In Regular TypeScript Code

```typescript
import { container } from './config/DIInitialization';

// Resolve services directly
const userService = container.resolve('UserService');
const user = await userService.getUser('123');
```

#### In React Components

```typescript
import { useService, createContainerHooks } from '@nwyc/di';
import { container } from './config/DIInitialization';

// Option 1: Use generic hooks with container
function UserProfile({ userId }: { userId: string }) {
  const userService = useService(container, 'UserService');
  // Use userService...
}

// Option 2: Create container-specific hooks (recommended)
const { useService: useMyService, getService } = createContainerHooks(container);

function UserProfile({ userId }: { userId: string }) {
  const userService = useMyService('UserService');
  // Use userService...
}
```

## Advanced Usage

### Custom Environment Detection

```typescript
import { detectEnvironment } from '@nwyc/di';

// The library tries common environment variables:
// - NODE_ENV
// - REACT_APP_ENVIRONMENT  
// - VUE_APP_ENVIRONMENT
// - ENVIRONMENT

// You can override detection:
const customEnvironment = process.env.MY_CUSTOM_ENV || detectEnvironment();
```

### Multiple Containers

```typescript
// You can create multiple containers for different contexts
const userContainer = new ServiceContainer<UserServiceMap, UserServiceKeys, Environment>();
const apiContainer = new ServiceContainer<ApiServiceMap, ApiServiceKeys, Environment>();

// Each with their own configuration
userContainer.initialize(userConfig);
apiContainer.initialize(apiConfig);
```

### Service Dependencies

```typescript
@Injectable("OrderService")
export class OrderService implements IOrderService {
  private userService: IUserService;
  private paymentService: IPaymentService;

  constructor() {
    // Resolve dependencies in constructor
    this.userService = container.resolve('UserService');
    this.paymentService = container.resolve('PaymentService');
  }
}
```

## API Reference

### Core Classes

#### `ServiceContainer<TServiceMap, TServiceKeys, TEnvironments>`

The main dependency injection container.

**Methods:**
- `initialize(config: DIConfiguration)` - Initialize with configuration
- `register<K>(key, factory, singleton, implementationName)` - Register a service
- `resolve<K>(key: K): TServiceMap[K]` - Resolve a service instance

#### `DIConfiguration<TServiceKeys, TEnvironments>`

Configuration interface for the container.

**Properties:**
- `lifecycleConfig` - Maps service keys to 'Singleton' | 'Transient'
- `environmentConfig` - Maps service keys to environment-specific implementations  
- `currentEnvironment` - The active environment

### Decorators

#### `@Injectable(serviceKey: string)`

Decorator to register a class as a service implementation.

```typescript
@Injectable("MyService")
export class MyService implements IMyService {
  // Implementation
}
```

#### `setActiveContainer(container: ServiceContainer)`

Set the active container for decorator registrations.

### React Hooks

#### `useService<TServiceMap, TServiceKey>(container, serviceKey)`

React hook to resolve a service with component lifecycle management.

#### `getService<TServiceMap, TServiceKey>(container, serviceKey)`

Non-React utility to resolve a service.

#### `createContainerHooks(container)`

Create container-specific hooks to avoid passing container repeatedly.

### Utilities

#### `detectEnvironment(): string`

Detect current environment from common environment variables.

#### `Environment` enum

Predefined environment constants: `Local`, `Development`, `Production`.

## TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Migration from Global Container

If migrating from a version with a global container:

1. Create your own container instance
2. Replace `serviceContainer` imports with your container
3. Call `setActiveContainer()` after initialization
4. Update service constructors to use your container

## License

MIT
