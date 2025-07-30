import { serviceContainer } from "./ServiceContainer";
import { ServiceMap, ServiceKey } from "./types";
import { isServiceSingleton } from "./ServiceLifecycle";

/**
 * Injectable decorator that registers a service with the container
 * The container must be initialized with configuration before using this decorator
 * @param key - The service key to register under
 */
export function Injectable<K extends keyof ServiceMap>(key: K) {
  return function <T extends { new (...args: any[]): ServiceMap[K] }>(target: T) {
    const implementationName = target.name;
    
    // Register immediately - the container should already be initialized
    // since DIInitialization is imported first in services/index.ts
    try {
      // Get the lifecycle configuration from the initialized container
      const configuration = (serviceContainer as any).configuration;
      if (!configuration) {
        throw new Error(`ServiceContainer must be initialized with configuration before using @Injectable decorator for ${implementationName}`);
      }
      
      const isSingleton = isServiceSingleton(
        String(key),
        configuration.lifecycleConfig
      );
      
      serviceContainer.register(key, () => new target(), isSingleton, implementationName);
    } catch (error) {
      console.error(`Failed to register service ${implementationName}:`, error);
      throw error;
    }
  };
}
