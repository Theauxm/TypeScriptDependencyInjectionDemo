# Centralized Lifecycle Management for Dependency Injection

This document explains the enhanced dependency injection system that centralizes both environment and lifecycle management decisions.

## Overview

The system now provides complete separation of concerns:

1. **Service Implementation**: Services focus purely on business logic
2. **Environment Configuration**: Centralized in `Environment.ts`
3. **Lifecycle Configuration**: Centralized in `ServiceLifecycle.ts`
4. **Single Decorator**: All services use `@Injectable("ServiceKey")`

## Key Components

### 1. Service Lifecycle Configuration (`src/di/ServiceLifecycle.ts`)

```typescript
export enum ServiceLifecycle {
  Singleton = "Singleton",
  Transient = "Transient"
}

export const DEFAULT_LIFECYCLE_PROFILE = {
  CustomerService: ServiceLifecycle.Singleton,
  AxiosService: ServiceLifecycle.Singleton,
  ColorService: ServiceLifecycle.Singleton,
  CountService: ServiceLifecycle.Transient,
  PaymentService: ServiceLifecycle.Transient,
  NwycService: ServiceLifecycle.Singleton
} as const;

// Type is automatically derived from the implementation
export type ServiceLifecycleProfile = typeof DEFAULT_LIFECYCLE_PROFILE;
```

### 2. Unified Injectable Decorator (`src/di/decorators.ts`)

```typescript
@Injectable("ServiceKey")
export class MyService implements IMyService {
  // Service implementation only
}
```

The decorator automatically:
- Looks up the lifecycle configuration from `ServiceLifecycle.ts`
- Checks environment configuration from `Environment.ts`
- Registers the service with the correct lifecycle

### 3. Centralized Configuration Files

**Environment Configuration** (`Environment.ts`):
- Defines which implementation is active in each environment
- Maps service keys to implementation names per environment
- Type automatically derived from implementation (single source of truth)

**Lifecycle Configuration** (`ServiceLifecycle.ts`):
- Defines whether each service is Singleton or Transient
- Centralized lifecycle decisions
- Type automatically derived from implementation (single source of truth)

## Benefits

### 1. **Complete Separation of Concerns**
- Services contain only business logic
- Configuration is externalized and centralized
- No lifecycle or environment logic in service code

### 2. **Simplified Service Development**
- Single `@Injectable("ServiceKey")` decorator for all services
- No need to choose between `@Singleton` and `@Transient`
- No environment arrays or boolean flags

### 3. **Centralized Management**
- All lifecycle decisions in one file
- Easy to audit and change service lifecycles
- Clear overview of system architecture

### 4. **Type Safety**
- Lifecycle profiles are fully type-checked
- Compile-time validation of service configurations
- IntelliSense support for configuration

### 5. **Clean Architecture**
- Single decorator pattern for all services
- No legacy code or deprecated patterns
- Modern, maintainable codebase

## Usage Examples

### Adding a New Service

1. **Create the service with `@Injectable`**:
```typescript
@Injectable("NewService")
export class NewService implements INewService {
  // Business logic only
}
```

2. **Configure the lifecycle** in `ServiceLifecycle.ts`:
```typescript
export const DEFAULT_LIFECYCLE_PROFILE: ServiceLifecycleProfile = {
  // ... existing services
  NewService: ServiceLifecycle.Singleton, // or Transient
};
```

3. **Configure the environment** in `Environment.ts`:
```typescript
export const DEFAULT_SERVICE_PROFILE: ServiceProfile = {
  // ... existing services
  NewService: {
    [Environment.Local]: "NewService",
    [Environment.Development]: "NewService", 
    [Environment.Production]: "NewService"
  }
};
```

### Changing Service Lifecycle

Simply update the lifecycle configuration:

```typescript
// Change from Singleton to Transient
export const DEFAULT_LIFECYCLE_PROFILE: ServiceLifecycleProfile = {
  MyService: ServiceLifecycle.Transient, // Changed from Singleton
};
```

No changes needed in service code!

### Service Patterns

**Singleton Services** (single instance):
- API clients (AxiosService)
- Configuration services
- Caching services
- State management services

**Transient Services** (new instance each time):
- Data processing services
- Stateless utility services
- Request-scoped services


## Configuration Reference

### ServiceLifecycle.ts Structure

```typescript
// Single source of truth - implementation defines the type
export const DEFAULT_LIFECYCLE_PROFILE = {
  ServiceKey: ServiceLifecycle.Singleton, // or ServiceLifecycle.Transient
  // ... other services
} as const;

// Type is automatically derived - no duplication possible
export type ServiceLifecycleProfile = typeof DEFAULT_LIFECYCLE_PROFILE;
```

### Environment.ts Structure

```typescript
// Single source of truth - implementation defines the type
export const DEFAULT_SERVICE_PROFILE = {
  ServiceKey: {
    [Environment.Local]: "ServiceImplementation",
    [Environment.Development]: "ServiceImplementation",
    [Environment.Production]: "ServiceImplementation"
  },
  // ... other services
} as const;

// Type is automatically derived - no duplication possible
export type ServiceProfile = typeof DEFAULT_SERVICE_PROFILE;
```

**Key Benefits (Both Files):**
- **Single source of truth**: Type and implementation cannot drift apart
- **Automatic type derivation**: TypeScript infers the exact structure
- **Compile-time safety**: Adding/removing services updates both type and implementation
- **No duplication**: Eliminates maintenance overhead
- **Consistent pattern**: Same approach used across all configuration files

### Utility Functions

```typescript
// Check if a service should be singleton
isServiceSingleton(serviceKey: keyof ServiceLifecycleProfile): boolean

// Get the lifecycle enum value
getServiceLifecycle(serviceKey: keyof ServiceLifecycleProfile): ServiceLifecycle
```

## Best Practices

### 1. **Lifecycle Decisions**
- Use Singleton for stateful services that should be shared
- Use Transient for stateless services or when you need fresh instances
- Consider memory usage and performance implications

### 2. **Configuration Management**
- Keep lifecycle profiles simple and consistent
- Document the reasoning for lifecycle choices
- Review lifecycle decisions during architecture reviews

### 3. **Service Design**
- Design services to be lifecycle-agnostic when possible
- Avoid assumptions about instance sharing in service code
- Use dependency injection for all service dependencies

### 4. **Testing**
- Test services with both Singleton and Transient lifecycles if applicable
- Use the centralized configuration for test environment setup
- Mock lifecycle behavior in unit tests

## Troubleshooting

### Common Issues

1. **Service not found**: Check that the service is configured in both files
2. **Wrong lifecycle**: Verify the lifecycle configuration in `ServiceLifecycle.ts`
3. **Environment mismatch**: Check environment configuration in `Environment.ts`

### Debug Tools

```typescript
// Check current lifecycle configuration
console.log(isServiceSingleton("MyService"));
console.log(getServiceLifecycle("MyService"));

// Check service container registration info
console.log(serviceContainer.getRegistrationInfo());
console.log(serviceContainer.getRegistrationAttempts());
```

## Advanced Scenarios

### Custom Lifecycle Profiles

You can create custom lifecycle profiles for different scenarios:

```typescript
export const TESTING_LIFECYCLE_PROFILE: ServiceLifecycleProfile = {
  // All services as Transient for testing
  CustomerService: ServiceLifecycle.Transient,
  AxiosService: ServiceLifecycle.Transient,
  // ...
};
```

### Runtime Lifecycle Changes

While not recommended for production, you can modify lifecycle behavior at runtime for testing:

```typescript
// For advanced testing scenarios only
DEFAULT_LIFECYCLE_PROFILE.MyService = ServiceLifecycle.Transient;
```

## Future Enhancements

Potential future improvements:
- Scoped lifecycles (Request, Session, etc.)
- Conditional lifecycle based on runtime conditions
- Lifecycle profiling and monitoring
- Integration with external DI containers

## Conclusion

The centralized lifecycle management system provides:
- **Cleaner service code** with single `@Injectable` decorator
- **Centralized configuration** for better maintainability
- **Type safety** and compile-time validation
- **Flexible architecture** that scales with your application

This approach follows the principle of separation of concerns and makes the dependency injection system more maintainable and easier to understand.
