import type { ServiceKey, ServiceMap } from "./types";
import { Environment, CURRENT_ENVIRONMENT, getExpectedImplementation, isServiceEnabledForEnvironment } from "./Environment";

type ServiceFactory<T> = () => T;

interface ServiceMetadata<T> {
  factory: ServiceFactory<T>;
  singleton: boolean;
  instance?: T;
  implementationName: string;
}

class ServiceContainer {
  private registry = new Map<ServiceKey, ServiceMetadata<any>>();
  private registrationAttempts = new Map<ServiceKey, string[]>();

  register<K extends ServiceKey>(
    key: K,
    factory: ServiceFactory<ServiceMap[K]>,
    singleton: boolean,
    implementationName: string
  ) {
    // Track all registration attempts for debugging
    if (!this.registrationAttempts.has(key)) {
      this.registrationAttempts.set(key, []);
    }
    this.registrationAttempts.get(key)!.push(implementationName);

    // Check if this service should be registered in the current environment
    // using the Environment.ts configuration
    if (!isServiceEnabledForEnvironment(key as any, implementationName, CURRENT_ENVIRONMENT)) {
      console.log(`[ServiceContainer] Skipping registration of ${implementationName} for ${key} - not enabled in ${CURRENT_ENVIRONMENT} environment`);
      return;
    }

    // Check for conflicts - only one implementation per service key should be registered
    if (this.registry.has(key)) {
      const existing = this.registry.get(key)!;
      const allAttempts = this.registrationAttempts.get(key) || [];
      const expectedImpl = getExpectedImplementation(key as any);
      
      throw new Error(
        `Service conflict detected for '${key}'!\n` +
        `Attempting to register: ${implementationName}\n` +
        `Already registered: ${existing.implementationName}\n` +
        `All registration attempts: ${allAttempts.join(', ')}\n` +
        `Current environment: ${CURRENT_ENVIRONMENT}\n` +
        `Expected implementation: ${expectedImpl || 'Not defined'}\n` +
        `\nOnly one implementation per service should be active in each environment.`
      );
    }

    console.log(`[ServiceContainer] Registering ${implementationName} for ${key} in ${CURRENT_ENVIRONMENT} environment`);
    this.registry.set(key, { 
      factory, 
      singleton, 
      implementationName
    });
  }

  resolve<K extends ServiceKey>(key: K): ServiceMap[K] {
    const meta = this.registry.get(key);
    if (!meta) {
      const attempts = this.registrationAttempts.get(key) || [];
      const expected = getExpectedImplementation(key as any);
      
      throw new Error(
        `Service '${key}' not registered for environment '${CURRENT_ENVIRONMENT}'!\n` +
        `Registration attempts: ${attempts.length > 0 ? attempts.join(', ') : 'None'}\n` +
        `Expected implementation: ${expected || 'Not defined'}\n` +
        `Make sure the correct service implementation is decorated for the current environment.`
      );
    }
    
    if (meta.singleton) {
      if (!meta.instance) {
        console.log(`[ServiceContainer] Creating singleton instance of ${meta.implementationName} for ${key}`);
        meta.instance = meta.factory();
      }
      return meta.instance;
    }
    
    console.log(`[ServiceContainer] Creating transient instance of ${meta.implementationName} for ${key}`);
    return meta.factory();
  }

  /**
   * Get information about registered services for debugging
   */
  getRegistrationInfo(): { [key: string]: { implementation: string; singleton: boolean } } {
    const info: any = {};
    this.registry.forEach((meta, key) => {
      info[key] = {
        implementation: meta.implementationName,
        singleton: meta.singleton
      };
    });
    return info;
  }

  /**
   * Get all registration attempts for debugging
   */
  getRegistrationAttempts(): { [key: string]: string[] } {
    const attempts: any = {};
    this.registrationAttempts.forEach((implementations, key) => {
      attempts[key] = implementations;
    });
    return attempts;
  }
}

export const serviceContainer = new ServiceContainer();
