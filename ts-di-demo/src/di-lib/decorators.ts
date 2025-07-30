import type { ServiceContainer } from "./ServiceContainer";
import { ServiceMap, ServiceKey } from "./types";
import { isServiceSingleton } from "./ServiceLifecycle";

// Global registry to store decorator registrations until a container is provided
interface PendingRegistration {
  key: string;
  factory: () => any;
  singleton: boolean;
  implementationName: string;
}

const pendingRegistrations: PendingRegistration[] = [];
let activeContainer: ServiceContainer<any, any, any> | null = null;

/**
 * Set the active container for decorator registrations
 * This should be called by the consumer after creating and initializing their container
 */
export function setActiveContainer(container: ServiceContainer<any, any, any>) {
  activeContainer = container;
  
  // Register any pending services
  for (const registration of pendingRegistrations) {
    try {
      activeContainer.register(
        registration.key as any,
        registration.factory,
        registration.singleton,
        registration.implementationName
      );
    } catch (error) {
      console.error(`Failed to register pending service ${registration.implementationName}:`, error);
      throw error;
    }
  }
  
  // Clear pending registrations
  pendingRegistrations.length = 0;
}

/**
 * Injectable decorator that registers a service with the active container
 * If no container is active, the registration is queued until one is set
 * @param key - The service key to register under
 */
export function Injectable<K extends keyof ServiceMap>(key: K) {
  return function <T extends { new (...args: any[]): ServiceMap[K] }>(target: T) {
    const implementationName = target.name;
    
    const factory = () => new target();
    
    if (activeContainer) {
      // Register immediately if container is available
      try {
        const configuration = (activeContainer as any).configuration;
        if (!configuration) {
          throw new Error(`ServiceContainer must be initialized with configuration before using @Injectable decorator for ${implementationName}`);
        }
        
        const isSingleton = isServiceSingleton(
          String(key),
          configuration.lifecycleConfig
        );
        
        activeContainer.register(key, factory, isSingleton, implementationName);
      } catch (error) {
        console.error(`Failed to register service ${implementationName}:`, error);
        throw error;
      }
    } else {
      // Queue for later registration
      pendingRegistrations.push({
        key: String(key),
        factory,
        singleton: true, // Will be determined when container is set
        implementationName
      });
    }
  };
}
