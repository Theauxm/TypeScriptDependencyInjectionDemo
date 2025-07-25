import { IColorService } from './services/ColorService/IColorService';
import { ICountService } from './services/CountService/ICountService';
import { ICustomerService } from './services/CustomerService/ICustomerService';

/**
 * Service Registry interface that maps service keys to their types.
 * This provides compile-time type safety for service registration and resolution.
 * 
 * To add a new service:
 * 1. Add the service key and type to this interface
 * 2. Register the service in ServiceRegistration.ts
 * 3. TypeScript will ensure type safety throughout the application
 */
export interface ServiceRegistry {
  'IColorService': IColorService;
  'ICountService': ICountService;
  'ICustomerService': ICustomerService;
}

/**
 * Type-safe service keys derived from the ServiceRegistry.
 * This ensures only valid service keys can be used throughout the application.
 */
export type ServiceKey = keyof ServiceRegistry;

/**
 * Helper type to get the service type for a given service key.
 * This enables proper type inference in the useService hook.
 */
export type ServiceType<K extends ServiceKey> = ServiceRegistry[K];
