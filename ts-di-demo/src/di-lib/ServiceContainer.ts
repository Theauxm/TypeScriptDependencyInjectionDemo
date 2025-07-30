import type { ServiceKey, ServiceMap, DIConfiguration } from "./types";
import { isServiceEnabledForEnvironment, getExpectedImplementation } from "./Environment";

type ServiceFactory<T> = () => T;

interface ServiceMetadata<T> {
  factory: ServiceFactory<T>;
  singleton: boolean;
  instance?: T;
  implementationName: string;
}

class ServiceContainer<
  TServiceMap extends Record<string, any> = ServiceMap,
  TServiceKeys extends string = keyof TServiceMap & string,
  TEnvironments extends string = string
> {
  private registry = new Map<keyof TServiceMap, ServiceMetadata<any>>();
  private registrationAttempts = new Map<keyof TServiceMap, string[]>();
  private configuration?: DIConfiguration<TServiceKeys, TEnvironments>;

  /**
   * Initialize the container with configuration
   */
  initialize(configuration: DIConfiguration<TServiceKeys, TEnvironments>) {
    this.configuration = configuration;
  }

  register<K extends keyof TServiceMap>(
    key: K,
    factory: ServiceFactory<TServiceMap[K]>,
    singleton: boolean,
    implementationName: string
  ) {
    if (!this.configuration) {
      throw new Error('ServiceContainer must be initialized with configuration before registering services');
    }

    // Track all registration attempts for debugging
    if (!this.registrationAttempts.has(key)) {
      this.registrationAttempts.set(key, []);
    }
    this.registrationAttempts.get(key)!.push(implementationName);

    // Check if this service should be registered in the current environment
    if (!isServiceEnabledForEnvironment(
      String(key) as TServiceKeys,
      implementationName,
      this.configuration.environmentConfig,
      this.configuration.currentEnvironment
    )) {
      return;
    }

    // Check for conflicts - only one implementation per service key should be registered
    if (this.registry.has(key)) {
      const existing = this.registry.get(key)!;
      const allAttempts = this.registrationAttempts.get(key) || [];
      const expectedImpl = getExpectedImplementation(
        String(key) as TServiceKeys,
        this.configuration.environmentConfig,
        this.configuration.currentEnvironment
      );
      
      throw new Error(
        `Service conflict detected for '${String(key)}'!\n` +
        `Attempting to register: ${implementationName}\n` +
        `Already registered: ${existing.implementationName}\n` +
        `All registration attempts: ${allAttempts.join(', ')}\n` +
        `Current environment: ${this.configuration.currentEnvironment}\n` +
        `Expected implementation: ${expectedImpl || 'Not defined'}\n` +
        `\nOnly one implementation per service should be active in each environment.`
      );
    }

    this.registry.set(key, { 
      factory, 
      singleton, 
      implementationName
    });
  }

  resolve<K extends keyof TServiceMap>(key: K): TServiceMap[K] {
    if (!this.configuration) {
      throw new Error('ServiceContainer must be initialized with configuration before resolving services');
    }

    const meta = this.registry.get(key);
    if (!meta) {
      const attempts = this.registrationAttempts.get(key) || [];
      const expected = getExpectedImplementation(
        String(key) as TServiceKeys,
        this.configuration.environmentConfig,
        this.configuration.currentEnvironment
      );
      
      throw new Error(
        `Service '${String(key)}' not registered for environment '${this.configuration.currentEnvironment}'!\n` +
        `Registration attempts: ${attempts.length > 0 ? attempts.join(', ') : 'None'}\n` +
        `Expected implementation: ${expected || 'Not defined'}\n` +
        `Make sure the correct service implementation is decorated for the current environment.`
      );
    }
    
    if (meta.singleton) {
      if (!meta.instance) {
        meta.instance = meta.factory();
      }
      return meta.instance;
    }
    
    return meta.factory();
  }

  /**
   * Get information about registered services for debugging
   */
  getRegistrationInfo(): Record<keyof TServiceMap, { implementation: string; singleton: boolean }> {
    const info: Record<keyof TServiceMap, { implementation: string; singleton: boolean }> = {} as Record<keyof TServiceMap, { implementation: string; singleton: boolean }>;
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
  getRegistrationAttempts(): Record<keyof TServiceMap, string[]> {
    const attempts: Record<keyof TServiceMap, string[]> = {} as Record<keyof TServiceMap, string[]>;
    this.registrationAttempts.forEach((implementations, key) => {
      attempts[key] = implementations;
    });
    return attempts;
  }
}

export { ServiceContainer };
