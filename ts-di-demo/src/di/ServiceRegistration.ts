import { ServiceContainer } from './ServiceContainer';
import { ColorService } from './services/ColorService/ColorService';
import { CountService } from './services/CountService/CountService';
import { RealCustomerService } from './services/CustomerService/RealCustomerService';
import { FakeCustomerService } from './services/CustomerService/FakeCustomerService';
import { AppConfig } from '../config/AppConfig';

/**
 * Configures and registers all services in the dependency injection container
 * using the new decorator-based system with explicit lifecycle management.
 * 
 * @param container - The ServiceContainer instance to register services with
 */
export function configureServices(container: ServiceContainer): void {
  // Register singleton ColorService
  // This service maintains shared state across all consumers
  container.registerSingleton('IColorService', ColorService);
  
  // Register transient CountService
  // Each component gets its own instance
  container.registerTransient('ICountService', CountService);
  
  // Register singleton CustomerService with configuration-driven implementation selection
  // The implementation is chosen based on AppConfig.USE_REAL_API setting
  if (AppConfig.USE_REAL_API) {
    container.registerSingleton('ICustomerService', RealCustomerService);
  } else {
    container.registerSingleton('ICustomerService', FakeCustomerService);
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
