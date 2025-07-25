import { ServiceContainer } from './ServiceContainer';
import { ColorServiceFactory } from './factories/ColorServiceFactory';
import { CountServiceFactory } from './factories/CountServiceFactory';
import { RealCustomerServiceFactory } from './factories/RealCustomerServiceFactory';
import { FakeCustomerServiceFactory } from './factories/FakeCustomerServiceFactory';
import { AppConfig } from '../config/AppConfig';

/**
 * Configures and registers all services in the dependency injection container.
 * This function encapsulates all service registration logic in a single place,
 * making it easy to manage and modify service configurations.
 * 
 * @param container - The ServiceContainer instance to register services with
 */
export function configureServices(container: ServiceContainer): void {
  // Register singleton ColorService
  // This service maintains shared state across all consumers
  container.register('IColorService', new ColorServiceFactory());
  
  // Register scoped CountService
  // Each component gets its own instance via useRef caching
  container.register('ICountService', new CountServiceFactory());
  
  // Register singleton CustomerService with configuration-driven factory selection
  // The implementation is chosen based on AppConfig.USE_REAL_API setting
  if (AppConfig.USE_REAL_API) {
    container.register('ICustomerService', new RealCustomerServiceFactory());
  } else {
    container.register('ICustomerService', new FakeCustomerServiceFactory());
  }
}

/**
 * Initializes the global service container with all registered services.
 * This should be called once at application startup, before any components
 * attempt to use services.
 * 
 * This function provides a clean, single-responsibility way to bootstrap
 * the dependency injection system.
 */
export function initializeServices(): void {
  ServiceContainer.initialize(configureServices);
}
