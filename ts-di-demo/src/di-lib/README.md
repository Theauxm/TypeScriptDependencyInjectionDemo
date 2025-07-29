# @nwyc/di - Generic Dependency Injection Library

A TypeScript dependency injection library that provides flexible service lifecycle and environment management without being tied to specific service implementations.

## Features

- **Generic Configuration**: No hardcoded service names or implementations
- **Environment-based Service Selection**: Different implementations per environment
- **Lifecycle Management**: Singleton and Transient service lifecycles
- **Type Safety**: Full TypeScript support with generic constraints
- **Decorator Support**: Clean `@Injectable` decorator for service registration

## Installation

```bash
npm install @nwyc/di
```

## Usage

### 1. Define Your Configuration

First, create your service configuration:

```typescript
import { DIConfiguration, Environment } from '@nwyc/di';

// Define your service keys
type MyServiceKeys = 'UserService' | 'ApiService' | 'CacheService';

// Define your environments (or use the built-in Environment enum)
type MyEnvironments = 'Local' | 'Development' | 'Production';

// Create your DI configuration
const myDIConfig: DIConfiguration<MyServiceKeys, MyEnvironments> = {
  lifecycleConfig: {
    UserService: 'Singleton',
    ApiService: 'Singleton', 
    CacheService: 'Transient'
  },
  environmentConfig: {
    UserService: {
      Local: 'MockUserService',
      Development: 'MockUserService',
      Production: 'RealUserService'
    },
    ApiService: {
      Local: 'FakeApiService',
      Development: 'FakeApiService', 
      Production: 'RealApiService'
    },
    CacheService: {
      Local: 'MemoryCacheService',
      Development: 'MemoryCacheService',
      Production: 'RedisCacheService'
    }
  },
  currentEnvironment: 'Local' // Set based on your deployment
};
```

### 2. Initialize the Container

```typescript
import { serviceContainer } from '@nwyc/di';

// Initialize the container with your configuration
serviceContainer.initialize(myDIConfig);
```

### 3. Define Your Services

```typescript
import { Injectable } from '@nwyc/di';

// Define your service interfaces
interface IUserService {
  getUser(id: string): Promise<User>;
}

// Implement your services
@Injectable('UserService')
class MockUserService implements IUserService {
  async getUser(id: string): Promise<User> {
    return { id, name: 'Mock User' };
  }
}

@Injectable('UserService')
class RealUserService implements IUserService {
  async getUser(id: string): Promise<User> {
    // Real implementation
    return await this.apiClient.get(`/users/${id}`);
  }
}
```

### 4. Use Your Services

```typescript
import { serviceContainer } from '@nwyc/di';

// Resolve services from the container
const userService = serviceContainer.resolve('UserService');
const user = await userService.getUser('123');
```

## API Reference

### Types

- `DIConfiguration<TServiceKeys, TEnvironments>`: Main configuration interface
- `ServiceLifecycleConfig<TServiceKeys>`: Maps service keys to lifecycle types
- `ServiceEnvironmentConfig<TServiceKeys, TEnvironments>`: Maps service keys to environment-specific implementations

### Classes

- `ServiceContainer`: Main DI container class
- `serviceContainer`: Pre-instantiated container instance

### Decorators

- `@Injectable(key)`: Registers a class as a service implementation

### Enums

- `ServiceLifecycle`: `Singleton` | `Transient`
- `Environment`: `Local` | `Development` | `Production`

### Utility Functions

- `isServiceSingleton(key, config)`: Check if a service should be singleton
- `getServiceLifecycle(key, config)`: Get the lifecycle for a service
- `isServiceEnabledForEnvironment(key, impl, config, env)`: Check if implementation is enabled
- `getExpectedImplementation(key, config, env)`: Get expected implementation for environment

## Best Practices

1. **Initialize Early**: Call `serviceContainer.initialize()` before any service registration
2. **Environment Configuration**: Use environment variables to set `currentEnvironment`
3. **Type Safety**: Define your service keys as string literal types for better IntelliSense
4. **Service Interfaces**: Always define interfaces for your services for better testability

## Migration from Hardcoded Configuration

If you're migrating from a version with hardcoded configurations:

1. Extract your service names into a type union
2. Move your lifecycle and environment configurations into the `DIConfiguration` object
3. Initialize the container with your configuration before service registration
4. Update any direct imports of configuration objects to use the new generic utilities

## License

MIT
