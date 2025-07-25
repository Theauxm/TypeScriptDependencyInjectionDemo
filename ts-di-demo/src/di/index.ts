/**
 * TypeScript Dependency Injection - Public API
 * 
 * This is the main entry point for the dependency injection system.
 * Users should import everything they need from this module.
 * 
 * Usage Examples:
 * 
 * 1. Creating a service:
 *    ```typescript
 *    import { Injectable, Inject } from '../di';
 *    
 *    @Injectable
 *    export class MyService {
 *      constructor(@Inject('IOtherService') private other: IOtherService) {}
 *    }
 *    ```
 * 
 * 2. Using a service in React:
 *    ```typescript
 *    import { useService } from '../di';
 *    
 *    const myService = useService('IMyService');
 *    ```
 * 
 * 3. Registering services:
 *    - Add service types to registration/ServiceRegistry.ts
 *    - Add service registration to registration/ServiceRegistration.ts
 */

// React integration
export { useService } from './hooks/useService';

// Service creation decorators
export { Injectable, Inject } from './internal/decorators';

// Service registration
export { initializeServices } from './registration/ServiceRegistration';

// Type definitions for service registration
export type { ServiceKey, ServiceType } from './registration/ServiceRegistry';

// Service lifecycle (optional - for advanced users)
export { ServiceLifetime } from './internal/ServiceContainer';
