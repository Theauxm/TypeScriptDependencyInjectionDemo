import 'reflect-metadata';
import { Container } from 'inversify';
import { IColorServiceId, ICountServiceId, ICustomerServiceId } from './serviceIdentifiers';
import { IColorService } from '../di/interfaces/IColorService';
import { ICountService } from '../di/interfaces/ICountService';
import { ICustomerService } from '../di/interfaces/ICustomerService';
import { InversifyColorService } from './services/InversifyColorService';
import { InversifyCountService } from './services/InversifyCountService';
import { InversifyFakeCustomerService } from './services/InversifyFakeCustomerService';
import { InversifyRealCustomerService } from './services/InversifyRealCustomerService';
import { AppConfig } from '../config/AppConfig';

/**
 * Global Inversify container instance.
 * This container manages all service bindings and their lifetimes.
 */
let container: Container | null = null;

/**
 * Configures and creates the Inversify container with all service bindings.
 * This function encapsulates all service registration logic in a single place.
 */
function createContainer(): Container {
  const inversifyContainer = new Container();

  // Register singleton ColorService
  // This service maintains shared state across all consumers
  inversifyContainer
    .bind<IColorService>(IColorServiceId)
    .to(InversifyColorService)
    .inSingletonScope();

  // Register transient CountService
  // Each resolution gets a new instance (but we'll cache in the React hook)
  inversifyContainer
    .bind<ICountService>(ICountServiceId)
    .to(InversifyCountService)
    .inTransientScope();

  // Register singleton CustomerService with configuration-driven implementation selection
  // The implementation is chosen based on AppConfig.USE_REAL_API setting
  if (AppConfig.USE_REAL_API) {
    inversifyContainer
      .bind<ICustomerService>(ICustomerServiceId)
      .to(InversifyRealCustomerService)
      .inSingletonScope();
  } else {
    inversifyContainer
      .bind<ICustomerService>(ICustomerServiceId)
      .to(InversifyFakeCustomerService)
      .inSingletonScope();
  }

  return inversifyContainer;
}

/**
 * Initializes the global Inversify container.
 * This should be called once at application startup, before any components
 * attempt to use services.
 */
export function initializeInversifyContainer(): void {
  if (container !== null) {
    console.warn('Inversify container is already initialized. Subsequent calls to initializeInversifyContainer() are ignored.');
    return;
  }

  container = createContainer();
}

/**
 * Gets the initialized Inversify container instance.
 * Throws an error if the container hasn't been initialized.
 */
export function getInversifyContainer(): Container {
  if (container === null) {
    throw new Error(
      'Inversify container has not been initialized. Call initializeInversifyContainer() before using services.'
    );
  }
  return container;
}

/**
 * Resets the container instance. This is primarily for testing purposes.
 * In production, the container should only be initialized once.
 */
export function resetInversifyContainer(): void {
  container = null;
}
