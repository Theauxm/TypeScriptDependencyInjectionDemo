# Environment-Based Dependency Injection System

This document explains the new environment-based dependency injection system that replaces the previous boolean flag approach.

## Overview

The new system solves several problems with the previous approach:

1. **Boolean Flag Proliferation**: No more individual boolean flags for each service pair
2. **Conflict Detection**: Prevents multiple implementations from being registered simultaneously
3. **Environment-Based Configuration**: Simple environment switching (Local, Development, Production)
4. **Better Scaling**: Easy to add new services without additional configuration flags

## Key Components

### 1. Environment Configuration (`src/di/Environment.ts`)

```typescript
export enum Environment {
  Local = "Local",
  Development = "Development", 
  Production = "Production"
}

// Current environment - change this to switch environments
export const CURRENT_ENVIRONMENT: Environment = Environment.Local;

// Service profiles define which implementations are active in each environment
export const DEFAULT_SERVICE_PROFILE: ServiceProfile = {
  CustomerService: {
    [Environment.Local]: "FakeCustomerService",
    [Environment.Development]: "FakeCustomerService",
    [Environment.Production]: "RealCustomerService"
  },
  AxiosService: {
    [Environment.Local]: "FakeAxiosService",
    [Environment.Development]: "FakeAxiosService",
    [Environment.Production]: "RealAxiosService"
  }
};
```

### 2. Enhanced Service Container (`src/di/ServiceContainer.ts`)

The service container now:
- Tracks registration attempts for debugging
- Validates that only one implementation per service is registered
- Provides detailed error messages for conflicts
- Logs service registration and resolution activities

### 3. Simplified Decorators (`src/di/decorators.ts`)

```typescript
// Clean, simple decorators - environment configuration is handled centrally
@Singleton("CustomerService")
export class FakeCustomerService implements ICustomerService { ... }

@Singleton("CustomerService")
export class RealCustomerService implements ICustomerService { ... }
```

## Usage Examples

### Switching Environments

To switch environments, simply update the `CURRENT_ENVIRONMENT` constant in `Environment.ts`:

```typescript
// For local development with mock services
export const CURRENT_ENVIRONMENT: Environment = Environment.Local;

// For development environment with mock services  
export const CURRENT_ENVIRONMENT: Environment = Environment.Development;

// For production with real services
export const CURRENT_ENVIRONMENT: Environment = Environment.Production;
```

### Adding New Service Pairs

1. **Define the service profile** in `Environment.ts`:
```typescript
export interface ServiceProfile {
  // ... existing services
  NewService: {
    [Environment.Local]: "FakeNewService";
    [Environment.Development]: "FakeNewService";
    [Environment.Production]: "RealNewService";
  };
}
```

2. **Update the default profile**:
```typescript
export const DEFAULT_SERVICE_PROFILE: ServiceProfile = {
  // ... existing services
  NewService: {
    [Environment.Local]: "FakeNewService",
    [Environment.Development]: "FakeNewService",
    [Environment.Production]: "RealNewService"
  }
};
```

3. **Decorate your service implementations**:
```typescript
@Singleton("NewService")
export class FakeNewService implements INewService { ... }

@Singleton("NewService")
export class RealNewService implements INewService { ... }
```

### Service Registration Patterns

**All services use the same simple decorator syntax:**
```typescript
@Singleton("ColorService")
export class ColorService implements IColorService { ... }

@Transient("CountService")
export class CountService implements ICountService { ... }
```

**Environment configuration is handled centrally in Environment.ts:**
```typescript
export const DEFAULT_SERVICE_PROFILE: ServiceProfile = {
  ColorService: {
    [Environment.Local]: "ColorService",
    [Environment.Development]: "ColorService",
    [Environment.Production]: "ColorService"
  },
  CountService: {
    [Environment.Local]: "CountService",
    [Environment.Development]: "CountService",
    [Environment.Production]: "CountService"
  }
};
```

## Error Handling

The system provides detailed error messages for common issues:

### Service Conflicts
```
Service conflict detected for 'CustomerService'!
Attempting to register: RealCustomerService (environments: Production)
Already registered: FakeCustomerService (environments: Local, Development)
All registration attempts: FakeCustomerService, RealCustomerService
Current environment: Local
Expected implementation: FakeCustomerService

Only one implementation per service should be active in each environment.
```

### Missing Services
```
Service 'CustomerService' not registered for environment 'Production'!
Registration attempts: FakeCustomerService
Expected implementation: RealCustomerService
Make sure the correct service implementation is decorated for the current environment.
```


## Benefits

1. **Centralized Configuration**: All environment logic is in one place
2. **Clear Service Mapping**: Easy to see which services are active in each environment
3. **Conflict Prevention**: Impossible to accidentally register multiple implementations
4. **Better Debugging**: Detailed logging and error messages
5. **Scalability**: Adding new services doesn't require new configuration flags
6. **Type Safety**: Environment and service mappings are type-checked

## Testing the System

Use the service container's built-in debugging methods to test and understand the system:

```typescript
import { serviceContainer } from './src/di/ServiceContainer';

// Check registration information
console.log(serviceContainer.getRegistrationInfo());

// Check registration attempts (useful for debugging conflicts)
console.log(serviceContainer.getRegistrationAttempts());

// Test service resolution
const customerService = serviceContainer.resolve("CustomerService");
console.log(`Resolved: ${customerService.constructor.name}`);
```

## Best Practices

1. **Keep service profiles simple**: Most services should follow the pattern of Fake for Local/Development, Real for Production
2. **Use descriptive implementation names**: This helps with debugging and logging
3. **Test environment switching**: Verify that your application works correctly in all environments
4. **Document service behavior**: Clearly document what each service implementation does
5. **Use the debug tools**: Leverage the service container's built-in debugging methods to understand and debug service registration

## Troubleshooting

### Common Issues

1. **Service not found**: Check that the service is decorated for the current environment
2. **Multiple registrations**: Ensure only one implementation is active per environment
3. **Import errors**: Make sure all service files are imported in `services/index.ts`
4. **Environment mismatch**: Verify `CURRENT_ENVIRONMENT` is set correctly

### Debug Tools

- `serviceContainer.getRegistrationInfo()`: Shows all registered services
- `serviceContainer.getRegistrationAttempts()`: Shows all registration attempts
- Console logging: The system logs all registration and resolution activities
