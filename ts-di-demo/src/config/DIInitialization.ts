import { serviceContainer } from '../di-lib/ServiceContainer';
import { CURRENT_ENVIRONMENT } from '../di-lib/Environment';
import { demoConfiguration } from './DIConfig';

/**
 * Initialize the DI container with the demo configuration
 * This must be called before any services are imported/registered
 */
export function initializeDI() {
  // Update the configuration with the current environment
  const config = {
    ...demoConfiguration,
    currentEnvironment: CURRENT_ENVIRONMENT,
  };

  console.log(`[DI] Initializing service container for environment: ${CURRENT_ENVIRONMENT}`);
  serviceContainer.initialize(config);
  console.log('[DI] Service container initialized successfully');
}

// Auto-initialize when this module is imported
initializeDI();
