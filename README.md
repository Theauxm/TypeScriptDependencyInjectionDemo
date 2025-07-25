# TypeScript Dependency Injection System

This directory contains a clean, abstraction-focused dependency injection system designed for ease of use and maintainability.

## 📁 Directory Structure

```
src/di/
├── index.ts                    # 🚪 Public API - Single entry point
├── services/                   # ✅ User-facing: Where services live
│   ├── ColorService/
│   ├── CountService/
│   └── CustomerService/
├── registration/               # ✅ User-facing: How to register services
│   ├── ServiceRegistry.ts      # Type definitions for services
│   └── ServiceRegistration.ts  # Registration configuration
├── hooks/                      # ✅ User-facing: React integration
│   └── useService.ts           # Hook for consuming services
└── internal/                   # 🔒 Implementation details (hidden)
    ├── ServiceContainer.ts     # Core DI container
    └── decorators.ts           # @Injectable, @Inject decorators
```

## 🎯 Three Simple Concepts

### 1. **Creating Services** (`services/`)
Put your services in the `services/` folder and use the `@Injectable` decorator:

```typescript
import { Injectable } from '../di';

@Injectable
export class MyService implements IMyService {
  // Your service implementation
}
```

### 2. **Registering Services** (`registration/`)
- Add service types to `ServiceRegistry.ts`
- Add service registration to `ServiceRegistration.ts`

```typescript
// ServiceRegistry.ts
export interface ServiceRegistry {
  'IMyService': IMyService;
}

// ServiceRegistration.ts
container.registerSingleton('IMyService', MyService);
```

### 3. **Using Services** (`hooks/`)
Import and use the `useService` hook in your React components:

```typescript
import { useService } from '../di';

const MyComponent = () => {
  const myService = useService('IMyService');
  // Use your service
};
```

## 🚪 Public API

Everything you need is exported from the main `index.ts`:

```typescript
import { 
  useService,           // React hook for consuming services
  Injectable,           // Decorator for service classes
  Inject,              // Decorator for constructor injection
  initializeServices   // Bootstrap function
} from '../di';
```

## 🔒 Implementation Details

The `internal/` folder contains implementation details that users don't need to worry about:
- `ServiceContainer.ts` - Core dependency injection container
- `decorators.ts` - Decorator implementations

## 🎨 Benefits

- **Simple API**: Only 3 concepts to learn
- **Clean Imports**: Single entry point via `index.ts`
- **Hidden Complexity**: Implementation details are tucked away
- **Intuitive Structure**: Folder names clearly indicate purpose
- **Type Safety**: Full TypeScript support throughout
