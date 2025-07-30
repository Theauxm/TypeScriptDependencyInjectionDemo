import { ServiceContainer } from '../di-lib/ServiceContainer';
import { setActiveContainer } from '../di-lib/decorators';
import { detectEnvironment, Environment } from '../di-lib/Environment';
import { demoConfiguration, DemoServiceKeys } from './DIConfig';
import type { ServiceMap } from '../di-lib/types';

// Create the demo's service container instance
export const demoServiceContainer = new ServiceContainer<ServiceMap, DemoServiceKeys, Environment>();

/**
 * Initialize the DI container with the demo configuration
 * This must be called before any services are imported/registered
 */
export function initializeDI() {
  const currentEnvironment = detectEnvironment() as Environment;
  
  // Update the configuration with the current environment
  const config = {
    ...demoConfiguration,
    currentEnvironment,
  };

  console.log(`[DI] Initializing service container for environment: ${currentEnvironment}`);
  demoServiceContainer.initialize(config);
  
  // Set this as the active container for decorators
  setActiveContainer(demoServiceContainer);
  
  console.log('[DI] Service container initialized successfully');
}

// Auto-initialize when this module is imported
initializeDI();
