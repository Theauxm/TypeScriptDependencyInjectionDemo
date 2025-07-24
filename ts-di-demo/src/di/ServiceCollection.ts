import { IServiceFactory } from './interfaces/IServiceFactory';

/**
 * Service collection that maintains a registry of service factories.
 * Each service interface can only be registered once to ensure
 * the useService<T>() hook works without ambiguity.
 */
export class ServiceCollection {
  private factories = new Map<string, IServiceFactory<any>>();

  /**
   * Registers a factory for a service interface.
   * @param serviceKey - Unique key identifying the service interface
   * @param factory - Factory instance that creates the service
   */
  register<T>(serviceKey: string, factory: IServiceFactory<T>): void {
    if (this.factories.has(serviceKey)) {
      throw new Error(`Service ${serviceKey} is already registered. Only one registration per service interface is allowed.`);
    }
    this.factories.set(serviceKey, factory);
  }

  /**
   * Gets the factory for a service interface.
   * @param serviceKey - Unique key identifying the service interface
   * @returns The factory instance for the service
   */
  getFactory<T>(serviceKey: string): IServiceFactory<T> {
    const factory = this.factories.get(serviceKey);
    if (!factory) {
      throw new Error(`Service ${serviceKey} is not registered. Make sure to register the service before using it.`);
    }
    return factory;
  }

  /**
   * Checks if a service is registered.
   * @param serviceKey - Unique key identifying the service interface
   * @returns True if the service is registered, false otherwise
   */
  isRegistered(serviceKey: string): boolean {
    return this.factories.has(serviceKey);
  }
}
